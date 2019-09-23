import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
} from 'react-native-gesture-handler';

const {
  Value,
  interpolate,
  set,
  event,
  Extrapolate,
  debug,
  add,
  multiply,
  cond,
  eq,
  block,
  lessThan,
} = Animated;

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
const dragY = new Value(0);
const state = new Value(0);
const dragging = new Value(0);
const start = new Value(0);

const handleScroll = event([
  {
    nativeEvent: {
      contentOffset: {y: y => debug('scroll', set(Y, y))},
    },
  },
]);

const _onGestureEvent = event([
  {
    nativeEvent: {
      translationY: y => set(dragY, y),
      state: s => set(state, s),
    },
  },
]);

const FlatlistPage = () => {
  const [heightHeader, setHeightHeader] = useState(0);

  useEffect(() => {
    const executeBlockThread = false;
    let interval = null;
    if (executeBlockThread) {
      interval = setInterval(() => {
        for (let i = 0; i < 5000; i++) {
          console.log('blocking thread');
        }
      }, 1000);
    }

    return () => {
      if (executeBlockThread) {
        clearInterval(interval);
      }
    };
  });

  const handleOnLayout = ({nativeEvent}) => {
    setHeightHeader(nativeEvent.layout.height);
  };

  const trans = () => {
    return block([
      cond(
        eq(state, State.ACTIVE),
        debug('setY', set(Y, add(start, multiply(dragY, -1)))),
        [set(start, Y), cond(lessThan(Y, 0), set(Y, 0))],
      ),
      debug('state', state),
      debug('Y', Y),
      Y.interpolate({
        inputRange: [0, heightHeader],
        outputRange: [0, -heightHeader],
        extrapolate: Extrapolate.CLAMP,
      }),
    ]);
  };

  const height = interpolate(Y, {
    inputRange: [0, heightHeader],
    outputRange: [heightHeader, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const scrollRef = React.createRef();

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={_onGestureEvent}
        onHandlerStateChange={_onGestureEvent}
        maxPointers={1}>
        <Animated.View
          onLayout={handleOnLayout}
          style={[
            styles.areaTopo,
            {
              transform: [
                {
                  translateY: trans(),
                },
              ],
            },
          ]}
        />
      </PanGestureHandler>

      {heightHeader > 0 && (
        <PanGestureHandler
          minDist={0}
          simultaneousHandlers={scrollRef}
          onGestureEvent={_onGestureEvent}
          onHandlerStateChange={_onGestureEvent}>
          <Animated.View style={styles.container}>
            <Animated.View style={{width: '100%', height}} />
            <FlatList
              initialNumToRender={10}
              keyExtractor={keyExtractor}
              data={data}
              renderItem={renderItem}
              windowSize={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={10}
              onGestureEvent={_onGestureEvent}
              renderScrollComponent={props => (
                <Scroller handlerRef={scrollRef} {...props} />
              )}
            />
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
};

const Scroller = ({handlerRef, ...props}) => (
  <NativeViewGestureHandler ref={handlerRef}>
    <ScrollView {...props} />
  </NativeViewGestureHandler>
);

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
