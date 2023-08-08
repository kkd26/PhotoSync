/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Platform,
} from 'react-native';
import {getColorAndBackground, styles} from './styles';
import {Section, AlbumList} from './components';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const colorAndBackground = getColorAndBackground(isDarkMode);

  return (
    <SafeAreaView style={colorAndBackground}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colorAndBackground.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={colorAndBackground}>
        <View style={colorAndBackground}>
          <Section title="Albums">Version: {Platform.Version}</Section>
        </View>
        <View style={[colorAndBackground, styles.sectionContainer]}>
          <AlbumList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
