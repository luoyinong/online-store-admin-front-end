import axios from 'axios'
import { ROOT_URL } from '../myConfig'

axios.defaults.withCredentials = true // 让ajax携带cookie

const service = axios.create({
    baseURL: ROOT_URL,
    timeout: 5000
})

//后端直接标识浏览器（估计是ip),所以不用在头部带TOKEN
// service.interceptors.request.use( config => {

// })

service.interceptors.response.use( res => {
    let data = res.data
    if( data.status !== 200)
        return Promise.reject('error')
    else
        return res 
}, error => { //先统一处理，没处理的给后面
    let err = error.response.data
    console.log(err)
    return Promise.reject(err)
})

export default service