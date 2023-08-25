import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native';
import {styles} from '../styles';
import {getServerAddress} from '../utils';
import {PhotoModal} from './PhotoModal';

const numColumns = 4;

type PhotoViewProps = {
  albumTitle: string;
  hash: string;
  handlePress: () => void;
  parentWidth: number;
};

const PhotoView = ({
  albumTitle,
  hash,
  handlePress,
  parentWidth,
}: PhotoViewProps) => {
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

  const width = parentWidth / numColumns;

  return (
    <Pressable style={style} onPress={handlePress}>
      {uri && <Image source={{uri}} style={[styles.thumbnailImage, {width}]} />}
    </Pressable>
  );
};

type PhotoScrolledProps = {
  albumTitle: string;
  syncedHashes: string[];
};

export const PhotoGallery = ({
  albumTitle,
  syncedHashes,
}: PhotoScrolledProps) => {
  const [hashInModal, setHashInModal] = useState<string>();
  const [elementWidth, setElementWidth] = useState(0);
  const pageSize = 30;

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

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setElementWidth(width);
  };

  const renderItem: ListRenderItem<string> = ({item}) => {
    const hash = item;
    return (
      <PhotoView
        key={hash}
        hash={hash}
        albumTitle={albumTitle}
        handlePress={() => setHashInModal(hash)}
        parentWidth={elementWidth}
      />
    );
  };

  return (
    <View onLayout={handleLayout}>
      <PhotoModal
        albumTitle={albumTitle}
        hash={hashInModal}
        closeCallback={() => setHashInModal(undefined)}
      />
      <FlatList
        data={hashesToDisplay}
        renderItem={renderItem}
        numColumns={numColumns}
        onScroll={handleScroll}
      />
    </View>
  );
};
