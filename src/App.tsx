import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button} from 'react-native';
import {
  AlbumScreen,
  HomeScreen,
  SettingsScreen,
  StackParamList,
} from './screens';

const SettingsButton = (navigation: any) => {
  return (
    <Button
      onPress={() => navigation.navigate('Settings')}
      title="Settings"
      color="black"
    />
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({navigation}) => ({
            title: 'PhotoSync',
            headerRight: () => SettingsButton(navigation),
          })}
        />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={({route}) => ({
            title: route.params.albumTitle,
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Settings'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
