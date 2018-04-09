import { ACCOUNT_TRADE } from '../actions/account-actions';

export default function accountTrade (state = {}, {type, payload}){
	switch (type){
		case ACCOUNT_TRADE:
			return payload.account
		default:
			return state
	}
}