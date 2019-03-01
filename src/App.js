import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//import NavBar from './components/Navbar'
import {TopNav} from './components/TopNav/TopNav.jsx'
import Register from './components/Register'
//import Login from './components/Login'
import {Login} from './components/Login/Login.jsx'
import {UpdateProperties} from './components/UpdateProperties/UpdateProperties.jsx';
import {UpdateProperty} from './components/UpdateProperty/UpdateProperty.jsx';
import {PrivateRoute} from './components/PrivateRoute/PrivateRoute.jsx';
import {NewProperty} from './components/NewProperty/NewProperty.jsx';

class App extends Component {
  render() {
    return (
      <Router basename={window.location.pathname}>
          <div className="App">
            <TopNav />

            <ToastContainer autoClose={8000} />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/register" component={Register} />
              <div className="container-fluid">
                <PrivateRoute exact path="/update_property/:id" component={UpdateProperty} />
                <PrivateRoute exact path='/update_properties' component={UpdateProperties} />
                <PrivateRoute exact path='/new_property' component={NewProperty} />
              </div>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
