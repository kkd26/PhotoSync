import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageURISource,
  Modal,
  Pressable,
} from 'react-native';
import {styles} from '../styles';
import {getServerAddress} from '../utils';

type ImageWithAspectRatioProps = {
  source: ImageURISource;
};

const ImageWithAspectRatio = ({source}: ImageWithAspectRatioProps) => {
  const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});

  const calculateAspectRatio = () => {
    const {width, height} = imageDimensions;
    if (width > 0 && height > 0) {
      const imageAspectRatio = width / height;
      return imageAspectRatio;
    }
    return 1;
  };

  const getImageDimensions = () => {
    const imageAspectRatio = calculateAspectRatio();
    const {width, height} = Dimensions.get('window');

    if (width < height) {
      const imageWidth = width;
      const imageHeight = imageWidth / imageAspectRatio;
      return {imageWidth, imageHeight};
    } else {
      const imageHeight = height;
      const imageWidth = imageHeight * imageAspectRatio;
      return {imageWidth, imageHeight};
    }
  };

  useEffect(() => {
    const {uri} = source;

    uri &&
      Image.getSize(uri, (width, height) => {
        setImageDimensions({width, height});
      });
  }, [source]);

  const {imageWidth, imageHeight} = getImageDimensions();

  return (
    <Image
      source={source}
      style={[styles.image, {width: imageWidth, height: imageHeight}]}
    />
  );
};

type PhotoModalProps = {
  albumTitle: string;
  hash?: string;
  closeCallback: () => void;
};

export const PhotoModal = ({
  albumTitle,
  hash,
  closeCallback,
}: PhotoModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [uri, setUri] = useState<string>();

  const displayPhoto = useCallback(async () => {
    const host = await getServerAddress();
    setUri(`${host}/photos/${albumTitle}/${hash}`);
  }, [albumTitle, hash]);

  useEffect(() => {
    if (hash !== undefined) {
      displayPhoto();
    }
  }, [hash, displayPhoto]);

  useEffect(() => {
    if (uri !== undefined) {
      setModalVisible(true);
    }
  }, [uri]);

  useEffect(() => {
    if (!modalVisible) {
      setUri(undefined);
    }
  }, [modalVisible]);

  const style = {backgroundColor: '#00000075'};

  const closeModal = () => {
    setModalVisible(false);
    closeCallback();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <Pressable style={[styles.centeredView, style]} onPress={closeModal}>
        {uri && (
          <Pressable onPress={e => e.stopPropagation()}>
            <ImageWithAspectRatio source={{uri}} />
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
};
