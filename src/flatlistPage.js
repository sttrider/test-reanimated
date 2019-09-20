import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import {onScroll} from 'react-native-redash';

const mock = () => {
  const array = [];
  for (let i = 1; i <= 100; i++) {
    array.push({id: i, name: `Item ${i}`});
  }
  return array;
};

const {Value, diffClamp, interpolate} = Animated;

const renderItem = ({item}) => {
  console.log(item);
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.id}</Text>
      <Text style={styles.title}>{item.name}</Text>
    </View>
  );
};

const keyExtractor = item => `${item.id}`;

const y = new Value(0);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const FlatlistPage = () => {
  const data = mock();

  const diffClampY = diffClamp(y, 0, 200);
  const translateY = interpolate(y, {
    inputRange: [0, 200],
    outputRange: [0, -200],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.areaTopo, {transform: [{translateY: translateY}]}]}
      />
      <AnimatedFlatList
        initialNumToRender={7}
        keyExtractor={keyExtractor}
        data={data}
        renderItem={renderItem}
        windowSize={7}
        maxToRenderPerBatch={7}
        updateCellsBatchingPeriod={7}
        onScroll={onScroll({y: y})}
        contentContainerStyle={{paddingTop: 200}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  areaTopo: {
    backgroundColor: 'tomato',
    height: 200,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default FlatlistPage;
