import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';

// other packages
// import _ from "underscore";

// utilities
import { debugLog } from './components/utilities';

import {Login} from './components/Login/Login'
import Registration from './components/Registration'
import Notfound from './components/notfound'
import {UpdateProperties} from './components/UpdateProperties/UpdateProperties.jsx';
import {UpdateProperty} from './components/UpdateProperty/UpdateProperty.jsx';
import {PrivateRoute} from './components/PrivateRoute/PrivateRoute.jsx';
import {NewProperty} from './components/NewProperty/NewProperty.jsx';
import Navbar from './components/Navbar'

debugLog(
  {
      log: {
          message: "testing debug log",
          level: "info",
          origin: "client"
      },
      logToServer:true
  }
);



class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/registration/" component={Registration} />
              <PrivateRoute exact path="/update_property/:id" component={UpdateProperty} />
              <PrivateRoute exact path='/update_properties/' component={UpdateProperties} />
              <PrivateRoute exact path='/new_property/' component={NewProperty} />
              <Route component={Notfound} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
