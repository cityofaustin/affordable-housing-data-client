// react
import React, { Component } from 'react';
import {Navigate} from 'react-router-dom';
// axios
import axios from 'axios';
// import API from '../Api';
// dev files
import { debugLog } from '../utilities';
// css
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'
// import Nav from 'react-bootstrap/Nav';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			redirectToReferrer: false,
		}

		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin(e) {
		e.preventDefault(); // prevent form submit

		var email = document.getElementById('email_login').value;
		var postData = {
			email: email,
			pass: document.getElementById('email_pass').value
		};

		axios.post(
			'/login',
			postData
		).then((res) => {
			var elem = document.getElementById('login_failed_msg');
			if (!res.data.success) {
				elem.style.display = 'block';
			} else {
				elem.style.display = 'none';
				localStorage.setItem('isLoggedIn', 'true');
				localStorage.setItem('email', email);
				localStorage.setItem('is_admin', res.data.is_admin);
				this.setState(() => ({
					redirectToReferrer: true
				}));
			}
		}).catch((e) => {
			var elem = document.getElementById('login_error_msg');
			elem.style.display = 'block';
			if (!(e && e.response && e.response.data && e.response.data.serverSideError)) {
				debugLog(
				    {
				        log: {
				            message: e.toString(),
				            level: "info",
				            origin: "client"
				        },
				        logToServer: true
				    }
				);
			}
		});
	}

	render() {
		const { from } = {from: {pathname: '/update_properties'}};
		const { redirectToReferrer } = this.state;

		if (redirectToReferrer === true) {
			return <Navigate to={from} />
		}

		return(
			<div className="container">
				<div id='login-container'>
					
						<div id='login-img-container'>
							<img src='/img/house.png' alt="house" />
						</div>
						<div id='login-title-container'>
							<span id='affordable-housing-data-hub-title'>Austin Affordable Housing Data Portal</span>
						</div>
						<br/>
						<div className='login-form-container'>
							<div>
								<form className='form-group'>
									<span>Email</span>
									<br/>
									<input id='email_login' className='login_input form-control' autoComplete='on'></input>
									<br/>
									<span>Password</span>
									<br/>
									<input id='email_pass' className='login_input form-control' type='password' autoComplete='on'></input>
									<br/>
									<button className='btn btn-primary btn-login' onClick={this.handleLogin}>Login</button>
								</form>
							</div>
							<div id='login_failed_msg'>Login failed. Username and password combination is incorrect.</div>
							<div id='login_error_msg'>Login failed. Please contact system adminstrator for details.</div>
						</div>
				</div>
			</div>
		)
	}
}

export {Login};
