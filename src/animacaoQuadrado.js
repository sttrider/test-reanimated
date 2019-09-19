import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {TapGestureHandler, State} from 'react-native-gesture-handler';

const {
  Clock,
  startClock,
  stopClock,
  clockRunning,
  timing,
  event,
  cond,
  eq,
  Value,
  block,
  set,
  debug,
  sub,
} = Animated;

const duration = 1000;

const resetClock = (state, config, dest) => {
  return [
    set(state.finished, 0),
    set(state.frameTime, 0),
    set(state.time, 0),
    set(config.toValue, dest),
    set(config.duration, duration),
  ];
};

const AnimacaoQuadrado = () => {
  const gestureState = new Value(-1);
  const state = {
    finished: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
    position: new Value(1),
  };
  const clock = new Clock();
  const config = {
    duration: duration,
    easing: Easing.linear,
    toValue: new Value(0.2),
  };
  const timeSyncedWithClock = new Value(0);

  const _opacity = block([
    cond(
      eq(gestureState, State.BEGAN),
      [
        cond(
          clockRunning(clock),
          [
            debug('rodando a', set(config.toValue, 0.2)),
            set(timeSyncedWithClock, 1),
          ],
          [...resetClock(state, config, 0.2), startClock(clock)],
        ),
      ],
      [
        //debug('rodando c', set(state.frameTime, 0)),
        cond(
          clockRunning(clock),
          [
            cond(eq(timeSyncedWithClock, 1), [
              set(state.frameTime, sub(config.duration, state.frameTime)),
              set(timeSyncedWithClock, 0),
            ]),
            debug('rodando b', set(config.toValue, 1)),
          ],
          [...resetClock(state, config, 1), startClock(clock)],
        ),
      ],
    ),
    timing(clock, state, config),
    cond(state.finished, [
      debug('stop clock', stopClock(clock)),
      set(timeSyncedWithClock, 0),
    ]),
    state.position,
  ]);

  const onStateChange = event([
    {
      nativeEvent: {
        state: gestureState,
      },
    },
  ]);

  return (
    <View style={styles.container}>
      <TapGestureHandler onHandlerStateChange={onStateChange}>
        <Animated.View style={[styles.box, {opacity: _opacity}]} />
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'tomato',
    width: 150,
    height: 150,
  },
});

export default AnimacaoQuadrado;
