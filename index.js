var React = require('react-native');
var {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  View,
} = React;

var {
  width,
  height
} = Dimensions.get('window');

var Slider = React.createClass({

  getInitialState() {
    return {
      progress: new Animated.Value(0),
      value: 0,
    };
  },

  componentWillMount() {
    this.responder = PanResponder.create({
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderRelease,
    });
  },

  onMoveShouldSetPanResponder(e, gestureState) {
    return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
  },

  onPanResponderMove(e, gestureState) {

    var dx = gestureState.dx;
    var offsetX = dx - this.state.value * this.props.width;
    var toValue = -1 * offsetX / this.props.width;

    this.state.progress.setValue(toValue);

    this.props.onMove && this.props.onMove(toValue);

  },

  onPanResponderRelease(e, gestureState) {

    var rx = gestureState.dx / this.props.width,
        vx = gestureState.vx,
        toValue = this.state.value;

    if (rx < -0.5 || (rx < 0 && vx <=0.5)) {
      toValue = toValue + 1;
    } else if (rx >= 0.5 || (rx > 0 && vx >=0.5)) {
      toValue = toValue - 1;
    }

    toValue = Math.max(0, Math.min(toValue, this.props.size - 1));

    this.setState({
      value: toValue,
    });

    this.props.onRelease && this.props.onRelease(toValue);

  },

  render() {
    return (
      <Animated.View
        {...this.responder.panHandlers}
        style={{
          flex: 1,
          transform: [{
            translateX: this.props.slide,
          },],
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }

});

var Zoomer = React.createClass({

  getInitialState() {
    return {
      progress: new Animated.Value(0),
      value: 0,
    };
  },

  componentWillMount() {
    this.responder = PanResponder.create({
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderRelease,
    });
  },

  onMoveShouldSetPanResponder(e, gestureState) {
    if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
      if (gestureState.dy > 0 && this.state.value === 0 || this.state.value === 1 && gestureState.dy < 0) {
        return true;
      }
    }
  },

  onPanResponderMove(e, gestureState) {

    var dy = gestureState.dy;
    var offsetY = dy + this.state.value * (this.props.height / 2);
    var toValue = offsetY / (this.props.height / 2);

    this.state.progress.setValue(toValue);

    this.props.onMove && this.props.onMove(toValue);

  },

  onPanResponderRelease(e, gestureState) {

    var ry = gestureState.dy / (this.props.height / 2),
        vy = gestureState.vy,
        toValue = this.state.value;

    if (ry < -0.5 || (ry < 0 && vy <=0.5)) {
      toValue = 0;
    } else if (ry >= 0.5 || (ry > 0 && vy >=0.5)) {
      toValue = 1;
    }

    this.setState({
      value: toValue,
    });

    this.props.onRelease && this.props.onRelease(toValue);

  },

  render() {
    return (
      <Animated.View
        {...this.responder.panHandlers}
        style={{
          flex: 1,
          transform: [{
            scale: this.props.zoom,
          },],
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  },

});

var Switcher = React.createClass({

  getInitialState() {
    return {
      height: 0,
      width: 0,
      zoom: new Animated.Value(0),
      slide: new Animated.Value(0),
    };
  },

  onZoomMove(toValue) {
    this.state.zoom.setValue(toValue);
  },

  onZoomRelease(toValue) {
    Animated.spring(this.state.zoom, {
      toValue: toValue,
      friction: 7,
      tension: 70,
    }).start();
  },

  onSlideMove(toValue) {
    this.state.slide.setValue(toValue);
  },

  onSlideRelease(toValue) {
    Animated.spring(this.state.slide, {
      toValue: toValue,
      friction: 10,
      tension: 50,
    }).start();
  },

  onLayout(e) {
    var {height, width} = e.nativeEvent.layout;
    this.setState({height, width});
  },

  render() {
    return (
      <View
        onLayout={this.onLayout}
        style={{
          flex: 1,
        }}
      >
        <Zoomer
          height={this.state.height}
          size={this.props.children.length}
          onMove={this.onZoomMove}
          onRelease={this.onZoomRelease}
          zoom={this.state.zoom.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 3 / 4],
          })}
        >
          <Slider
            width={this.state.width}
            size={this.props.children.length}
            onMove={this.onSlideMove}
            onRelease={this.onSlideRelease}
            slide={this.state.slide.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -this.state.width],
            })}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                width: this.state.width * this.props.children.length,
              }}
            >
              {this.props.children}
            </View>
          </Slider>
        </Zoomer>
      </View>
    );
  },

});

module.exports = Switcher;
