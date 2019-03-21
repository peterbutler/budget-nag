import React from 'react';
import moment from 'moment'

class TotalSpend extends React.Component {
  render() {
    const month = moment().format( 'MMMM' );
    const dayOfMonth = moment().date();
    const daysInMonth = moment().daysInMonth();
    return (
      <div id="totalspend">
        <p>Day {dayOfMonth}/{daysInMonth} of {month}</p>
        <h1>{(this.props.value/-1000).toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</h1>
        <p>Spent this month</p>
      </div>
    )
  }
}

export default TotalSpend;
