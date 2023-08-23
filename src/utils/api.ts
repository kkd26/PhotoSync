import {getServerAddress} from './storage';

export type Photo = {
  uri: string;
  name: string;
  type: string;
  date: number;
  hash: string;
};

export const serverStatus = async (host: string) => {
  const timeoutDuration = 5000;
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutDuration);

  return await fetch(`${host}/api`, {signal: controller.signal})
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw 'Network response was not ok';
      }
      return response.json();
    })
    .then(({status}) => {
      if (status === 'ok') {
        console.log('Server address verified');
        return host;
      }
      throw 'Server status is not ok';
    })
    .catch(error => {
      const reason: string =
        error.name === 'AbortError'
          ? `Request timed out in ${timeoutDuration}ms`
          : error;
      throw `Cannot check server status. ${reason}`;
    });
};

export const submitPhoto = async (albumTitle: string, photo: Photo) => {
  const host = await getServerAddress();

  const body = new FormData();
  body.append('albumTitle', {
    string: albumTitle,
    type: 'plain/text',
  });
  body.append('hash', {
    string: photo.hash,
    type: 'plain/text',
  });
  body.append('date', {
    string: photo.date.toString(),
    type: 'plain/text',
  });
  body.append('image', photo);

  return await fetch(`${host}/api/upload`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body,
  })
    .then(({status}) => {
      switch (status) {
        case 201:
          console.log('Photo uploaded successfully');
          break;
        case 304:
          console.log('Photo already uploaded');
          break;
        default:
          console.error(`Unexpected status ${status}`);
          break;
      }
    })
    .catch(_ => {
      throw 'Cannot upload photo';
    });
};

export const arePhotosSync = async (
  albumTitle: string,
  photos: Photo[],
): Promise<string[]> => {
  const host = await getServerAddress();

  const hashes = photos.map(photo => photo.hash);
  const body = JSON.stringify({albumTitle, hashes});

  return await fetch(`${host}/api/getSync`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then(response => response.json())
    .then(res => {
      console.log('Photos that need to be sync', res);
      return res;
    })
    .catch(_ => {
      throw 'Cannot check if photos are in sync';
    });
};

export const getPhotos = async (albumTitle: string): Promise<string[]> => {
  const host = await getServerAddress();

  return await fetch(`${host}/api/getPhotos/${albumTitle}`, {
    method: 'get',
  })
    .then(response => response.json())
    .catch(_ => {
      throw 'Cannot get photos';
    });
};
