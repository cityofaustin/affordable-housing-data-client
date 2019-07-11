// react libraries
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
// libraries
// import 'bootstrap/dist/css/bootstrap.min.css';
//import _ from "underscore";
// css
import './Users.css';

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
// import Form from 'react-bootstrap/Form';

class Users extends Component {
	constructor(props) {
    super(props);
    
    
		this.state = {
			redirectTo: null,
			searchBy: 'Name',
      value: 'first_name',
      data:[],
      sort: {
        column: null,
        direction: 'desc',
      }
		}

		var queryString = '/Users'
		axios.get(queryString)
			.then((res) => {
				//console.log(res);
				this.setState({data: res.data.data});
			})
			.catch((e) => {
				//console.log(e.response);
				// if not authorized, we want to redirect to login page
				if (e && e.response && !e.response.data.success && e.response.data.redirect) {
					this.setState({redirectTo: '/'});
					//console.log('something');
				}
			});
		this.handleUserClick = this.handleUserClick.bind(this);
  }

  onSort = (column) => (e) => {
    const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
    const sortedData = this.state.data.sort((a, b) => {
      if (column !== 'admin_flag') { // text values
        this.nameA = "";
        this.nameB = "";
        if (column ==='email') {
          this.nameA = a.email.toUpperCase(); // ignore upper and lowercase
          this.nameB = b.email.toUpperCase(); // ignore upper and lowercase
        } else if (column === 'first_name'){
          this.nameA = a.first_name.toUpperCase(); // ignore upper and lowercase
          this.nameB = b.first_name.toUpperCase(); // ignore upper and lowercase
        } else if (column === 'last_name'){
          this.nameA = a.last_name.toUpperCase(); // ignore upper and lowercase
          this.nameB = b.last_name.toUpperCase(); // ignore upper and lowercase          
        } else if (column === 'org'){
          this.nameA = a.org.toUpperCase(); // ignore upper and lowercase
          this.nameB = b.org.toUpperCase(); // ignore upper and lowercase
        }
        if (this.nameA < this.nameB) {
          return -1;
        }
        if (this.nameA > this.nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      } else { //admin_flag
        return a.admin_flag - b.admin_flag;
      }
    });
      
    if (direction === 'desc') {
      sortedData.reverse();
    }
    
    this.setState({
      data: sortedData,
      sort: {
        column,
        direction,
      }
    });
  };

  setArrow = (column) => {
    let className = 'sort-direction';
    
    if (this.state.sort.column === column) {
      className += this.state.sort.direction === 'asc' ? ' asc' : ' desc';
    }
    
    //console.log(className);
    
    return className;
  };

	handleUserClick(e) {
		if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.Id) {
			this.setState({
				'redirectTo': '/update_user/' + e.currentTarget.dataset.Id
			});
		}

  }
  
	renderRole(p) {
    switch(p) {
      case 0:
        return <span>Admin</span>;
      case 1:
        return <span>Admin (Super)</span>;
      case 2:
        return <span>Navigator</span>;
      default:
        return null;
    }
	}

	renderRows() {
    if (this.state.data !== undefined) {
    var keys = Object.keys(this.state.data); 
		var rows = [];
    for(var i = 0; i < keys.length; i++) { 
      var this_user = (keys[i]) ; 
      rows.push(
				<tr key={this.state.data[this_user].id}>
          <td>{this.state.data[this_user].first_name}</td>
          <td>{this.state.data[this_user].last_name}</td>
					<td>{this.state.data[this_user].email}</td>
          <td> {this.state.data[this_user].org}</td>
          <td>{this.renderRole(this.state.data[this_user].admin_flag)}</td>
					<td><button data-property-id={this.state.data[this_user].id} onClick={this.handleUserClick} className='table-view-btn btn-primary btn'>EDIT</button></td>
				</tr>
			);
    }}
		return rows;
	}

	handleSearchKeyUp() {
		var searchBy = this.state.searchBy;

		var searchByMap = {
			'First Name': 0,
			'Last Name': 1,
			'Email': 2,
			'Org': 3,
			'Role': 4
		};

		var index = searchByMap[searchBy];

		// Declare variables
		var input, filter, table, tr, td, i;
		input = document.getElementById("table-search-input");
		filter = input.value.toUpperCase();
		table = document.getElementById("users-table");
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
			'searchBy': val,
			'value': val
		});
		this.changeInputPlaceHolder(val);
	}

	changeInputPlaceHolder(val) {
		var e = document.getElementById('table-search-input');
		e.placeholder=`Search by ${val.toLowerCase()}...`;
  }
  
	render() {
    if ((localStorage.getItem('is_admin') != 1) ||(! localStorage.getItem('is_admin'))) {
        return <h4>&nbsp;&nbsp;Access Denied.</h4>
    } else if (this.state && this.state.redirectTo) { 
  return <Redirect to={this.state.redirectTo} />;
    } else {
    return (
			<div className="container-fluid">
				<div className="form-row">
						<div className="form-group col-md-9">
							<input onKeyUp={this.handleSearchKeyUp.bind(this)} className='form-control' type="text" id="table-search-input" placeholder="Search by ..." />
						</div>
            <div className="form-group col-md-2">
              <select value={this.state.value} id='table-search-select' onChange={this.handleSearchSelectChange.bind(this)} className="form-control custom-select">
                <option>Search Criteria...</option>
                <option>First Name</option>
                <option>Last Name</option>
                <option>Email</option>
                <option>Org</option>
                <option>Role</option>
              </select>
            </div>
				</div>
        
				<br />
				<Table id='users-table' striped bordered hover size="sm">
				 	<thead>
						<tr>
							<th onClick={this.onSort('first_name')}>First Name
              <span className={this.setArrow('first_name')}></span></th>
							<th onClick={this.onSort('last_name')}>Last Name
              <span className={this.setArrow('last_name')}></span></th>
              <th onClick={this.onSort('email')}>Email
              <span className={this.setArrow('email')}></span></th>
							<th onClick={this.onSort('org')}>Org
              <span className={this.setArrow('org')}></span></th>
							<th onClick={this.onSort('admin_flag')}>Role
              <span className={this.setArrow('admin_flag')}></span></th>
							<th>Edit</th>
				    </tr>
				  </thead>
				  <tbody>
				  	{this.renderRows()}
				  </tbody>
				</Table>
			</div>
		);
	}}
}

export { Users };
