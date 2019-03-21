import moment from 'moment'


export function get_spend_by_date( transactions, date ) {
	return transactions.reduce((sum, transaction) => {
		if ( transaction.amount > 0 || transaction.transfer_account_id != null  || transaction.date !== date || transaction.category_name === 'Work expenses' ) {
			return sum;
		}
		return sum + transaction.amount;
	}, 0)
}

export function get_spend_between_dates( transactions, start_date, end_date ) {
	return transactions.reduce( return_transaction_value_if_between_dates( start_date, end_date ), 0 )
	// return transactions.reduce((sum, transaction) => {
	// 	if ( transaction.amount > 0 || transaction.transfer_account_id != null || transaction.category_name === 'Work expenses') {
	// 		return sum;
	// 	}
	// 	return sum + transaction.amount;
	// }, 0)
	//
	// return 0;
}

function return_transaction_value_if_between_dates( start_date, end_date ) {
	return function(accumulator, transaction) {
		if ( moment( transaction.date ).isSameOrAfter( start_date ) && moment( transaction.date ).isSameOrBefore( end_date ) ) {
			if ( transaction.transfer_account_id === null && transaction.category_name !== 'Work expenses' ) {
				if ( transaction.amount < 0 || transaction.category_name !== "Immediate Income SubCategory" ) {
					accumulator = accumulator + transaction.amount;
				}
			}
		}
		return accumulator;
	}
}

export function get_transactions_by_day( transactions, end_date, goal ) {
	let transactionsByDay = [];
	let accumulatedSpend = 0;
	for (let day = 0; day < 31; day++) {
		const date = moment( end_date ).subtract( 1, 'months' ).add( day, 'days' ).format( 'YYYY-MM-DD' );
		let dayObject = {};

		if ( moment(date).isAfter() || ( moment(date).date() < day ) ) {
			dayObject = {
				date: 'invalid',
				daysLeftInMonth: 0,
				transactions: [],
				totalSpend: 0,
				accumulatedSpend: 0,
				availableSpend: 0,
				availableSpendPerDay: 0,
			}
		} else {
			dayObject = {
				date: date,
				daysLeftInMonth: moment( date ).daysInMonth() - moment( date ).date() + 1,
				transactions: transactions.filter( function(transaction) {
						if ( moment( end_date ).subtract( 1, 'months' ).month() !== moment(transaction.date).month() ) {
							return false;
						}
						if ( transaction.date === moment( end_date ).subtract( 1, 'months' ).add( day, 'days' ).format( 'YYYY-MM-DD' )
						&& transaction.amount < 0
						&&  transaction.transfer_account_id === null
						&&  transaction.category_name !== 'Work expenses' ) {
							return true;
						}
						return false;
					}),
				totalSpend: 0,
				accumulatedSpend: 0,
				availableSpendPerDay: 0,
			}
			dayObject.totalSpend = dayObject.transactions.reduce( (dayTotal, transaction) => dayTotal + transaction.amount, 0 );
			dayObject.availableSpendPerDay = ( (goal*1000) + accumulatedSpend ) / dayObject.daysLeftInMonth;
			dayObject.accumulatedSpend = accumulatedSpend;
			dayObject.availableSpend = (goal*1000) + accumulatedSpend;
			dayObject.accumulatedSpendIncludingToday = accumulatedSpend = accumulatedSpend + dayObject.totalSpend;
		}
		transactionsByDay.push( dayObject);
	}
	return transactionsByDay;
}
