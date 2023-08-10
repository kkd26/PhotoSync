import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {hasAndroidPermission} from '../utils';
import {Section} from './Section';

type Photo = {
  filename: string;
  date: string;
};

const transformToPhoto = (raw: PhotoIdentifier): Photo => {
  const nameFromUri = raw.node.image.uri.split('/').at(-1) || 'no uri';
  const filename = raw.node.image.filename || nameFromUri;
  const dateObject = new Date(raw.node.timestamp * 1000);
  return {filename, date: dateObject.toISOString()};
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

  const viewStyle = {marginBottom: 8};

  return (
    <Section title={`Photos in ${albumTitle}:`}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {photos.map(({filename, date}, id) => (
          <View key={id} style={viewStyle}>
            <Text>{date}</Text>
            <Text>{filename}</Text>
          </View>
        ))}
      </ScrollView>
    </Section>
  );
};
