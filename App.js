import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import Load from './src/views/Load';
import Home from './src/views/Home';
import Profile from './src/views/Profile';

import Navigator from './src/components/Navigator';

export default App = () => {
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
