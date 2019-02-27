// react libraries
import React, { Component } from 'react';
import {Redirect,} from 'react-router-dom';
import _ from "underscore";
// libraries
//import 'bootstrap/dist/css/bootstrap.min.css';

// css
//import './UpdatePropertiesTable.css';


import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class UpdatePropertiesTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			propertyData: props.propertyData,
			searchBy: 'Address'

		}

		this.handlePropertyClick = this.handlePropertyClick.bind(this);
		this.getTotalFieldCount = this.getTotalFieldCount.bind(this);
	}

	handlePropertyClick(e) {
		if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.propertyId) {
			this.setState({
				'redirectTo': '/update_property/' + e.currentTarget.dataset.propertyId
			});
		}

	}

	handleNewPropertyClick(e) {
		this.setState({
			'redirectTo': '/new_property'
		});
		return;
	}

	renderFlags(p) {
		var elem1, elem2;
		if (p.basicPropertyInfoVerified) {
			elem1 = <Button variant="outline-success" size="sm" type='button' className='table-flag btn-block table-flag-verified'>Basic Info Verified</Button>;
		} else {
			elem1 = <Button variant="outline-danger" type='button' className='table-flag btn-block table-flag-unverified'>Basic Info Unverified</Button>;
		}
		if (p.tenantCriteriaVerified) {
			elem2 = <Button variant="outline-success" type='button' className='table-flag btn-block table-flag-verified affordability-info-flag'>Tenant Criteria Verified</Button>;
		} else {
			elem2 = <Button variant="outline-danger" type='button' className='table-flag btn-block table-flag-unverified affordability-info-flag'>Tenant Criteria Unverified</Button>;
		}
		return <span>{elem1} {elem2}</span>;
	}

	renderDataSources(p) {
		var elem = <span>{p.data_source_ahi ? 'AHI' : ''} {p.data_source_tdhca ? 'TDHCA' : ''} {p.data_source_atc_guide ? 'GAGHAA' : ''}</span>
		return elem;
	}

	renderFundingSources(p) {
		var elem = <span>{p.funding_source_nhcd ? 'NHCD' : ''} {p.funding_source_tdhca ? 'TDHCA' : ''} {p.funding_source_aahc ? 'HACA' : ''} {p.funding_source_hatc ? 'HATC' : ''}</span>
		return elem;
	}

	renderRows() {
		var propertyData = this.state.propertyData;

		propertyData = _.sortBy(propertyData, 'total_income_restricted_units');
		propertyData.reverse();

		var rows = [];

		for (var p of propertyData) {
			rows.push(
				<tr key={p.id}>
					<td><a href="update_property/{p.id}" data-property-id={p.id} onClick={this.handlePropertyClick} >{p.id}</a></td>
					<td>{p.property_name}</td>
					<td>{p.address}</td>
					<td>{p.city}</td>
					<td>{p.zipcode}</td>
					<td>{p.total_income_restricted_units ? p.total_income_restricted_units : <span className='text-danger'>unknown</span>}</td>
					<td>{p.phone}</td>
					<td>{this.renderDataSources(p)}</td>
					<td>{this.renderFundingSources(p)}</td>
					<td>{p.assigned_user_email ? p.assigned_user_email : 'none'}</td>
					<td>{this.renderFlags(p)}</td>
					<td><Button data-property-id={p.id} onClick={this.handlePropertyClick} variant="outline-primary" size="sm">View</Button></td>
				</tr>
			);
		}

		return rows;
	}

	handleSearchKeyUp() {
		var searchBy = this.state.searchBy;

		var searchByMap = {
			'Address': 2,
			'Property ID': 0,
			'Property Name': 1,
			'Assigned To': 9,
			'Data Source': 7,
			'Funding Source': 8,
			'Flag':10
		};

		var index = searchByMap[searchBy];

		// Declare variables
		var input, filter, table, tr, td, i;
		input = document.getElementById("table-search-input");
		filter = input.value.toUpperCase();
		table = document.getElementById("update-properties-table");
		tr = table.getElementsByTagName("tr");

		// Loop through all table rows, and hide those who don't match the search query
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[index];
			if (td) {
				if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	}

	handleSearchSelectChange(e) {
		var val = e.target.value;
		this.setState({
			'searchBy': val
		});
		this.changeInputPlaceHolder(val);
	}

	changeInputPlaceHolder(val) {
		var e = document.getElementById('table-search-input');
		e.placeholder=`Search by ${val.toLowerCase()}...`;
	}

	getTotalFieldCount(name) {
		var propertyData = this.state.propertyData;
		var total = 0;
		for (var p of propertyData) {
			if (p[name]) {
				total = total + 1;
			}
		}
		return total;
	}

	render() {
		if (this.state.redirectTo) {
			return <Redirect to={ this.state.redirectTo } />;
		}

		return (
			<div>
				<div className="row">
					<div className="col-md-4">
						<b>Basic Info Verified (complete / total):</b> {this.getTotalFieldCount('basicPropertyInfoVerified')} / {this.state.propertyData.length}
					</div>
					<div className="col-md-8">
						<b>Tenant Criteria Verified (complete / total):</b> {this.getTotalFieldCount('tenantCriteriaVerified')} / {this.state.propertyData.length}
					</div>
				</div>
				<div className='form-group'>
					<Button variant="secondary"
						id='new-property-id'
						onClick={this.handleNewPropertyClick.bind(this)}
						disabled={false}
					>New Property</Button>
				</div>
				
				<Form>
					<Row>
						<Col>
							<Form.Control id="table-search-select" as="select" value={this.state.value} onChange={this.handleSearchSelectChange.bind(this)}>
								<option>Address</option>
								<option>Property ID</option>
								<option>Property Name</option>
								<option>Assigned To</option>
								<option>Data Source</option>
								<option>Funding Source</option>
								<option>Flag</option>
							</Form.Control>
						</Col>
						<Col>
							<Form.Control onKeyUp={this.handleSearchKeyUp.bind(this)} id="table-search-input"  placeholder="Search by address..." />
						</Col>
					</Row>
				</Form>


				<Table id='update-properties-table' striped bordered hover size="sm">
				 	<thead>
						<tr>
							<th scope="col">ID</th>
							<th scope="col">Name</th>
							<th scope="col">Address</th>
							<th scope="col">City</th>
							<th scope="col">Zip</th>
							<th scope="col">Total Income Restricted Units</th>
							<th scope="col">Contact</th>
							<th scope="col">Data Source(s)</th>
							<th scope="col">Funding Source(s)</th>
							<th scope="col">Assigned To</th>
							<th scope="col">Flags</th>
							<th></th>
				    	</tr>
				  	</thead>
					<tbody>
						{this.renderRows()}
					</tbody>
				</Table>
			</div>
		);
	}
}

export { UpdatePropertiesTable };