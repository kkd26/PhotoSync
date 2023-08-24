import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  scrollable: {
    flexGrow: 1,
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 0,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
});
