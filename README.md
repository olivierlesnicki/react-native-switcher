# react-native-switcher

## Installation

```
npm install react-native-switcher --save
```

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
