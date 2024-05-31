//import _ from "underscore";
import axios from "axios";

function logEvent(data) {
    axios.post("/log_event", data)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
}

export function debugLog({log = {}, logToServer = true} = {}) {
    if (logToServer) {
        logEvent(log);
    }
    return;
}

