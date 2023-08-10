import {Album, CameraRoll} from '@react-native-camera-roll/camera-roll';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {hasAndroidPermission} from '../utils';
import {Section} from './Section';

type AlbumViewProps = PropsWithChildren<{
  onPress: () => void;
}>;

const AlbumView = ({children, onPress}: AlbumViewProps) => {
  const style = {
    padding: 2,
    borderWidth: 1,
  };

  return (
    <Pressable style={style} onPress={onPress}>
      {children}
    </Pressable>
  );
};

type AlbumListProps = {
  handle: (albumTitle: string) => void;
};

export const AlbumList = ({handle}: AlbumListProps) => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    hasAndroidPermission()
      .then(() => {
        CameraRoll.getAlbums().then(setAlbums);
      })
      .catch(err => console.log(err));
  }, []);

  const textStyle = {
    fontSize: 24,
  };

  return (
    <Section title="Albums:">
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {albums.map(({title, count}, id) => (
          <AlbumView key={id} onPress={() => handle(title)}>
            <Text style={textStyle}>{`${title} ${count}`}</Text>
          </AlbumView>
        ))}
      </ScrollView>
    </Section>
  );
};
