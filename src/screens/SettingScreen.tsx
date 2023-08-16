import React, {useEffect, useState} from 'react';
import {Button, TextInput} from 'react-native';
import {Section} from '../components';
import {getServerAddress, saveServerAddress} from '../utils/storage';
import {BaseScreen} from './BaseScreen';

export const SettingsScreen = () => {
  const [serverAddress, setServerAddress] = useState('');

  useEffect(() => {
    getServerAddress()
      .then(setServerAddress)
      .catch(err => console.log(err));
  }, []);

  const handleVerify = () => {
    // TODO verify server address
    saveServerAddress(serverAddress);
  };

  const inputStyle = {fontSize: 20};
  return (
    <BaseScreen>
      <Section title="Server address:">
        <TextInput
          style={inputStyle}
          placeholder="Please input server address"
          onChangeText={setServerAddress}
          defaultValue={serverAddress}
        />
        <Button onPress={handleVerify} title="Verify" color="black" />
      </Section>
    </BaseScreen>
  );
};
