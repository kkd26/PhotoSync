import type {PropsWithChildren} from 'react';
import React from 'react';
import {getColorAndBackground, styles} from '../styles';

import {Text, useColorScheme, View} from 'react-native';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, getColorAndBackground(isDarkMode)]}>
        {title}
      </Text>
      <View
        style={[styles.sectionDescription, getColorAndBackground(isDarkMode)]}>
        {children}
      </View>
    </View>
  );
}
