import React from 'react';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

class GoalForm extends React.Component {
	constructor(props) {
			super();
			this.handleChange = this.handleChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.triggerChange = this.triggerChange.bind(this);
			this.state = {
					value: props.goal
			};
	}

	componentWillMount() {
			this.timer = null;
	}

	handleChange(event) {
			clearTimeout(this.timer);

			this.setState({
				value: event.target.value
			});

			this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
	}

	handleKeyDown(e) {
			if (e.keyCode === ENTER_KEY) {
					this.triggerChange();
			}
	}

	handleSubmit(e) {
		e.preventDefault();
		return false;
	}

	triggerChange() {
			const { value } = this.state;
			this.props.onGoalChange(value);
	}

	render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Goal:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
      </form>
    );
  }

}

export default GoalForm;
