import { Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';

export const root: ViewStyle = {
  flex: 1,
  flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  backgroundColor: '#f5f8fa',
};

export const sidebar: ViewStyle = {
  backgroundColor: '#fff',
  borderRightWidth: 1,
  borderRightColor: '#e6ecf0',
  paddingVertical: 32,
  paddingHorizontal: 8,
  justifyContent: 'flex-start',
  alignItems: 'center',
};

export const sidebarTitle: TextStyle = {
  fontWeight: 'bold',
  fontSize: 22,
  color: '#1da1f2',
  marginBottom: 32,
  letterSpacing: 1,
  textAlign: 'center',
};

export const sidebarItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 8,
  borderRadius: 8,
  marginBottom: 8,
};

export const sidebarItemActive: ViewStyle = {
  backgroundColor: '#e3f2fd',
};

export const sidebarLabel: TextStyle = {
  marginLeft: 16,
  fontSize: 16,
  color: '#222',
  fontWeight: '500',
};

export const logoutItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 8,
  borderRadius: 8,
  marginBottom: 8,
};

export const logoutLabel: TextStyle = {
  marginLeft: 16,
  fontSize: 16,
  color: '#b71c1c',
  fontWeight: 'bold',
};

export const mainContent: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
};

export const container: ViewStyle = {
  flexGrow: 1,
  padding: 20,
  backgroundColor: '#fff',
  width: '100%',
  alignSelf: 'stretch',
  borderRadius: Platform.OS === 'web' ? 16 : 0,
};

export const title: TextStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'center',
};

export const subtitle: TextStyle = {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 30,
  marginBottom: 10,
};

export const profilePicContainer: ViewStyle = {
  alignSelf: 'center',
  marginBottom: 20,
};

export const profilePic: ImageStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
};

export const profilePicPlaceholder: TextStyle = {
  color: '#888',
  padding: 20,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 40,
  textAlign: 'center',
};

export const form: ViewStyle = {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 10,
  marginVertical: 20,
};

export const input: TextStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

export const imagePicker: ViewStyle = {
  alignItems: 'center',
  marginBottom: 10,
};

export const propertyImage: ImageStyle = {
  width: 120,
  height: 80,
  borderRadius: 8,
  marginBottom: 5,
};

export const rightSidebar: ViewStyle = {
  backgroundColor: '#fff',
  borderLeftWidth: 1,
  borderLeftColor: '#e6ecf0',
  paddingVertical: 32,
  paddingHorizontal: 8,
  alignItems: 'center',
  justifyContent: 'flex-start',
};

export const fabSidebarHandleRight: ViewStyle = {
  position: 'absolute',
  right: 8,
  top: '50%',
  transform: [{ translateY: -28 }],
  zIndex: 1000,
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(29,161,242,0.85)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#fff',
  opacity: 0.92,
};

export const fabSidebarHandleLeft: ViewStyle = {
  position: 'absolute',
  left: 8,
  top: '50%',
  transform: [{ translateY: -28 }],
  zIndex: 1000,
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(29,161,242,0.85)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#fff',
  opacity: 0.92,
};

export const fabHandleText: TextStyle = {
  color: '#fff',
  fontSize: 28,
  fontWeight: 'bold',
  textAlign: 'center',
  lineHeight: 32,
  opacity: 0.95,
};