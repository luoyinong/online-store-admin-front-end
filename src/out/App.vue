<template>
  <div id="app">
    <Login v-if="status==='login'? true : false" @toggle="handleLog"/>
    <Admin v-if="status==='admin'? true : false" @toggle="handleQuit" :adminInfo="userInfo"/>
  </div>
</template>
<script>
/* eslint-disable */
import Login from './components/Login'
import Admin from './components/Admin'

export default {
  name: 'App',
  data(){
    return {
      status: 'login',
      userInfo: {},
    }
  },
  components: {
    Login,
    Admin
  },
  mounted(){
    let user = window.sessionStorage.getItem('admin_name')
    if( user !== null){
      this.axios.get('http://39.98.165.19:8080/user/auth', { params: {username: user} })
      .then((res) => {
        let authorities = res.data.data.authorities[0]
        console.log(authorities)
        if ( authorities.authority === 'ROLE_ADMIN' ){

          this.status = 'admin'
          this.userInfo = res.data.data.principal
        }
      })
      .catch( (err) => {
        let res = err.response
        let user = window.sessionStorage.getItem('admin_name')
        if (res.status == 500 && user !== null){//之前处于登录状态 
          window.sessionStorage.removeItem('admin_name')//清除登录信息
          this.$Message.info('your status has expired')
        }else{
          console.log(res)
        }
      })
    }
  },
  methods: {
    handleLog(userInfo){// 登入，记录用户信息
      this.status = 'admin'
      this.userInfo = userInfo
    },
    handleQuit(){// 登出，清空用户信息
      this.$axios.get('http://39.98.165.19:8080/logout')
      .then( res => {
        this.status = 'login'
        this.userInfo = {}
      })
      .catch( err => {
        this.status = 'login'
        this.userInfo = {}
      })
    }
  },
}
</script>

<style>
#app{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
