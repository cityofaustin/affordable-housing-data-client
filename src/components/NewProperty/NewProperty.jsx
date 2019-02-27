// react
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
// libs
//import _ from "underscore";
// axios
import axios from 'axios';
// components
//import {TopNav} from '../TopNav/TopNav.jsx';
// css
//import '../UpdateProperty/UpdateProperty.css';
import './NewProperty.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const initalState = {
    property_name: '',
    property_address: '',
    property_city: '',
    property_state: '',
    property_zip: '',
    nameError: '',
    addressError: '',
    cityError: '',
	stateError: '',
	zipError: ''
}

class NewProperty extends Component {
	constructor(props) {
		super(props);

        this.state = initalState

		this.handleSave = this.handleSave.bind(this);
		this.showFailureMessage = this.showFailureMessage.bind(this);
		this.hideFailureMessage = this.hideFailureMessage.bind(this);

	}

	onChange (e) {
        const isCheckbox = e.target.type === "checkbox"
        this.setState({ 
            [e.target.name]: isCheckbox
                ? e.target.checked
                : e.target.value 
        })
	}
	
    validate = () => {
		let nameError= '';
		let addressError= '';
		let cityError= '';
		let stateError= '';
		let zipError= '';

        if (!this.state.property_name){
            nameError='Invalid Property Name'
		}
        if (!this.state.property_address){
            addressError='Invalid Property Address'
		}
        if (!this.state.property_city){
            cityError='Invalid Property City'
		}
        if (!this.state.property_state){
            stateError='Invalid Property State'
		}
        if (!this.state.property_zip){
            zipError='Invalid Property Zip Code'
		}
        if (nameError || addressError || cityError || stateError || zipError){
            this.setState({nameError, addressError, cityError, stateError, zipError});
            return false;
        }

        return true;
    }

	showFailureMessage() {
		document.getElementById('new-property-save-message-failure').style.display = 'block';
	}

	hideFailureMessage() {
		document.getElementById('new-property-save-message-failure').style.display = 'none';
	}

	handleSave(e) {
		e.preventDefault()
		const isValid = this.validate()

		if (isValid){
			this.hideFailureMessage();
			var queryString = `/new_property?userEmail=${localStorage.getItem('email')}`;
			axios.post(
				queryString, {
					'property_name': document.getElementById('new-property-name').value,
					'street_address': document.getElementById('new-property-address').value,
					'city': document.getElementById('new-property-city').value,
					'state': document.getElementById('new-property-state').value,
					'zipcode': document.getElementById('new-property-zip').value
				}
			)
			.then((res) => {
				console.log(res);
				this.setState({
					'redirectTo': res.data.redirect
				});
			})
			.catch((e) => {
				console.log(e);
				this.showFailureMessage();
			})
		}
		

	}

	render() {
		if (this.state && this.state.redirectTo) {
			return <Redirect to={ this.state.redirectTo } />;
		}

		return (
			<div>
				<h1>New Property</h1>
					<p>After the new property has been created you will be redirected to a page where you can edit additional attributes.</p>
					<Form>
						<Form.Group controlId="new-property-zip-name">
							<Form.Label>Property Name:</Form.Label>
							<Form.Control type="text" placeholder="Property Name" value={this.state.property_name} onChange={this.onChange} />
							<Form.Text className="text-danger">{this.state.nameError}</Form.Text>
						</Form.Group>

						<Form.Group controlId="new-property-zip-address">
							<Form.Label>Street Address:</Form.Label>
							<Form.Control type="text" placeholder="Street Address" value={this.state.property_address} onChange={this.onChange} />
							<Form.Text className="text-danger">{this.state.addressError}</Form.Text>
						</Form.Group>

						<Form.Group controlId="new-property-zip-city">
							<Form.Label>City:</Form.Label>
							<Form.Control type="text" placeholder="City" value={this.state.property_city} onChange={this.onChange} />
							<Form.Text className="text-danger">{this.state.cityError}</Form.Text>
						</Form.Group>

						<Form.Group controlId="new-property-zip-state">
							<Form.Label>State:</Form.Label>
							<Form.Control type="text" placeholder="State" value={this.state.property_state} onChange={this.onChange} />
							<Form.Text className="text-danger">{this.state.stateError}</Form.Text>
						</Form.Group>

						<Form.Group controlId="new-property-zip">
							<Form.Label>Zip Code:</Form.Label>
							<Form.Control type="text" placeholder="Zip Code" value={this.state.property_zip} onChange={this.onChange} />
							<Form.Text className="text-danger">{this.state.zipError}</Form.Text>
						</Form.Group>
						
						<div className='save-btn-continer'>
							<Button onClick={this.handleSave} id='new-property-save-btn' className='btn btn-success'>SAVE</Button>
						</div>
						<div id='new-property-save-message-success' className='text-success'>Success! Your data was saved!</div>
						<div id='new-property-save-message-failure' className='text-danger'>There was an issue saving your data. Please note that all fields are required. Please try again or contact system adminstrator.</div>
					</Form>
			</div>
		);
	}
}

export {NewProperty};
