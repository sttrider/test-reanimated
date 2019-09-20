import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Animated from 'react-native-reanimated';

const {Value, interpolate, set, event, Extrapolate} = Animated;

const mock = () => {
  const array = [];
  for (let i = 1; i <= 1000; i++) {
    array.push({id: i, name: `Item ${i}`});
  }
  return array;
};

const renderItem = ({item}) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.id}</Text>
      <Text style={styles.title}>{item.name}</Text>
    </View>
  );
};

const keyExtractor = item => `${item.id}`;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const data = mock();
const Y = new Value(0);

const handleScroll = event(
  [
    {
      nativeEvent: {
        contentOffset: {y: y => set(Y, y)},
      },
    },
  ],
  {useNativeDriver: true},
);

const FlatlistPage = () => {
  const [heightHeader, setHeightHeader] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < 5000; i++) {
        console.log('blocking thread');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const handleOnLayout = ({nativeEvent}) => {
    setHeightHeader(nativeEvent.layout.height);
  };

  const translateY = interpolate(Y, {
    inputRange: [0, heightHeader],
    outputRange: [0, -heightHeader],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View style={styles.container}>
      <Animated.View
        onLayout={handleOnLayout}
        style={[
          styles.areaTopo,
          {
            transform: [
              {
                translateY: translateY,
              },
            ],
          },
        ]}
      />

      {heightHeader > 0 && (
        <AnimatedFlatList
          initialNumToRender={10}
          keyExtractor={keyExtractor}
          data={data}
          renderItem={renderItem}
          windowSize={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={10}
          onScroll={handleScroll}
          contentContainerStyle={{paddingTop: heightHeader}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  areaTopo: {
    backgroundColor: 'tomato',
    height: 300,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  item: {
    backgroundColor: '#f9c2ff',
    //height: 100,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default FlatlistPage;
