// import _ from "underscore";
import axios from "axios";
// import API from './Api';

function logEvent(data) {
    axios.post("/log_event", data)
        .then(function(response) {

        })
        .catch(function(error) {

        });
}

export function debugLog({log = {}, logToServer = true} = {}) {
    if (logToServer) {
        logEvent(log);
    }
    return;
}

