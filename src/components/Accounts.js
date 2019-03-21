import React from 'react';

class Accounts extends React.Component {
	componentDidMount() {
    fetch(
      "https://api.youneedabudget.com/v1/budgets/" + this.props.budgetID + "/accounts/",
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
          // TODO: Validate here.
          this.props.setAccountList( result.data.accounts );
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
		return "";
	}
}

export default Accounts;
