import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';

const mock = () => {
  const array = [];
  for (let i = 1; i <= 1000; i++) {
    array.push({id: i, name: `Item ${i}`});
  }
  return array;
};

const {
  Value,
  interpolate,
  block,
  cond,
  greaterOrEq,
  set,
  event,
  lessOrEq,
} = Animated;

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

const FlatlistPage = () => {
  const [heightHeader, setHeightHeader] = useState(0);

  const data = mock();
  const Y = new Value(0);

  useEffect(() => {
    setInterval(() => {
      for (let i = 0; i < 5000; i++) {
        console.log('blocking thread');
      }
    }, 1000);
  });

  const handleOnLayout = ({nativeEvent}) => {
    setHeightHeader(nativeEvent.layout.height);
  };

  const handlePan = event([
    {
      nativeEvent: ({contentOffset: {y: y}}) =>
        block([
          cond(
            greaterOrEq(y, 1),
            [set(Y, y)],
            [cond(lessOrEq(y, heightHeader), [set(Y, 0)])],
          ),
        ]),
    },
  ]);

  const translateY = interpolate(Y, {
    inputRange: [0, heightHeader],
    outputRange: [0, -heightHeader],
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
          onScroll={handlePan}
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
    height: 200,
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
