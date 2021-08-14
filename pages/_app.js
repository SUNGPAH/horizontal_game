import React from 'react';
import {wrapper} from '../src/config/store';
import '../styles/globals.css'

import {PersistGate} from 'redux-persist/integration/react';
import {useStore} from 'react-redux'

export default wrapper.withRedux(({Component, pageProps}) => {  
  const isServer = typeof window === 'undefined';

  if (process.env.NODE_ENV !== "development")
    console.log = () => {};

  if(isServer){
    return <>
      <Component {...pageProps} />
    </>
  }

  const store = useStore();

  return (
    <PersistGate persistor={store.__persistor}>
      <Component {...pageProps} />
    </PersistGate>
  );
});
