import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from '../reducers';
import { fetchData } from '../actions';

const loggerMiddleware = createLogger();

let store = createStore(
  rootReducer,
  [ {} ],
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

store.dispatch(fetchData());
