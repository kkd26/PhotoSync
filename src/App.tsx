import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AlbumScreen, HomeScreen, StackParamList} from './views';

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'PhotoSync'}}
        />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={({route}) => ({
            title: route.params.albumTitle,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
