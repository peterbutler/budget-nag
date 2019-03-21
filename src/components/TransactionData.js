import React from 'react';
import moment from 'moment'

import Breakdowns from './Breakdowns'
import TotalSpend from './TotalSpend'
import TransactionList from './TransactionList'
import ChartByDay from './ChartByDay'
import ReChartByDay from './ReChartByDay'

import {get_spend_between_dates} from '../helpers/transactions'

class TransactionData extends React.Component {
  constructor(props) {
    super(props);
    this.handleIgnoredTransactionsUpdate = this.handleIgnoredTransactionsUpdate.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      transactions: [],
      cleanedTransactions: [],
      ignoredTransactions: []
    };
  }

  handleIgnoredTransactionsUpdate(ignoredTransactionsArray) {
    const cleanedTransactions = this.cleanTransactions( this.state.transactions, ignoredTransactionsArray, this.props.accountList );
    const totalSpend = get_spend_between_dates( cleanedTransactions, moment().format( "YYYY-MM-01" ), moment().format( "YYY-MM-DD" ) );

    this.setState(
      {
        ignoredTransactions: ignoredTransactionsArray,
        cleanedTransactions: cleanedTransactions,
        totalSpend: totalSpend
      }
    )
  }

  cleanTransactions( rawTransactions, ignoredTransactions, accountList ) {
    let cleanTransactions = rawTransactions.filter(transaction => ! ignoredTransactions.includes(transaction.id) )
    cleanTransactions = cleanTransactions.filter( function( transaction ) {
      const account = accountList.find( account => account.id === transaction.account_id );
      return account.on_budget;
    });
    return cleanTransactions
  }
  componentDidMount() {
    let since_date = moment().subtract(3, 'months').format( "YYYY-MM-01");

    fetch(
      "https://api.youneedabudget.com/v1/budgets/"+this.props.budgetID+"/transactions?since_date="+since_date,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.accessToken
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          const transactions = result.data.transactions;
          const cleanedTransactions = this.cleanTransactions( transactions, this.state.ignoredTransactions, this.props.accountList );
          const budgetTransactions = this.cleanTransactions( transactions, [], this.props.accountList );
          this.setState({
            isLoaded: true,
            transactions: transactions,
            cleanedTransactions: cleanedTransactions,
            budgetTransactions: budgetTransactions,
            totalSpend: get_spend_between_dates( cleanedTransactions, moment().format( "YYYY-MM-01" ), moment().format( "YYY-MM-DD" ) ),
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { budgetTransactions, cleanedTransactions, ignoredTransactions, error, isLoaded, totalSpend } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <TotalSpend value={totalSpend}/>
          <Breakdowns
            totalSpend={totalSpend}
            transactions={cleanedTransactions}
            goal={this.props.goal}
            />
          <ReChartByDay
            id='thismonth'
            monthsAgo={0}
            transactions={cleanedTransactions}
            goal={this.props.goal}
            />
            <TransactionList
              id='transactionList'
              transactions={budgetTransactions}
              ignoredTransactions={ignoredTransactions}
              onIgnoredTransactionsUpdate={this.handleIgnoredTransactionsUpdate}
              />


        </div>
      );
    }
  }
}

export default TransactionData;
