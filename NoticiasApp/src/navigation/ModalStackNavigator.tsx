// // navigation/ModalStackNavigator.tsx
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import FullScreenCarousel from '../components/FullScreenCarousel';

// export type ModalStackParamList = {
//   Carousel: {
//     modalImages: string[];
//     modalIndex: number;
//   };
// };

// const ModalStack = createNativeStackNavigator<ModalStackParamList>();

// const ModalStackNavigator = () => (
//   <ModalStack.Navigator
//     screenOptions={{
//       presentation: 'transparentModal',
//       headerShown: false,
//     }}
//   >
//     <ModalStack.Screen name="Carousel" component={FullScreenCarousel} />
//   </ModalStack.Navigator>
// );

// export default ModalStackNavigator;
