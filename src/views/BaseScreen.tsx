import React, {PropsWithChildren} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {getColorAndBackground} from '../styles';

export const BaseScreen = ({children}: PropsWithChildren) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorAndBackground = getColorAndBackground(isDarkMode);
  const style = {...colorAndBackground, flex: 1};

  return (
    <SafeAreaView style={style}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colorAndBackground.backgroundColor}
      />
      {children}
    </SafeAreaView>
  );
};
