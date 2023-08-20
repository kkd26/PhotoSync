import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, Text} from 'react-native';
import {
  AlbumScreen,
  HomeScreen,
  SettingsScreen,
  StackParamList,
} from './screens';
import {styles} from './styles';
import {useStyle} from './utils';

const SettingsButton = (navigation: any) => {
  const {color: backgroundColor, backgroundColor: color} = useStyle();
  return (
    <Pressable
      onPress={() => navigation.navigate('Settings')}
      style={[styles.button, {backgroundColor}]}>
      <Text style={[styles.text, {color}]}>Settings</Text>
    </Pressable>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  const {color, backgroundColor} = useStyle();
  const headerStyle = {
    headerStyle: {
      backgroundColor,
    },
    headerTintColor: color,
    headerTitleStyle: {
      color,
    },
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({navigation}) => ({
            title: 'PhotoSync',
            headerRight: () => SettingsButton(navigation),
            ...headerStyle,
          })}
        />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={({route}) => ({
            title: route.params.albumTitle,
            ...headerStyle,
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Settings', ...headerStyle}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
