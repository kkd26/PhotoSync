import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
} from 'react-native';
import {styles} from '../styles';
import {getServerAddress} from '../utils';

type PhotoViewProps = {
  albumTitle: string;
  hash: string;
};

const PhotoView = ({albumTitle, hash}: PhotoViewProps) => {
  const [uri, setUri] = useState<string>();

  const displayPicture = useCallback(async () => {
    const host = await getServerAddress();
    setUri(`${host}/photos/${albumTitle}/${hash}`);
  }, [albumTitle, hash]);

  useEffect(() => {
    displayPicture();
  }, [albumTitle, hash, displayPicture]);

  const style = {
    marginBottom: 8,
  };

  return (
    <Pressable style={style} onPress={() => {}}>
      {uri && <Image source={{uri}} style={styles.image} />}
    </Pressable>
  );
};

type PhotoScrolledProps = {
  albumTitle: string;
  syncedHashes: string[];
};

export const PhotoScrolled = ({
  albumTitle,
  syncedHashes,
}: PhotoScrolledProps) => {
  const pageSize = 2;
  const [hashesToDisplay, setHashesToDisplay] = useState<string[]>([]);

  useEffect(() => {
    console.debug('Set new size to', pageSize);
    setHashesToDisplay(syncedHashes.slice(0, pageSize));
  }, [syncedHashes]);

  const addNextPage = () => {
    const size = hashesToDisplay.length + pageSize;
    console.debug('Set new size to', size);
    setHashesToDisplay(syncedHashes.slice(0, size));
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  };

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isCloseToBottom(nativeEvent)) {
      addNextPage();
    }
  };

  return (
    <ScrollView
      onScroll={handleScroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollable}>
      {hashesToDisplay.map(hash => (
        <PhotoView key={hash} hash={hash} albumTitle={albumTitle} />
      ))}
    </ScrollView>
  );
};
