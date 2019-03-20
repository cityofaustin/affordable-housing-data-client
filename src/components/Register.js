import React, { Component } from 'react';

import { register } from './RegisterFunctions';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const initalState = {
    first_name: '',
    last_name: '',
    email: '',
    org: '',
    passwd: '',
    lastnameError: '',
    firstnameError: '',
    emailError: '',
    passwordError: '' 
}

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = initalState

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange (e) {
        const isCheckbox = e.target.type === "checkbox"
        this.setState({ 
            [e.target.name]: isCheckbox
                ? e.target.checked
                : e.target.value 
        })
    }

    validate = () => {
        let lastnameError= '';
        let firstnameError= '';
        let emailError= '';
        let passwordError= ''; 

        if (!this.state.first_name){
            firstnameError='Invalid First Name'
        }
        if (!this.state.last_name){
            lastnameError='Invalid Last Name'
        }
        if (!this.state.email.includes('@')){
            emailError='Invalid Email'
        }
        if (!this.state.passwd){
            passwordError='Invalid Password'
        }

        
        if (emailError || lastnameError || firstnameError || passwordError){
            this.setState({emailError, lastnameError, firstnameError, passwordError});
            return false;
        }

        return true;
    }

    onSubmit (e) {
        e.preventDefault()
        const isValid = this.validate()

        if (isValid){
            //console.log(this.state)
            toast.success('User has been registered.')

            const user = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                org: this.state.org,
                passwd: this.state.passwd
            }

            register(user).then(res => {
                this.props.history.push(`/`)
            })

            //clear form
            this.setState(initalState);
       
        }


    }

    render () {
        return (
            <div className="container">
            
                <h1>Register</h1>
                <Form noValidate onSubmit={this.onSubmit}>
                    
                    <Form.Group controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control required name="first_name" type="text" placeholder="Enter first name" value={this.state.first_name} onChange={this.onChange} />
                        <Form.Text className="text-danger">{this.state.firstnameError}</Form.Text>
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control required name="last_name" type="text" placeholder="Enter last name" value={this.state.last_name} onChange={this.onChange} />
                        <Form.Text className="text-danger">{this.state.lastnameError}</Form.Text>
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicOrganization">
                        <Form.Label>Organization</Form.Label>
                        <Form.Control name="org"  type="text" placeholder="Enter Organization Name" value={this.state.org} onChange={this.onChange} />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required name="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.onChange} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                        <Form.Text className="text-danger">{this.state.emailError}</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required name="passwd" type="password" placeholder="Password" value={this.state.passwd} onChange={this.onChange} />
                        <Form.Text className="text-danger">{this.state.passwordError}</Form.Text>
                    </Form.Group>

                    <Button type="submit" variant="primary">
                    Register
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Register
