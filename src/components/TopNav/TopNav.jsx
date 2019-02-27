// react libraries
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
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
        localStorage.removeItem('usertoken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('email')
		this.setState({
			'redirectTo': '/'
		});
	}

	logOut(e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('email')
		// this.props.history.push('/')
		this.setState({
			'redirectTo': '/'
		})
    }

	render() {
		if (this.state.redirectTo) {
			return <Redirect to={ this.state.redirectTo } />;
		}

		const loginRegLink = (
            <ul className='top-nav-links'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
		)
		const userLink = (
            <ul className='top-nav-links'>
                <li><Link to="/update_properties">All Properties</Link></li>
                <li><Link to="/" onClick={this.logOut.bind(this)} >Logout</Link></li>
            </ul>
        )

		return (
			<div className='top-nav'>
				<div className='top-nav-header-container'>
					<span className='top-nav-header'>Austin Affordable Housing Data Portal</span>
				</div>
				{localStorage.usertoken ? userLink : loginRegLink}
			</div>
		);
	}
}

export { TopNav };