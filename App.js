import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import Load from './src/pages/Load';
import Navigator from './src/navigation/Navigator';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? 
        <Load /> 
        : 
        <Navigator />
      }
    </View>
  );
};
export default App;
