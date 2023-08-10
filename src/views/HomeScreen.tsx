import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StackParamList} from '.';
import {AlbumList} from '../components';
import {BaseScreen} from './BaseScreen';

type HomeScreenProps = NativeStackScreenProps<StackParamList, 'Home'>;

export const HomeScreen = ({navigation}: HomeScreenProps) => {
  return (
    <BaseScreen>
      <AlbumList
        handle={(albumTitle: string) =>
          navigation.navigate('Album', {albumTitle})
        }
      />
    </BaseScreen>
  );
};
