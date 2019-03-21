import React from 'react';
import moment from 'moment'
import { get_spend_by_date } from '../helpers/transactions';

class Breakdowns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spendPerDay: 0,
    };
  }

  render() {
    const daysLeftInMonth = moment().daysInMonth() - moment().date();
    const spendPerDay = ( ( this.props.totalSpend / -1000 ) / moment().date()).toLocaleString('en-US', { style: 'currency', currency: 'USD', });
    const yesterdaySpend = ( get_spend_by_date( this.props.transactions, moment().subtract(1, 'days').format("YYYY-MM-DD") ) / -1000).toLocaleString('en-US', { style: 'currency', currency: 'USD', });
    const todaySpend = ( get_spend_by_date( this.props.transactions, moment().format("YYYY-MM-DD") ) / -1000).toLocaleString('en-US', { style: 'currency', currency: 'USD', });
    const availableSpendPerDay =  ( ( this.props.goal - ( this.props.totalSpend / -1000 ) ) / daysLeftInMonth ).toLocaleString('en-US', { style: 'currency', currency: 'USD', });
  return (
      <div id="breakdowns">
        <div id="thisMonth"><div className="amount">{spendPerDay}</div><p>spent per day so far this month.</p></div>
        <div id="availablePerDay"><div className="amount">{availableSpendPerDay}</div><p> available per day for the next {daysLeftInMonth} days.</p></div>
        <div id="spendYesterday"><div className="amount">{yesterdaySpend}</div><p>spent yesterday.</p></div>
        <div id="spendToday"><div className="amount">{todaySpend}</div><p>spent so far today.</p></div>
      </div>
    )
  }
}

export default Breakdowns;
