import React, {useCallback, useEffect, useState} from 'react';
import {Image, Modal, Pressable} from 'react-native';
import {styles} from '../styles';
import {getServerAddress} from '../utils';

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
            <Image source={{uri}} style={styles.image} />
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
};
