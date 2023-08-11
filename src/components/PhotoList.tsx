import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {hasAndroidPermission} from '../utils';
import {Section} from './Section';

const HOST = 'http://192.168.1.110:8080/api/upload';

type Photo = {
  uri: string;
  name: string;
  type: string;
  date: string;
};

const transformToPhoto = (raw: PhotoIdentifier): Photo => {
  const uri = raw.node.image.uri;
  const nameFromUri = uri.split('/').at(-1) || 'no uri';
  const name = raw.node.image.filename || nameFromUri;
  const type = raw.node.type;
  const date = new Date(raw.node.timestamp * 1000).toISOString();
  return {uri, name, type, date};
};

type PhotoViewProps = PropsWithChildren<{photoData: Photo; albumTitle: string}>;

const PhotoView = ({children, photoData, albumTitle}: PhotoViewProps) => {
  const style = {marginBottom: 8};

  const body = new FormData();
  body.append('albumTitle', {
    string: albumTitle,
    type: 'plain/text',
  });
  body.append('image', photoData);

  const submitPhoto = () => {
    fetch(HOST, {
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

  return (
    <Pressable style={style} onPress={submitPhoto}>
      {children}
    </Pressable>
  );
};

type PhotoListProps = {
  albumTitle: string;
};

export const PhotoList = ({albumTitle}: PhotoListProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    hasAndroidPermission()
      .then(() => {
        CameraRoll.getPhotos({
          first: 10,
          groupName: albumTitle,
          assetType: 'All',
        })
          .then(({edges}) => edges.map(transformToPhoto))
          .then(setPhotos);
      })
      .catch(err => console.log(err));
  }, [albumTitle]);

  return (
    <Section title={`Photos in ${albumTitle}:`}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {photos.map((photoData, id) => (
          <PhotoView key={id} photoData={photoData} albumTitle={albumTitle}>
            <Text>{photoData.name}</Text>
            <Text>{photoData.date}</Text>
          </PhotoView>
        ))}
      </ScrollView>
    </Section>
  );
};
