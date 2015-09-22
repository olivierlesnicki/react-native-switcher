# react-native-switcher

A dead simple zoomable-swiper made popular by the Kardashians' apps.

## Installation

```
npm install react-native-switcher --save
```

## Demo

![demo](/demo.gif?raw=true)

## Usage

```js
var Switcher = require('react-native-switcher');
var App = React.createClass({
  render() {
    return (
      <Switcher>
        <View style={{flex: 1, backgroundColor: 'green'}} />
        <View style={{flex: 1, backgroundColor: 'orange'}} />
        <View style={{flex: 1, backgroundColor: 'red'}} />
      </Switcher>
    )
  }
})
```
