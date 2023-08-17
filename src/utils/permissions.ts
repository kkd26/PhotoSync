import {PermissionsAndroid, Platform} from 'react-native';

export const hasMediaAccessPermission = async () => {
  if (Platform.OS !== 'android') {
    throw 'Not android';
  }

  const getCheckPermission = async () => {
    if (Number(Platform.Version) >= 33) {
      const [hasReadMediaImagesPermission, hasReadMediaVideoPermission] =
        await Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]);
      return hasReadMediaImagesPermission && hasReadMediaVideoPermission;
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };

  if (await getCheckPermission()) {
    return;
  }

  const getRequestPermission = async () => {
    if (Number(Platform.Version) >= 33) {
      const statuses = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      return (
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  if (await getRequestPermission()) {
    return;
  }

  throw 'No permission to access media';
};
