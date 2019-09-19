import React from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';
import MenuButton from './src/componente/MenuButton';

const App = ({componentId}) => {
  const handleOnPress = page => {
    Navigation.push(componentId, {
      component: {
        name: page,
      },
    });
  };

  return (
    <View style={styles.container}>
      <MenuButton
        title={'Animação Quadrado'}
        onPress={handleOnPress}
        page={'AnimacaoQuadrado'}
      />
      <MenuButton
        title={'Flatlist Page'}
        onPress={handleOnPress}
        page={'FlatlistPage'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
