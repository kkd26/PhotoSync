import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useReducer} from 'react';
import {Text} from 'react-native';
import {hash as hashAlg} from 'react-native-fs';
import {
  Photo,
  checkHashes,
  getSyncedHashes,
  hasMediaAccessPermission,
  uploadPhoto,
} from '../utils';
import {PhotoGallery} from './PhotoGallery';
import {Section} from './Section';

const transformToPhoto = async (raw: PhotoIdentifier): Promise<Photo> => {
  const uri = raw.node.image.uri;
  const nameFromUri = uri.split('/').at(-1) || 'no uri';
  const name = raw.node.image.filename || nameFromUri;
  const type = raw.node.type;
  const date = raw.node.timestamp;
  const hash = await hashAlg(uri, 'sha256');
  return {uri, name, type, date, hash};
};

type PhotoListProps = {
  albumTitle: string;
};

type PhotoDisplayState = {
  devicePhotos: Photo[];
  page_info: {
    has_next_page: boolean;
    start_cursor?: string;
    end_cursor?: string;
  };
  syncedHashes: string[];
  hashesToSync: Set<string>;
  photosToSync: Photo[];
  count: number;
  after: string;
};

const initState: PhotoDisplayState = {
  devicePhotos: [],
  page_info: {
    has_next_page: false,
  },
  syncedHashes: [],
  hashesToSync: new Set(),
  photosToSync: [],
  count: 0,
  after: '0',
};

enum UpdateType {
  DevicePhotosAndPageInfo = 0,
  SyncedHashes,
  HashesToSync,
  PhotosToSync,
  DecrementCount,
  DoneSyncing,
}

type PhotoDisplayAction = {
  type: UpdateType;
  payload?: any;
};

const reducer = (
  state: PhotoDisplayState,
  action: PhotoDisplayAction,
): PhotoDisplayState => {
  const {type, payload} = action;
  switch (type) {
    case UpdateType.DevicePhotosAndPageInfo:
      return {
        ...state,
        devicePhotos: payload.devicePhotos,
        page_info: payload.page_info,
      };
    case UpdateType.SyncedHashes:
      return {
        ...state,
        syncedHashes: payload.syncedHashes,
      };
    case UpdateType.HashesToSync:
      return {
        ...state,
        hashesToSync: payload.hashesToSync,
      };
    case UpdateType.PhotosToSync:
      return {
        ...state,
        photosToSync: state.devicePhotos.filter(({hash}) =>
          state.hashesToSync.has(hash),
        ),
        count: state.hashesToSync.size,
      };
    case UpdateType.DecrementCount:
      return {...state, count: state.count - 1};
    case UpdateType.DoneSyncing:
      return {...state, after: state.page_info.end_cursor || state.after};
  }
};

export const PhotoDisplay = ({albumTitle}: PhotoListProps) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const batchSize = 5;

  // get photos from device
  useEffect(() => {
    hasMediaAccessPermission()
      .then(() => {
        CameraRoll.getPhotos({
          first: batchSize,
          after: state.after,
          groupName: albumTitle,
          assetType: 'Photos',
        })
          .then(({edges, page_info}) => {
            return {promises: edges.map(transformToPhoto), page_info};
          })
          .then(({promises, page_info}) =>
            Promise.all(promises).then(devicePhotos =>
              dispatch({
                type: UpdateType.DevicePhotosAndPageInfo,
                payload: {devicePhotos, page_info},
              }),
            ),
          );
      })
      .catch(console.error);

    getSyncedHashes(albumTitle)
      .then(syncedHashes =>
        dispatch({type: UpdateType.SyncedHashes, payload: {syncedHashes}}),
      )
      .catch(console.error);
  }, [albumTitle, state.after]);

  // set hashes to sync
  useEffect(() => {
    if (state.devicePhotos.length > 0) {
      checkHashes(albumTitle, state.devicePhotos)
        .then(hashes =>
          dispatch({
            type: UpdateType.HashesToSync,
            payload: {hashesToSync: new Set(hashes)},
          }),
        )
        .catch(console.error);
    }
  }, [albumTitle, state.devicePhotos]);

  // get photos to sync and count
  useEffect(() => {
    if (state.hashesToSync.size > 0) {
      dispatch({type: UpdateType.PhotosToSync});
    }
  }, [albumTitle, state.hashesToSync]);

  // sync photos
  useEffect(() => {
    if (state.photosToSync.length > 0) {
      const onPhotoSubmitted = (syncedHashes: string[]) => {
        if (syncedHashes) {
          dispatch({type: UpdateType.SyncedHashes, payload: {syncedHashes}});
        }

        dispatch({type: UpdateType.DecrementCount});
      };

      const promises = state.photosToSync.map(photo =>
        uploadPhoto(albumTitle, photo)
          .then(onPhotoSubmitted)
          .catch(console.error),
      );

      promises.length &&
        Promise.all(promises).then(() => {
          dispatch({type: UpdateType.DoneSyncing});
        });
    }
  }, [albumTitle, state.photosToSync]);

  return (
    <Section title={`Photos in ${albumTitle}:`}>
      {state.count !== 0 && (
        <Text>
          Syncing {state.count} out of {state.photosToSync.length}
        </Text>
      )}
      <PhotoGallery syncedHashes={state.syncedHashes} albumTitle={albumTitle} />
    </Section>
  );
};
