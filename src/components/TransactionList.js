import React from 'react';

class TransactionList extends React.Component {

  constructor(props) {
      super();
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
      let set = new Set( this.props.ignoredTransactions );
      if ( event.target.checked === true ) {
        set.add(event.target.value);
      } else {
        set.delete(event.target.value);
      }

      this.props.onIgnoredTransactionsUpdate( [...set] )
	}

  render() {
    // clone transactions so we can reverse it without affecting the original
    const transactions = this.props.transactions.slice(0).reverse();

    return (
      <div id={this.props.id}>
      <table id="newtransactionlist">
        <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.id}>
            <td><input type="checkbox"
              name="ignoredTransactions[]"
              value={transaction.id}
              onChange={this.handleChange}/></td>
            <td>{transaction.date}</td>
            <td>{transaction.category_name}</td>
            <td>{transaction.payee_name}</td>
            <td>{transaction.amount/-1000}</td>
          </tr>
        ))}
      </tbody>
    </table>
</div>
    )
  }
}

export default TransactionList;
