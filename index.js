/**
 * @format
 */

import App from './App';
import {Navigation} from 'react-native-navigation';
import FlatlistPage from './src/flatlistPage';
import AnimacaoQuadrado from './src/animacaoQuadrado';

Navigation.registerComponent('App', () => App);
Navigation.registerComponent('FlatlistPage', () => FlatlistPage);
Navigation.registerComponent('AnimacaoQuadrado', () => AnimacaoQuadrado);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'App',
            },
          },
        ],
      },
    },
  });
});
