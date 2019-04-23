// react libs
import React, { Component } from 'react';
// axios
import axios from 'axios';
// import API from '../Api';
// css
// import './AssignedUserInfo.css';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

class AssignedUserInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.getAssignedUser = this.getAssignedUser.bind(this);
		this.renderAssignedTo = this.renderAssignedTo.bind(this);

		this.getAssignedUser();
	}

	getAssignedUser() {
		var propertyId = this.props.propertyId;
		var queryString = `/get_assigned_user?propertyId=${propertyId}&userEmail=${localStorage.getItem('email')}`;
		axios.get(queryString)
			.then((res) => {
				var assignedTo = null;
				if (res.data.data.length > 0) {
					assignedTo = res.data.data[0].email;
				}
				this.setState({'assignedTo': assignedTo, 'showAssignedUserInfo': true});
			})
			.catch((e) => {
				if (e && e.response && !e.response.data.success && e.response.data.redirect) {
					this.setState({redirectTo: '/'});
				}
			});
	}

	renderAssignedTo() {
		if (this.state.assignedTo) {
			return this.state.assignedTo;
		} else {
			return 'None'
		}
	}

	handleUnassignUser() {
		var propertyId = this.props.propertyId;
		var queryString = `/unassign_user?propertyId=${propertyId}&userEmail=${localStorage.getItem('email')}`;
		axios.get(queryString)
			.then((res) => {
				this.setState({'assignedTo': null, 'showAssignedUserInfo': true});
			})
			.catch((e) => {
				if (e && e.response && !e.response.data.success && e.response.data.redirect) {
					this.setState({redirectTo: '/'});
				}
			});
	}

	handleAssignToMe() {
		var propertyId = this.props.propertyId;
		var queryString = `/assign_property_to_user?propertyId=${propertyId}&userEmail=${localStorage.getItem('email')}`;
		axios.get(queryString)
			.then((res) => {
				this.setState({'assignedTo': res.data.assignedTo, 'showAssignedUserInfo': true});
			})
			.catch((e) => {
				if (e && e.response && !e.response.data.success && e.response.data.redirect) {
					this.setState({redirectTo: '/'});
				}
			});
	}

	render() {
		return (


			


			<div className='assigned-info-container'>
			{ this.state.showAssignedUserInfo &&
				<Card bg="light">
					<Card.Body>
						<Card.Title>Assignee Info</Card.Title>
						<Card.Text>
							<b>Assigned To:</b> {this.renderAssignedTo()}
						</Card.Text>
						<ButtonToolbar>
							{ this.state.assignedTo &&
								<Button variant="info" size="sm" onClick={this.handleUnassignUser.bind(this)} className='assign-info-btn '>Unassign User</Button>
							}
							&nbsp; <Button variant="info" size="sm" onClick={this.handleAssignToMe.bind(this)} className='assign-info-btn'>Assign To Me</Button>
						</ButtonToolbar>
					</Card.Body>
				</Card>
			}
			</div>

		);
	}
}

export {
	AssignedUserInfo
};