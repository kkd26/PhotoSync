import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StackParamList} from '.';
import {PhotoDisplay} from '../components';
import {BaseScreen} from './BaseScreen';

type AlbumScreenProps = NativeStackScreenProps<StackParamList, 'Album'>;

export const AlbumScreen = ({route}: AlbumScreenProps) => {
  const {albumTitle} = route.params;

  return (
    <BaseScreen>
      <PhotoDisplay albumTitle={albumTitle} />
    </BaseScreen>
  );
};
