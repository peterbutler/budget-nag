import React from 'react';

class BudgetChooser extends React.Component {
	constructor(props) {
    super(props);
		this.handleChange = this.handleChange.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      availableBudgets: [],
    };
  }

	handleChange(event) {
      this.props.chooseBudget( event.target.value )
	}

	componentDidMount() {
    fetch(
      "https://api.youneedabudget.com/v1/budgets",
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
					console.log( result.data );
					this.setState({
						isLoaded: true,
						availableBudgets:result.data.budgets,
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
		if ( ! this.state.isLoaded ) {
			return <div>Loading Budgets...</div>
		}

		return (
			<div>
				<h2>Available Budgets:</h2>
				{this.state.availableBudgets.map(budget => (
          <p key={"budget-" + budget.id}><input type="checkbox" value={budget.id} onChange={this.handleChange}/>{budget.name} - Last Modified {budget.last_modified_on}</p>
				))}
			</div>
		)
	}
}

export default BudgetChooser;
