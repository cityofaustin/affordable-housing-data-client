import axios from 'axios'

export const register = newUser => {
    return axios
        .post('/users/register', {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            passwd: newUser.passwd
        })
        .then(res => {
            console.log('Reistered')
        })
}

export const login = user => {
    return axios
        .post('/users/login', {
            email: user.email,
            passwd: user.passwd
        })
        .then(res => {
            localStorage.setItem('usertoken', res.data)
            return res.data
        })
        .catch(err => {
            console.log(err)
        })
}