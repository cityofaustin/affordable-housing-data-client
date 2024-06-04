import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// other packages
// import _ from "underscore";

// utilities
import { debugLog } from './components/utilities';

import {Login} from './components/Login/Login'
import Registration from './components/Registration'
import Notfound from './components/notfound'
import {UpdateProperties} from './components/UpdateProperties/UpdateProperties.jsx';
import UpdateProperty from './components/UpdateProperty/UpdateProperty.jsx';
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

// Upgrade from react-router-dom V5: https://web.archive.org/web/20211208071534/https://reactrouter.com/docs/en/v6/upgrading/v5

class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
            <Navbar />
            <ToastContainer autoClose={5000} />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/registration/" element={<Registration />} />
              <Route element={<PrivateRoute/>}>
                <Route path="/update_property/:id" element={ <UpdateProperty />} />
                <Route path='/update_properties/' element={ <UpdateProperties />} />
                <Route path='/new_property/' element={ <NewProperty />} />
              </Route>
              <Route element={<Notfound />} />
            </Routes>
          </div>
        </Router>
    );
  }
}

export default App;