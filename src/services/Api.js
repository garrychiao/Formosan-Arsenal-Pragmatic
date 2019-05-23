import axios from 'axios'

export default () => {
    if (process.env.NODE_ENV === 'production') {
        return axios.create({
            //
        });
    } else {
        return axios.create({
            // baseURL: `http://localhost:8080/`,
        });
    }
}