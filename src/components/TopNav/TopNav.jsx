// react libraries
import React, { Component } from 'react';
import {Navigate} from 'react-router-dom';
import axios from 'axios';
// import API from '../Api';
// css
import './TopNav.css';

class TopNav extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleAllPropertiesClick(e) {
		if (window.location.pathname !== '/update_properties') {
			this.setState({
				'redirectTo': '/update_properties'
			});
		}
	}

	handleLogoutClick(e) {
		// var email = localStorage.getItem('email');
		// console.log(email)

		axios
			.post('/logout',{
				email:localStorage.getItem('email')
			})
			.then((res) => {
				// remove local storage 
				localStorage.clear()
				this.setState({
					'redirectTo': '/'
				});
			})
	}

	render() {
		if (this.state.redirectTo) {
			return <Navigate to={ this.state.redirectTo } />;
		}

		return (
			<div className='top-nav'>
				<div className='top-nav-header-container'>
					<span className='top-nav-header'>Austin Affordable Housing Data Portal</span>
				</div>
				<ul className='top-nav-links'>
					<li onClick={this.handleAllPropertiesClick.bind(this)}>All Properties</li>
					<li onClick={this.handleLogoutClick.bind(this)}>Logout</li>
				</ul>
			</div>
		);
	}
}

export { TopNav };
