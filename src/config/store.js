import {createStore, applyMiddleware} from 'redux';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';
import logger from 'redux-logger';
import reducer from '../reducers';

const makeConfiguredStore = (reducer) =>
    createStore(reducer, undefined, applyMiddleware(logger));

const makeStore = () => {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    return makeConfiguredStore(reducer);
  } else {

    // we need it only on client side
    const {persistStore, persistReducer} = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
      key: 'nextjs',
      whitelist: ['user', 'enemy'], // make sure it does not clash with server keys
      storage
    };

    const persistedReducer = persistReducer(persistConfig, reducer);
    const store = makeConfiguredStore(persistedReducer);

    store.__persistor = persistStore(store); // Nasty hack

    return store;
  }
};

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, {debug: true});
