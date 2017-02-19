import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import persistState from 'redux-localstorage';

import rootReducer from '../reducers';
import { fetchData } from '../actions';
import { sendMessageMiddleware } from '../utils';

const loggerMiddleware = createLogger();

const enhancer = compose(
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
    sendMessageMiddleware({ blacklist: [] })
  ),
  persistState('data')
);

let store = createStore(rootReducer, enhancer);
store.dispatch(fetchData());
