import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {hash as hashAlg} from 'react-native-fs';
import {hasAndroidPermission} from '../utils';
import {Photo, arePhotosSync, submitPhoto} from '../utils/api';
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
  photosToSync: Set<string>;
  albumTitle: string;
  callback: () => void;
};

const PhotoView = ({
  photo,
  albumTitle,
  photosToSync,
  callback,
}: PhotoViewProps) => {
  const style = {marginBottom: 8};

  const notSync = photosToSync.has(photo.hash);
  const color = notSync ? 'red' : 'green';
  const textStyle = {color};

  const onPress = () => {
    submitPhoto(albumTitle, photo).then(callback);
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
  const [photosToSync, setPhotosToSync] = useState<Set<string>>(new Set());

  const checkSyncPhotos = useCallback(() => {
    arePhotosSync(albumTitle, photos).then(hashes =>
      setPhotosToSync(new Set(hashes)),
    );
  }, [albumTitle, photos]);

  useEffect(() => {
    hasAndroidPermission()
      .then(() => {
        CameraRoll.getPhotos({
          first: 10,
          groupName: albumTitle,
          assetType: 'All',
        })
          .then(({edges}) => edges.map(transformToPhoto))
          .then(promises => Promise.all(promises).then(setPhotos));
      })
      .catch(err => console.log(err));
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
            callback={checkSyncPhotos}
          />
        ))}
      </ScrollView>
    </Section>
  );
};
