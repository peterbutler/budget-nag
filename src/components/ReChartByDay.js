import React, { PureComponent } from 'react';
import {
   ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Line
} from 'recharts';

import moment from 'moment'

import { get_transactions_by_day } from '../helpers/transactions';


export default class Example extends PureComponent {
	constructor(props) {
    super(props);
    this.state = {
			isLoaded: false,
			transactions: [],
			transactionsByDate: [],
      goal: 0,
			data: []
    };
  }

  componentDidMount() {
    this.setState({
      isLoaded: true,
      transactions: this.props.transactions,
    });
  }


  render() {
    let end_date = moment().subtract(this.props.monthsAgo-1, 'months').format( "YYYY-MM-01");
    let transactionsByDate = get_transactions_by_day( this.props.transactions, end_date, this.props.goal );
    let data = Object.values(transactionsByDate).map( date_record => {
      return {
        spent: (date_record.totalSpend / 1000),
        accumulated: (date_record.accumulatedSpend / -1000),
        availableToday: (date_record.availableSpendPerDay / -1000),
        availableThisMonth: (date_record.availableSpend / 1000),
        date: (date_record.date)
      }
    });
    return (

      <ComposedChart
        width={1200}
        height={400}
        data={data}
        stackOffset="sign"
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={function (value, name, props){ return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', }) }
          }/>
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="availableThisMonth" fill="#8884d8" stackId="stack" />
        <Bar dataKey="spent" fill="#82ca9d" stackId="stack" />
        <Line dataKey="availableToday"  />
      </ComposedChart>
    );
  }
}
