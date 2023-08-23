import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useCallback, useEffect, useState} from 'react';
import {Text} from 'react-native';
import {hash as hashAlg} from 'react-native-fs';
import {
  Photo,
  arePhotosSync,
  getPhotos,
  hasMediaAccessPermission,
  submitPhoto,
} from '../utils';
import {PhotoScrolled} from './PhotoScrolled';
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

type PhotosToSync = {
  photos: Photo[];
  count: number;
};

export const PhotoList = ({albumTitle}: PhotoListProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [syncedHashes, setSyncedHashes] = useState<string[]>([]);
  const [photosToSync, setPhotosToSync] = useState<PhotosToSync>({
    photos: [],
    count: 0,
  });
  const [hashesToSync, setHashesToSync] = useState<Set<string>>(new Set());

  const fetchSyncedHashes = useCallback(() => {
    getPhotos(albumTitle).then(setSyncedHashes).catch(console.error);
  }, [albumTitle]);

  // get photos from device
  useEffect(() => {
    hasMediaAccessPermission()
      .then(() => {
        CameraRoll.getPhotos({
          first: 20,
          groupName: albumTitle,
          assetType: 'Photos',
        })
          .then(({edges}) => edges.map(transformToPhoto))
          .then(promises => Promise.all(promises).then(setPhotos));
      })
      .catch(console.error);

    fetchSyncedHashes();
  }, [albumTitle, fetchSyncedHashes]);

  // set hashes to sync
  useEffect(() => {
    if (photos.length > 0) {
      arePhotosSync(albumTitle, photos)
        .then(hashes => setHashesToSync(new Set(hashes)))
        .catch(console.error);
    }
  }, [albumTitle, photos]);

  // get photos to sync
  useEffect(() => {
    if (hashesToSync.size > 0) {
      setPhotosToSync({
        photos: photos.filter(({hash}) => hashesToSync.has(hash)),
        count: photos.length,
      });
    }
  }, [albumTitle, hashesToSync, photos]);

  // sync photos
  useEffect(() => {
    const onPhotoSubmitted = () => {
      setPhotosToSync(state => {
        return {
          photos: state.photos,
          count: state.count - 1,
        };
      });
      fetchSyncedHashes();
    };

    const promises = photosToSync.photos.map(photo =>
      submitPhoto(albumTitle, photo)
        .then(onPhotoSubmitted)
        .catch(console.error),
    );

    promises.length &&
      Promise.all(promises).then(() => {
        console.log('Done syncing photos');
      });
  }, [albumTitle, photosToSync.photos, fetchSyncedHashes]);

  return (
    <Section title={`Photos in ${albumTitle}:`}>
      <Text>
        Syncing {photosToSync.count} out of {photos.length}
      </Text>
      <PhotoScrolled syncedHashes={syncedHashes} albumTitle={albumTitle} />
    </Section>
  );
};
