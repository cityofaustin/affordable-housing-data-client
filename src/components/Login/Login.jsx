// react
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
// axios
import axios from 'axios';
import API from '../ExpressAPIEndpoint';
// dev files
import { debugLog } from '../utilities';
// css
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'
//import './signin.css'

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

		//todo: add endpoint 
		//axios.post(
		API.post(
			'/login',
			postData
		).then((res) => {
			var elem = document.getElementById('login_failed_msg');
			if (!res.data.success) {
				elem.style.display = 'block';
			} else {
				elem.style.display = 'none';
				var localGroup={}
				localGroup={
					"isLoggedIn":"true",
					"email": email
				}
				localStorage.setItem('usertoken', localGroup);
				localStorage.setItem('isLoggedIn', 'true');
				localStorage.setItem('email', email);
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
			return <Redirect to={from} />
		}

		return(
			<div id='login-container' className="container text-center">
				<div id='login-img-container'>
					<img src='/img/house.png' alt='House' />
				</div>
				<div id='login-title-container'>
					<span id='affordable-housing-data-hub-title'>Austin Affordable Housing Data Portal</span>
				</div>
					<br/>
					<div className='login-form-container'>
						<form className="form-signin">
							<label htmlFor="email_login" className="sr-only">Email</label>
							<input id='email_login' className='login_input form-control' autoComplete='on' placeholder="Email" />
							
							
							<label htmlFor="email_pass" className="sr-only">Password</label>
							<input id='email_pass' className='login_input form-control' type='password' autoComplete='on' placeholder="Password" />

							<button className='btn btn-primary btn-lg btn-block' onClick={this.handleLogin}>Login</button>
						</form>
						<div id='login_failed_msg'>Login failed. Username and password combination is incorrect.</div>
						<div id='login_error_msg'>Login failed. Please contact system adminstrator for details.</div>
					</div>
			</div>
		)
	}
}

export {Login};