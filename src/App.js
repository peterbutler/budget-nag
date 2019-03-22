import React, { Component } from 'react';
import './App.css';
import TransactionData  from './components/TransactionData';
import GoalForm  from './components/GoalForm';
import Accounts  from './components/Accounts';
import BudgetChooser  from './components/BudgetChooser';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleGoalChange = this.handleGoalChange.bind(this);
    this.setAccountList = this.setAccountList.bind(this);
    this.chooseBudget = this.chooseBudget.bind(this);
    this.state = {
      goal: 7000,
      accessToken: false,
    };
  }
  componentDidMount(){
    const hrefMatches = window.location.href.match( /#access_token=([^&]*)/ );
    let accessToken = false;
    if ( hrefMatches ) {
      accessToken = hrefMatches[1];
    }
    if ( accessToken ) {
      this.setState( {
        accessToken: accessToken,
        budgetID: '',
      })
    }
  }


  chooseBudget(chosenBudget) {
    this.setState(
      {
        budgetID: chosenBudget
      }
    )
  }

  handleGoalChange(newGoal) {
    this.setState(
      {
        goal: newGoal
      }
    );
  }

  setAccountList(accountList) {
    this.setState(
      {
        accounts: accountList,
      }
    )
  }
  render() {
    const goal = this.state.goal;
    const accessToken = this.state.accessToken;
    const budgetID = this.state.budgetID;
    if ( ! accessToken ) {
      return (
        <div>
          <a href="https://app.youneedabudget.com/oauth/authorize?client_id=70358bfd41a2fadf29be9211bbf672b434ff7ae49dd3d6bf8b011afbe35f4e5a&redirect_uri=https://budget-nag.herokuapp.com&response_type=token">
          Click here to log in.
          </a>
        </div>
      )
    }
    if ( ! budgetID ) {
      return (
        <BudgetChooser
          accessToken={accessToken}
          chooseBudget={this.chooseBudget} />
      )

    }
    return (
      <div className="App">
        <GoalForm
          goal={goal}
          onGoalChange={this.handleGoalChange}
          />
        <Accounts
          setAccountList={this.setAccountList}
          accessToken={accessToken}
          budgetID={budgetID}
            />
        <TransactionData
          accessToken={accessToken}
          budgetID={budgetID}
          accountList={this.state.accounts}
          goal={goal}/>
      </div>
    );
  }
}

export default App;
