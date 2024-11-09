import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import Load from './src/pages/Load';
import Navigator from './src/navigation/Navigator';

const App = () => {
  const [loadPage, setLoadPage] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadPage(false);
    }, 2000);

  }, []);

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      { loadPage ? 
        <Load /> 
        : 
        <Navigator />
      }
    </View>
  );
};
export default App;
