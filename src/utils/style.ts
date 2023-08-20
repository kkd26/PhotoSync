import {StatusBarStyle, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const getColorAndBackground = (isDarkMode: boolean) => {
  const color = isDarkMode ? Colors.white : Colors.black;
  const backgroundColor = isDarkMode ? Colors.black : Colors.white;

  return {color, backgroundColor};
};

export const useStyle = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const barStyle: StatusBarStyle = isDarkMode
    ? 'light-content'
    : 'dark-content';
  const {color, backgroundColor} = getColorAndBackground(isDarkMode);
  return {color, backgroundColor, barStyle};
};
