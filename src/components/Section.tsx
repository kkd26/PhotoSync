import type {PropsWithChildren} from 'react';
import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles';
import {useStyle} from '../utils';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export function Section({children, title}: SectionProps): JSX.Element {
  const {color, backgroundColor} = useStyle();
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, {color, backgroundColor}]}>
        {title}
      </Text>
      <View style={[styles.sectionDescription, {backgroundColor}]}>
        {children}
      </View>
    </View>
  );
}
