import {Button} from 'react-native';
import React from 'react';

const MenuButton = ({title, page, onPress}) => {
  const handleOnPress = () => {
    onPress(page);
  };

  return <Button title={title} onPress={handleOnPress} />;
};

export default MenuButton;
