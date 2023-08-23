import {Album, CameraRoll} from '@react-native-camera-roll/camera-roll';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {styles} from '../styles';
import {hasMediaAccessPermission, useStyle} from '../utils';
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
  const {color} = useStyle();

  useEffect(() => {
    hasMediaAccessPermission()
      .then(() => {
        CameraRoll.getAlbums().then(setAlbums);
      })
      .catch(console.error);
  }, []);

  const textStyle = {
    fontSize: 24,
    color,
  };

  return (
    <Section title="Albums:">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollable}>
        {albums.map(({title, count}, id) => (
          <AlbumView key={id} onPress={() => handle(title)}>
            <Text style={textStyle}>{`${title} ${count}`}</Text>
          </AlbumView>
        ))}
      </ScrollView>
    </Section>
  );
};
