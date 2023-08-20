import React, {PropsWithChildren} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {useStyle} from '../utils';

export const BaseScreen = ({children}: PropsWithChildren) => {
  const {color, backgroundColor, barStyle} = useStyle();
  const style = {color, backgroundColor, flex: 1};

  return (
    <SafeAreaView style={style}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  );
};
