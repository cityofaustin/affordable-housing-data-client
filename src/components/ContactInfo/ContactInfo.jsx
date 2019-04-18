// react libs
import React, { Component } from 'react';
// css
// import './ContactInfo.css';
import Card from 'react-bootstrap/Card'

class ContactInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}


	render() {
		return (
			<div>
				<Card bg="light">
					<Card.Body>
						<Card.Title>Contact Info</Card.Title>
						<Card.Text>
							<b>Property Manager:</b> {this.props.data.property_manager_or_landlord}
							<br/>
							<b>Phone:</b> {this.props.data.phone}
							<br/>
							<b>Email:</b> {this.props.data.email}
							<br/>
							<b>Website:</b> {this.props.data.website}
						</Card.Text>
					</Card.Body>
				</Card>
			</div>


		);
	}
}

export {
	ContactInfo
};