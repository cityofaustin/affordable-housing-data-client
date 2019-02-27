import React, { Component } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
    }

    
    logOut(e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('email')
        this.props.history.push('/')
    }
    

    render() {
        
        const loginRegLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                </li>
            </ul>
        )
        const userLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/update_properties" className="nav-link">All Properties</Link>
                </li>
                <li className="nav-item">
                    <Link to="/" onClick={this.logOut.bind(this)} className="nav-link">
                    Logout
                    </Link>
                </li>
            </ul>
        )

        return (

            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Austin Affordable Housing Data Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {localStorage.usertoken ? userLink : loginRegLink}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }


}

export default withRouter(NavBar)