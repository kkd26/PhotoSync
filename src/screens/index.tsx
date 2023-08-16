export * from './AlbumScreen';
export * from './HomeScreen';
export * from './SettingScreen';

export type StackParamList = {
  Home: undefined;
  Album: {albumTitle: string};
  Settings: undefined;
};
