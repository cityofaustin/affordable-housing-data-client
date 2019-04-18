// react
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// axios
import axios from 'axios';
// import API from '../Api';
// components
// import {UpdatePropertyInput} from '../UpdatePropertyInput/UpdatePropertyInput.jsx';
// import {TopNav} from '../TopNav/TopNav.jsx';
import {PropertyDataGroupView} from '../PropertyDataGroupView/PropertyDataGroupView.jsx';
import {PropertyDataGroupEdit} from '../PropertyDataGroupEdit/PropertyDataGroupEdit.jsx';
import {ContactInfo} from '../ContactInfo/ContactInfo.jsx';
import {AssignedUserInfo} from '../AssignedUserInfo/AssignedUserInfo.jsx';
// css
// import './UpdateProperty.css';
// libs
import _ from "underscore";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col' 
import Card from 'react-bootstrap/Card'

class UpdateProperty extends Component {
	constructor(props) {
		super(props);

		this.state = {
			redirectTo: null,
			showUpdateProperty: false,
			showEditProperty: false,
			groups: [
				'Basic Property Information',
				'Contact Information',
				'Communities Served',
				'Affordability Information',
				'Amenities',
				'Schools',
				// 'Unit Information'
				/* for v1 we are not going to collect real time unit information */
			],
			updatedData: {
				// see 'Unit Information' above, we are not going to collect real time unit information for now
				// newUnitInfo: {},
				// updatedUnitInfo: {}
			},
			verifications: {
			}
		};
		this.handleUpdateData = this.handleUpdateData.bind(this);
		this.updateVerifications = this.updateVerifications.bind(this);

		var propertyId = this.props.match.params.id;
		var queryString = `/property?propertyId=${propertyId}&userEmail=${localStorage.getItem('email')}`;
		axios.get(queryString)
			.then((res) => {
				//console.log('what is res');
				//console.log(res.data.verifications);
				this.setState({'data': res.data.data, 'fieldsMap': res.data.fieldsMap, 'verifications': res.data.verifications, 'showEditProperty': true, propertyId: propertyId});
				//console.log(res.data.verifications);
			})
			.catch((e) => {
				//console.log('inside catch');
				//console.log(e);
				//console.log(e.response);
				if (e && e.response && !e.response.data.success && e.response.data.redirect) {
					this.setState({redirectTo: '/'});
					//console.log('something');
				}
			});
	}

	handleUpdateData(data) {
		if (!_.has(this.state.updatedData, data.field)) {
			this.setState(Object.assign(this.state.updatedData,{[data.field]:{}}));
			//this.state.updatedData[data.field] = {};
			//console.log(this.state.updatedData);
		}

		// TODO: for strings, need to check if there it is an empty string, if it is, value should be null

		if (typeof(data.value) === "string" && data.value.trim().length === 0) {
			this.setState(Object.assign(this.state.updatedData,{[data.field]:{value:null}}));
			//this.state.updatedData[data.field].value = null;
		} else {
			this.setState(Object.assign(this.state.updatedData,{[data.field]:{value:data.value}}));
			//this.state.updatedData[data.field].value = data.value;
		}
	}

	updateVerifications(field, verifyVal) {
		if (!_.has(this.state.verifications, field)) {
			this.setState(Object.assign(this.state.verifications,{[field]:{}}));
			//this.state.verifications[field] = {}
		}
		//this.state.verifications[field].verified = verifyVal;
		this.setState(Object.assign(this.state.verifications,{[field]:{verified:verifyVal}}));
	}

	renderGroups(propertyDataGroupEdit=false) {
		function getGroupFields(groupName, fieldsMap) {
			var newObj = {};
			for (var field in fieldsMap) {
				if (fieldsMap[field].active && fieldsMap[field].group && fieldsMap[field].group === groupName) {
					newObj[field] = fieldsMap[field];
				}
			}
			return newObj;
		}

		function addGroupFieldsData(groupFieldsMap, values) {
			for (var field in groupFieldsMap) {
				var value = values[field];
				if (value === 0 || value) {
					groupFieldsMap[field].value = value;
				} else {
					groupFieldsMap[field].value = null;
				}
			}

			return groupFieldsMap;
		}

		var groups = [];
		var groupsNames = this.state.groups;
		var fieldsMap = this.state.fieldsMap;

		for (var groupName of groupsNames) {

			var groupFieldsMap = getGroupFields(groupName, fieldsMap);
			groupFieldsMap = addGroupFieldsData(groupFieldsMap, this.state.data);

			if (propertyDataGroupEdit) {
				groups.push(
					<PropertyDataGroupEdit key={groupName} name={groupName} data={groupFieldsMap} propertyValue={this.state.data}  updatePropertyThis={this} handleUpdateData={this.handleUpdateData} updateVerifications={this.updateVerifications} verifications={this.state.verifications}/>
				);
			} else {
				groups.push(
					<PropertyDataGroupView key={groupName} name={groupName} data={groupFieldsMap}/>
				);
			}
		}

		return groups;
	}

	handleEditPropertyClick(showEditProperty) {
		if (showEditProperty) {
			this.setState({
				showUpdateProperty: false,
				showEditProperty: true
			});
		} else {
			this.setState({
				showUpdateProperty: true,
				showEditProperty: false
			});
		}
	}

	getPropertyAddress() {
		var header = (this.state.data.address ? this.state.data.address : '') + ' ' + (this.state.data.city ? this.state.data.city : '') + ', ' + (this.state.data.state ? this.state.data.state : '') + ' ' + (this.state.data.zipcode ? this.state.data.zipcode : '');
		return header;
	}

	getPropertyId() {
		return this.state.data.id;
	}

	getIsDuplicate() {
		if (this.state.data !== undefined) {
			return this.state.data.is_duplicate;
		} else { //in case property doesn't exist
			return 1;
		}
	}

	hideSaveButton() {
		var elem = document.getElementById('update-property-save-btn');
		elem.style.display = 'none';
		return;
	}

	hideDeleteButton() {
		var elem = document.getElementById('update-property-delete-btn');
		elem.style.display = 'none';
		return;
	}

	showSaveButton() {
		var elem = document.getElementById('update-property-save-btn');
		elem.style.display = 'inline';
		return;
	}

	showSaveMessage() {
		document.getElementById('save-message-success').style.display = 'block';
		return;
	}

	hideSaveMessage() {
		document.getElementById('save-message-success').style.display = 'none';
		return;
	}

	showFailureMessage() {
		document.getElementById('save-message-failure').style.display = 'block';
	}

	hideFailureMessage() {
		document.getElementById('save-message-failure').style.display = 'none';
	}

	handleSave() {
		this.hideSaveButton();
		this.hideSaveMessage();
		this.hideFailureMessage();
		//const propertyId = this.props.match.params.id;
		//console.log(this.state.updatedData);
		//console.log(this.state.verifications)
		
		axios.post(
			`/update_property?userEmail=${localStorage.getItem('email')}`,
			{
				updatedData: this.state.updatedData,
				propertyId: this.props.match.params.id
			})
			.then((res) => {
				this.showSaveButton();
				this.showSaveMessage();
			})
			.catch((e) => {
				this.showSaveButton();
				this.showFailureMessage();
			});
	}


	handleDelete(item) {
		this.hideSaveMessage();
		this.hideFailureMessage();
		const propertyId = item;
		axios.post(
			`/delete_property?userEmail=${localStorage.getItem('email')}`,
			{
				propertyId: propertyId
			})
			.then((res) => {
			this.hideSaveButton();
			this.hideDeleteButton();
			console.log('true');
				this.showSaveMessage();
			})
			.catch((e) => {
				console.log(e);
				//this.showSaveButton();
				this.showFailureMessage();
			});
	}

	render() {
		if (this.state.redirectTo) {
			return (<Redirect to={this.state.redirectTo} />);
		}
		if (this.state.showUpdateProperty) {
			return (
				<div>
					
					<br/>
					<div className='property-groups-container'>
						<button onClick={() => {this.handleEditPropertyClick(true)}}>Edit Property</button>
						<br/><br/>
						{this.renderGroups()}
					</div>
				</div>
			);
		}
		if (this.state.showEditProperty && !this.getIsDuplicate()) {
			return (
				<Container fluid>
					<Row>
						<Col sm={9}>
							<div className='property-groups-container'>
							{
								this.getPropertyId() &&
								<h2>Property ID: {this.getPropertyId()}</h2>
							}
							{
								this.getPropertyAddress() &&
								<h2>{this.getPropertyAddress()}</h2>
							}
								{/*<button onClick={() => {this.handleEditPropertyClick(false)}}>Back</button>*/}
								<br/>
								{this.renderGroups(true)}
							</div>
							<div>&nbsp;</div>
							<div className='save-btn-container'>
								<button id='update-property-save-btn'   onClick={this.handleSave.bind(this)} className='save-btn btn btn-success'>SAVE</button>
								{ localStorage.getItem('email')==='test@test.com' &&
									<button id='update-property-delete-btn' onClick={(e) => window.confirm("Are you sure you wish to delete Property " + this.getPropertyId() +"?") && this.handleDelete(this.getPropertyId())}   className='save-btn btn btn-success'>DELETE</button>
								}
								<span id='save-message-success' className='text-success'>Success! Your data was saved!</span>
								<span id='save-message-failure' className='text-danger'>There was an issue saving your data. Please try again or contact system adminstrator.</span>
							</div>
						</Col>
						<Col sm={3}>
						
							<ContactInfo data={this.state.data} />
							<br/>
							<AssignedUserInfo propertyId={this.state.propertyId} />
						</Col>
					</Row>
					<hr />
					<Row>
						<Col>
							<Card bg="light">
								<Card.Header>What data is 'Basic Info'?</Card.Header>
								<Card.Body>
									<Card.Text>
										<ul>
											<li>property name</li>
											<li>street address</li>
											<li>city</li>
											<li>state</li>
											<li>zip code</li>
											<li>phone</li>
											<li>website</li>
											<li>unit type</li>
											<li>council district</li>
											<li>total units</li>
											<li>total psh units</li>
											<li>total income restricted units</li>
										</ul>
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col>
							<Card bg="light">
								<Card.Header>What data is 'Tenant Criteria'?</Card.Header>
								<Card.Body>
									<Card.Text>
										<ul>
											<li>accepts section 8</li>
											<li>has available units</li>
											<li>only serves students</li>
											<li>only serves elderly</li>
											<li>only serves physically disabled persons</li>
											<li>only serves mentally disabled person</li>
											<li>only serves veterans</li>
											<li>only serves military</li>
											<li>only serves domestic abuse survivors</li>
											<li>other community served information</li>
											<li>does this property accept applicants with history of broken leases (and other criteria)</li>
											<li>does this property accept applicants with an eviction history (and other criteria)</li>
											<li>does this property accept criminal history (and other criteria)</li>
											<li>has waitlist</li>
											<li>schools</li>
										</ul>
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			);
		}
		else {
			return (
			<div>
				
			</div>)
		}
		//return <div></div>
	}
}

export {UpdateProperty};
