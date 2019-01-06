// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { Input, Button, DropdownMenu, Dropdown, DropdownItem, Icon, Avatar, MenuItem, MenuGroup, Menu, Submenu, Page, Table, Modal, Message } from 'iview'
import 'iview/dist/styles/iview.css'
import './style/button.css'
import './style/modalStyle.css'
import './style/animate/animate.css'
import request from './api/request'
import axios from 'axios'

Vue.prototype.$axios = request
Vue.prototype.axios = axios
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal


Vue.config.productionTip = false
Vue.component('Input', Input)
Vue.component('Button', Button)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownItem', DropdownItem)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('Icon', Icon)
Vue.component('Avatar', Avatar)
Vue.component('MenuItem', MenuItem)
Vue.component('MenuGroup', MenuGroup)
Vue.component('Menu', Menu)
Vue.component('Submenu', Submenu)
Vue.component('Page', Page)
Vue.component('Table', Table)
Vue.component('Modal', Modal)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
