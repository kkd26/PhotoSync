import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {styles} from '../styles';
import {getServerAddress} from '../utils';
import {PhotoModal} from './PhotoModal';

type PhotoViewProps = {
  albumTitle: string;
  hash: string;
  handlePress: () => void;
};

const PhotoView = ({albumTitle, hash, handlePress}: PhotoViewProps) => {
  const [uri, setUri] = useState<string>();

  const displayThumbnail = useCallback(async () => {
    const host = await getServerAddress();
    setUri(`${host}/photos/.tmb/${albumTitle}/${hash}`);
  }, [albumTitle, hash]);

  useEffect(() => {
    displayThumbnail();
  }, [albumTitle, hash, displayThumbnail]);

  const style = {
    marginBottom: 8,
  };

  return (
    <Pressable style={style} onPress={handlePress}>
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
  const pageSize = 3;

  const [hashesToDisplay, setHashesToDisplay] = useState<string[]>([]);
  const [hashInModal, setHashInModal] = useState<string>();

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
    <View>
      <PhotoModal
        albumTitle={albumTitle}
        hash={hashInModal}
        closeCallback={() => setHashInModal(undefined)}
      />
      <ScrollView
        onScroll={handleScroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollable}>
        {hashesToDisplay.map(hash => (
          <PhotoView
            key={hash}
            hash={hash}
            albumTitle={albumTitle}
            handlePress={() => setHashInModal(hash)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
