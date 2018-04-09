import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { combineReducers, createStore } from "redux";

import { Provider } from 'react-redux';


import userReducer from "./reducers/user-reducer";

import accountReducer from "./reducers/account-reducer"

const allReducers = combineReducers({
	user: userReducer,
	account: accountReducer
});

const store = createStore( //Store Created  so other top level application will have easy and controlled Access.
	allReducers,
	{
		user: 'Micheal',
		account: {
			balanceUsd: 156.12, //Initializing Balance
      		balanceBtc: 0.0
		}
	},
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Using this for time travel debug.
);


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
