// // navigation/AppNavigator.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import TabNavigator from './TabNavigator';
// import ModalStackNavigator from './ModalStackNavigator';

// type RootStackParamList = {
//   Main: undefined;
//   Modal: undefined;
// };

// const RootStack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator = () => (
//   <NavigationContainer>
//     <RootStack.Navigator screenOptions={{ headerShown: false }}>
//       <RootStack.Screen name="Main" component={TabNavigator} />
//       <RootStack.Screen name="Modal" component={ModalStackNavigator} />
//     </RootStack.Navigator>
//   </NavigationContainer>
// );

// export default AppNavigator;
