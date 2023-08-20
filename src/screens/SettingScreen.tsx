import React, {useEffect, useState} from 'react';
import {Keyboard, Pressable, Text, TextInput} from 'react-native';
import {Section} from '../components';
import {styles} from '../styles';
import {
  getServerAddress,
  saveServerAddress,
  serverStatus,
  useStyle,
} from '../utils';
import {BaseScreen} from './BaseScreen';

export const SettingsScreen = () => {
  const [serverAddress, setServerAddress] = useState('');
  const {color, backgroundColor} = useStyle();
  const [colorAccent, setColorAccent] = useState(color);

  useEffect(() => {
    getServerAddress().then(setServerAddress).catch(console.error);
  }, []);

  const handleVerify = () => {
    serverStatus(serverAddress)
      .then(saveServerAddress)
      .then(() => setColorAccent('green'))
      .then(Keyboard.dismiss)
      .catch(err => {
        setColorAccent('red');
        console.error(err);
      });
  };

  const inputStyle = {fontSize: 20, color: colorAccent};
  return (
    <BaseScreen>
      <Section title="Server address:">
        <TextInput
          style={inputStyle}
          placeholder="Please input server address"
          onChangeText={setServerAddress}
          defaultValue={serverAddress}
        />
        <Pressable
          onPress={handleVerify}
          style={[styles.button, {backgroundColor: color}]}>
          <Text style={[styles.text, {color: backgroundColor}]}>Verify</Text>
        </Pressable>
      </Section>
    </BaseScreen>
  );
};
