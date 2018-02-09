//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { ExampleBridge } = NativeModules

export default {
  exampleMethod () {
    return ExampleBridge.exampleMethod()
  },

  EXAMPLE_CONSTANT: ExampleBridge.EXAMPLE_CONSTANT
}
