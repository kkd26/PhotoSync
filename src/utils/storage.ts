import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_ADDRESS_KEY = 'server-address';

export const saveServerAddress = (serverAddress: string) => {
  return AsyncStorage.setItem(SERVER_ADDRESS_KEY, serverAddress);
};

export const getServerAddress = async () => {
  const value = await AsyncStorage.getItem(SERVER_ADDRESS_KEY);
  if (value !== null) {
    return value;
  }
  throw Error('Server not set');
};
