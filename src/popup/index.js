import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import persistState from 'redux-localstorage';
import rootReducer from '../reducers';
import App from '../components/App';

const loggerMiddleware = createLogger();

const enhancer = compose(
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  persistState('data')
);

let store = createStore(rootReducer, enhancer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);

if (module && module.hot) {
  module.hot.accept('../components/App', () => {
    const App = require('../components/App').default;
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.querySelector('#root')
    );
  });
}
