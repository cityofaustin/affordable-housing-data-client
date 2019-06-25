import axios from 'axios'

export const register = newUser => {
    return axios
        .post('/users/register', {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            org: newUser.org,
            email: newUser.email,
            passwd: newUser.passwd,
            admin_flag: newUser.admin_flag
        })
        .then(res => {
            console.log('User has been Registered')
        })
}
