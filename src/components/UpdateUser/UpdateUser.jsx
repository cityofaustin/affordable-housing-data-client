// react
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
//import _ from "underscore";
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './UpdateUser.css';

class UpdateUser extends Component {
  constructor(props) {
      super(props);
      this.state = {
          data: {
            first_name: '',
            last_name: '',
            email: '',
            org: '',
            admin_flag: '2',
            passwd: ''
          },
          updatedUserData: {

          }
      }
      this.onSubmit = this.onSubmit.bind(this);
      this.handleUpdateUserData = this.handleUpdateUserData.bind(this);
      var userId = this.props.match.params.id;
      var queryString = `/get_user_byID?userId=${userId}`;
      axios.get(queryString)
        .then((res) => {
          this.setState({'data': res.data.data});
        })
        .catch((e) => {
          if (e && e.response && !e.response.data.success && e.response.data.redirect) {
            this.setState({redirectTo: '/'});
          }
        });      
  };

  handleUpdateUserData(data) {
    if (typeof(data.value) === "string" && data.value.trim().length === 0) {
        if (data.field === "passwd") {
            this.setState(Object.assign(this.state.updatedUserData,{[data.field]:{value:undefined}}));
        } else {
        this.setState(Object.assign(this.state.updatedUserData,{[data.field]:{value:null}}));
        }
    } else {
        this.setState(Object.assign(this.state.updatedUserData,{[data.field]:{value:data.value}}));
    }
  }

  onInputChange(field, e) {
    var ChangedData = {
        field: field,
        value: e.target.value,
    }
    this.handleUpdateUserData(ChangedData);
    this.setState(Object.assign(this.state.data,{[field]:e.target.value}));
  }
  validate = () => {
      let lastnameError= '';
      let firstnameError= '';
      let emailError= '';
      let orgError= '';
      //console.log(this.state.updatedUserData);
      if (Object.keys(this.state.updatedUserData).length === 0) {
        return false;
      } else if (Object.keys(this.state.updatedUserData).length === 1 && Object.keys(this.state.updatedUserData)[0] === 'passwd' && this.state.updatedUserData['passwd'].value === undefined)  {
          console.log("Invalid New Password.");
          return false;
      } else {
        if (!this.state.first_name || this.state.first_name.trim()===''){
            firstnameError='Invalid First Name'
        }
        if (!this.state.last_name || this.state.last_name.trim()===''){
            lastnameError='Invalid Last Name'
        }
        if (!this.state.email || !this.state.email.includes('@')){
            emailError='Invalid Email'
        }
        if (!this.state.org  || this.state.org.trim()===''){
            orgError='Invalid Organization'
        }
        
        this.setState({emailError, lastnameError, firstnameError, orgError});
        if (emailError || lastnameError || firstnameError || orgError){
            return false;
        }
      }
      return true;
  }

  hideSaveMessage() {
      document.getElementById('regi-success').style.display = 'none';
      return;
  }

  showSaveMessage() {
      document.getElementById('regi-success').style.display = 'block';
      return;
  }

  onSubmit (e) {
      e.preventDefault()
      const isValid = this.validate()

      if (isValid){
        
		axios.post(
			`/update_user?userEmail=${localStorage.getItem('email')}`,
			{
				updatedUserData: this.state.updatedUserData,
				userId: this.props.match.params.id
			})
			.then((res) => {
                this.setState(Object.assign(this.state.updatedUserData,{}));
                //this.setState({updatedUserData:{}}); //SAVE successfully. Now cleanup variable that holds updated data.
                toast.success('User record has been updated.');
                this.showSaveMessage();
			})
			.catch((e) => {
				this.showFailureMessage();
			});
      }
  }

  render () {
      if ((localStorage.getItem('is_admin') > 1) ||(localStorage.getItem('is_admin') === null)) {
          return <h4>&nbsp;&nbsp;Access Denied.</h4>
      } 
      else if (this.state && this.state.redirectTo) { 
        return <Redirect to={this.state.redirectTo} />;
      } 
      else if (this.state.data !== undefined) {
        return (
          <div className="container">
              
              <h1>Edit User</h1>
              <Form noValidate onSubmit={this.onSubmit}>
                  
                  <Form.Group controlId="formBasicFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control required name="first_name" type="text" placeholder="Enter First Name" value={this.state.data.first_name || ''} onChange={this.onInputChange.bind(this, 'first_name')} />
                      <Form.Text className="text-danger">{this.state.firstnameError}</Form.Text>
                  </Form.Group>
                  
                  <Form.Group controlId="formBasicLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control required name="last_name" type="text" placeholder="Enter Last Name" value={this.state.data.last_name || ''} onChange={this.onInputChange.bind(this, 'last_name')} />
                      <Form.Text className="text-danger">{this.state.lastnameError}</Form.Text>
                  </Form.Group>
                  
                  <Form.Group controlId="formBasicOrganization">
                      <Form.Label>Organization</Form.Label>
                      <Form.Control name="org"  type="text" placeholder="Enter Organization Name" value={this.state.data.org || ''} onChange={this.onInputChange.bind(this, 'org')} />
                      <Form.Text className="text-danger">{this.state.orgError}</Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control required name="email" type="email" placeholder="Enter Email" value={this.state.data.email  || ''} onChange={this.onInputChange.bind(this, 'email')} />
                      <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                      </Form.Text>
                      <Form.Text className="text-danger">{this.state.emailError}</Form.Text>
                  </Form.Group>
                  
                  <div className="form-group" id="adminFlag">
                      <label>Role&nbsp;&nbsp;&nbsp;&nbsp;</label>
                      <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="admin_flag" id="navigatorFlag" value="2" 
                              onChange={this.onInputChange.bind(this, 'admin_flag')}
                              defaultChecked={this.state.data.admin_flag === 2 ? true : false} /> 
                          <label className="form-check-label" htmlFor="navigatorFlag">Navigator</label>&nbsp;&nbsp;

                          <input className="form-check-input" type="radio" name="admin_flag" id="administratorFlag" value="0" 
                              onChange={this.onInputChange.bind(this, 'admin_flag')}
                              defaultChecked={this.state.data.admin_flag === 0 ? true : false} />
                          <label className="form-check-label" htmlFor="administratorFlag">Administrator</label>&nbsp;&nbsp;
                          
                          <input className="form-check-input" type="radio" name="admin_flag" id="administratorFlag" value="1" 
                              onChange={this.onInputChange.bind(this, 'admin_flag')}
                              defaultChecked={this.state.data.admin_flag === 1 ? true : false} />
                          <label className="form-check-label" htmlFor="administratorFlag">Super Administrator</label>
                      </div>
                  </div>

                  <Form.Group controlId="formBasicPassword">
                      <Form.Label>New Password *</Form.Label>
                      <Form.Control name="passwd"  type="password" placeholder="Leave as is if you want to keep current password." value={this.state.data.passwd || ''} onChange={this.onInputChange.bind(this, 'passwd')} />
                      <Form.Text className="text-danger">
                      * Only fill in this field if you want to CHANGE password
                      </Form.Text>
                  </Form.Group>

                  <Button type="submit" variant="primary">
                  Update
                  </Button>
                  <div><span id='regi-success' className='text-success'>
                      Success! User has been updated.
                  </span></div>
              </Form>
          </div>
      )
  }
  else  {
    return (
    <div>
        User Not Found.
    </div>)
 }}
}

export {UpdateUser};
