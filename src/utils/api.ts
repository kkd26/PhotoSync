export type Photo = {
  uri: string;
  name: string;
  type: string;
  date: string;
  hash: string;
};

const HOST = 'http://192.168.1.110:8080/api';

export const submitPhoto = async (albumTitle: string, photo: Photo) => {
  const body = new FormData();
  body.append('albumTitle', {
    string: albumTitle,
    type: 'plain/text',
  });
  body.append('hash', {
    string: photo.hash,
    type: 'plain/text',
  });
  body.append('image', photo);

  return await fetch(`${HOST}/upload`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body,
  })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
};

export const arePhotosSync = async (
  albumTitle: string,
  photos: Photo[],
): Promise<string[]> => {
  const hashes = photos.map(photo => photo.hash);
  const body = JSON.stringify({albumTitle, hashes});

  return await fetch(`${HOST}/getSync`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then(response => response.json())
    .then(res => {
      console.log('To Sync', res);
      return res;
    })
    .catch(err => {
      console.log(err);
    });
};
