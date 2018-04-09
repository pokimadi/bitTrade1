export const ACCOUNT_TRADE = 'account:accoutTrade';

export function accoutTrade(newAccount){
	return {
		type: ACCOUNT_TRADE,
		payload:{
			account: newAccount
		}
	}
} 