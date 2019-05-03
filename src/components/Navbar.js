import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

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
        localStorage.removeItem('is_admin')
        this.props.history.push('/')
    }
    

    render() {
        
        const loginRegLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/registration" className="nav-link">Registration</Link>
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

            <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
                <Nav className="mr-auto">
                    <Navbar.Brand href="/">Austin Affordable Housing Data Portal</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {localStorage.email ? userLink : loginRegLink}
                        </Nav>
                    </Navbar.Collapse>
                </Nav>
                <Nav>
                    <Nav.Link href="/">
                    {(function() {
                        switch(localStorage.getItem('is_admin')){
                        case '0':
                          return 'Administrator: ';
                        case '1':
                          return 'Power User: ';
                        case '2':
                          return 'Navigator: ';
                        default:
                          return null;
                    }
                })()}
                    {localStorage.getItem('email')}
                    </Nav.Link>
                </Nav>
            </Navbar>
        )
    }


}

export default withRouter(NavBar)