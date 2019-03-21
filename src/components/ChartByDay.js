import React from 'react';
import * as d3 from "d3";
import { scaleLinear } from 'd3-scale'
import moment from 'moment'

import { get_transactions_by_day } from '../helpers/transactions';

class ChartByDay extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      spend: 0,
			isLoaded: false,
    };
  }

	componentDidMount() {
		this.updateData();
  }
	componentDidUpdate() {
		let end_date = moment().subtract(this.props.monthsAgo-1, 'months').format( "YYYY-MM-01");
		this.drawChart( get_transactions_by_day( this.props.transactions, end_date, this.props.goal ) );
  }


	updateData(){
		//		let since_date = moment().subtract(this.props.monthsAgo, 'months').format( "YYYY-MM-01");
				let end_date = moment().subtract(this.props.monthsAgo-1, 'months').format( "YYYY-MM-01");
				let transactionsByDate = get_transactions_by_day( this.props.transactions, end_date, this.props.goal );
				this.setState({
					isLoaded: true,
					transactions: this.props.transactions,
					transactionsByDate: transactionsByDate,
				});

	}
	drawChart( transactions ) {
		console.log( "DRAWING CHART" );
		let data = Object.values(transactions).map( date_record => {
			return {
				value: (date_record.totalSpend / -1000),
				accumulated: (date_record.accumulatedSpend / -1000),
				available: (date_record.availableSpendPerDay / 1000),
				date: (date_record.date)
			}
		})

		var width = 1000,
		    height = 420,
				barWidth = width / 31;

		var y = scaleLinear()
		    .range([0, height-20]);


		var chart = d3.select("#" + this.props.id)
		.append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .style("margin-left", 10)
		//.attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 440")
    //class to make it responsive
    .classed("svg-content-responsive", true);

		  y.domain([0, d3.max(data, d => d.accumulated )]);

		  //chart.attr("width", barWidth * data.length);

		  var bar = chart.selectAll("g")
		      .data(data)
		    .enter().append("g")
				.attr("transform", function(d, i) { return "translate(" + i * barWidth + ", "+ (height - y(d.accumulated))+")"; });


			// Accumulated Spending
			bar.append("rect")
		      .attr("height", function(d) {
						return y(d.accumulated);
					})
					.attr("fill", "#4981FD")
		      .attr("width", barWidth - 1);

			// Actual spending
			bar.append("rect")
		      .attr("height", function(d) { return y(d.value); })
					.attr("fill", function(d) {  if( d.value < d.available){ return "green"; } return "red";})
		      .attr("width", barWidth - 3)
					.attr("transform", function(d, i) { return "translate(1, "+ (y(d.accumulated) - y(d.value) )+")"; });

			bar.append("text")
		      .attr("x", 0)
		      .attr("dy", "-1em")
					.attr("font-size", '5px')
					.attr("fill", '#333')
					.text(function(d) { return d.accumulated.toLocaleString('en-US', { style: 'currency', currency: 'USD', }); });

			bar.append("text")
		      .attr("y", function(d) { return y(d.accumulated); })
		      .attr("x", 0)
		      .attr("dy", "1em")
					.attr("font-size", '8px')
					.attr("fill", "#333")
		      .text(function(d) { return d.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', }); });

			bar.append("text")
		      .attr("y", function(d) { return y(d.accumulated) + 10; })
		      .attr("x", 0)
		      .attr("dy", "1em")
					.attr("font-size", '8px')
					.attr("fill", function(d) {  if( d.value < d.available){ return "green"; } return "red";})
		      .text(function(d) { return d.available.toLocaleString('en-US', { style: 'currency', currency: 'USD', }); });
  }
		render(){
			console.log( "RENDERING" );
			const { isLoaded } = this.state;
	    if (!isLoaded) {
				return <div>Loading..</div>
			} else {
				return <div id={"#" + this.props.id}>{this.props.goal}</div>
			}
	}
}

export default ChartByDay
