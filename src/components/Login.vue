<template>
  <div id="container">
    <div class="mask">
      <img class="logo" src="../../static/img/logo.png"/>
        <transition
          appear
          appear-active-class="animated bounceInDown"
          enter-active-class="animated bounceInDown"
          leave-active-class="animated bounceOutUp"
        >
          <div class="login-form" v-if="form" >
            <div class="title">
              <h2 class="title1">Admin Login</h2>
            </div>
            <div id="Login">
              <div class="form-group">
                <label for="inputEmail">Username</label>
                <input type="text" class="form-control" id="inputEmail" placeholder="Email Address" v-model="username" @keyup.enter="handleLogin">   
              </div>    
              <div class="form-group">
                <label for="inputPassword">Password</label>
                <input type="password" class="form-control" id="inputPassword" placeholder="Password" v-model="password" @keyup.enter="handleLogin">
              </div>
              <button type="submit" class="btn" @click="handleLogin">Login</button>
            </div>
          </div> 
        </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      form: true,
    }
  },
  mounted(){
    this.form = true

  },
  methods: {
    handleLogin() {
        let username = this.username
        let password = this.password
        if( username.trim() === '' || password.trim() === ''){
          this.$Message.info('username or password should be written')
          return 0
        }
        this.axios.get('http://39.98.165.19:8080/user/role', { params: {username} })//先获取用户类型，后端偷懒，没得法
        .then( res => {
          let data = res.data.data
          console.log(data)
          let isAdmin = false
          // for( let item of data.values()){// 在360浏览器上这个语法有问题
          for ( let i = 0; i < data.length; i++ ){//如果是admin
            let item = data[i]
            if(item.name === 'ROLE_ADMIN'){
              isAdmin = true
              break
            }
          }
          if(res.data.status === 200 && isAdmin){
            this.axios.post('http://39.98.165.19:8080/user/login',{username,password})
            .then( res => {
              let data = res.data.data
              if(res.data.status === 200){
                this.form = false
                window.sessionStorage.setItem('admin_name', data.principal.username)//用senssionStorage储存用户名
                setTimeout(()=> this.$emit('toggle',data.principal), 1000)//为了让退出动画可以被看到
                
              }
              console.log(data.principal)
            })
            .catch( error => this.$Message.error('name or password is wrong'))
          }else if(res.data.status === 200 && !isAdmin){
            this.$Message.error('this is not admin account')
          }
        })
    }
  }
}


</script>

<style scoped>


#container{ 
  width:100%; 
  height: 100%; 
  min-width: 600px;
  background-image:url("../../static/img/background.jpg"); 
  background-repeat:no-repeat; 
  background-position:center; 
  background-size:cover; 
  position: relative;
  }
.mask{
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(156, 241, 234, 0.3);
  position: absolute;
}
.logo{
  width: 200px;
}
.login-form{
  z-index: 3;
  width: 400px;
  height: 460px;
  background: rgb(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 10px 10px 10px rgb(56, 55, 55);
  float: right;
  margin: 10% 10% auto auto;
}
.title{
  width: 100%;
  height: 70px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom: 2px solid rgb(66, 65, 65);
}
.title1{
  display: inline-block;
  font-size: 28px;
  color: rgb(44, 43, 43);
  /* text-shadow: 0 0 1px rgb(59, 59, 59); */
  margin-left: 30px;
  height: 70px;
  line-height: 70px;
}
#login{
  margin-top: 30px;
}
.form-group{
  font-size: 20px;
  width: 300px;
  margin: 30px auto;
}
.form-control{
  width: 300px;
  height: 40px;
  padding-left: 20px;
  margin-top: 10px;
  border: 1px solid black;
  border-radius: 5px;
}

.form-control:focus{
  outline: none;
  border-color: blueviolet;
  box-shadow: 0 0 1px blueviolet;
}

.form-control::-webkit-input-placeholder {
  font-size: 18px;;
	color: rgb(179, 179, 179);
}
.form-control:-ms-input-placeholder { 
  font-size: 18px;;
	color: rgb(179, 179, 179);
}
.form-control:-moz-placeholder {
  font-size: 18px;;
	color: rgb(179, 179, 179);
}
.form-control::-moz-placeholder {
  font-size: 18px;;
	color: rgb(179, 179, 179);
}
.btn{
  display: block;
  width: 300px;
  height: 40px;
  margin: 10px auto;
  background: rgb(255, 216, 87);
  border: none;
  border-radius: 5px;
}
.btn:focus{
  outline: none;
  box-shadow: 0 0 1px rgb(66, 127, 241);
}
.btn:active{
  background: rgb(247, 208, 79);
}

</style>
