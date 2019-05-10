import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import axios from 'axios'

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
        //console.log(localStorage.isLoggedIn);
        var email = localStorage.getItem('email');
        var queryString = '/registration?userEmail=' + email;
        
        axios.get(queryString)
            .then((res) => {//authortized user. Do nothing.
                if (res &&  !res.data.success && res.data.redirect) {
                    localStorage.clear();
                    this.setState({redirectTo: '/'});
                    //console.log('something');
                }
            })
            .catch((e) => {
                // if not authorized, we want to redirect to login page
                console.log(e.response);
                //return res.status(401).send({success: false, redirect: '/'})
                if (e && e.response && !e.response.data.success && e.response.data.redirect) {
                    //localStorage.clear();
                    this.setState({redirectTo: '/'});
                    //console.log('something');
                }
            });
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
            </ul>
        )
        const userLink = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/update_properties" className="nav-link">All Properties</Link>
                </li>
                <li className="nav-item">
                    <Link to="/registration" className="nav-link">Registration</Link>
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
                <Navbar.Brand href="/">Austin Affordable Housing Data Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        { (localStorage.getItem('email')===null) ? loginRegLink:userLink}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }


}

export default withRouter(NavBar)