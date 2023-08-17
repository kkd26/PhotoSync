import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {hash as hashAlg} from 'react-native-fs';
import {
  Photo,
  arePhotosSync,
  hasMediaAccessPermission,
  submitPhoto,
} from '../utils';
import {Section} from './Section';

const transformToPhoto = async (raw: PhotoIdentifier): Promise<Photo> => {
  const uri = raw.node.image.uri;
  const nameFromUri = uri.split('/').at(-1) || 'no uri';
  const name = raw.node.image.filename || nameFromUri;
  const type = raw.node.type;
  const date = new Date(raw.node.timestamp * 1000).toISOString();
  const hash = await hashAlg(uri, 'sha256');
  return {uri, name, type, date, hash};
};

type PhotoViewProps = {
  photo: Photo;
  photosToSync?: Set<string>;
  albumTitle: string;
  onPhotoSubmitted: () => void;
};

const PhotoView = ({
  photo,
  albumTitle,
  photosToSync,
  onPhotoSubmitted,
}: PhotoViewProps) => {
  const style = {marginBottom: 8};

  const notSync = !photosToSync || photosToSync.has(photo.hash);
  const color = notSync ? 'red' : 'green';
  const textStyle = {color};

  const onPress = () => {
    submitPhoto(albumTitle, photo).then(onPhotoSubmitted).catch(console.error);
  };

  return (
    <Pressable style={style} onPress={onPress}>
      <Text style={textStyle}>{photo.name}</Text>
      <Text style={textStyle}>{photo.date}</Text>
    </Pressable>
  );
};

type PhotoListProps = {
  albumTitle: string;
};

export const PhotoList = ({albumTitle}: PhotoListProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosToSync, setPhotosToSync] = useState<Set<string>>();

  const checkSyncPhotos = useCallback(() => {
    arePhotosSync(albumTitle, photos)
      .then(hashes => setPhotosToSync(new Set(hashes)))
      .catch(console.error);
  }, [albumTitle, photos]);

  useEffect(() => {
    hasMediaAccessPermission()
      .then(() => {
        CameraRoll.getPhotos({
          first: 10,
          groupName: albumTitle,
          assetType: 'All',
        })
          .then(({edges}) => edges.map(transformToPhoto))
          .then(promises => Promise.all(promises).then(setPhotos));
      })
      .catch(console.error);
  }, [albumTitle]);

  useEffect(() => {
    if (photos.length > 0) {
      checkSyncPhotos();
    }
  }, [checkSyncPhotos, photos.length]);

  return (
    <Section title={`Photos in ${albumTitle}:`}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {photos.map(photo => (
          <PhotoView
            key={photo.hash}
            photo={photo}
            albumTitle={albumTitle}
            photosToSync={photosToSync}
            onPhotoSubmitted={checkSyncPhotos}
          />
        ))}
      </ScrollView>
    </Section>
  );
};
