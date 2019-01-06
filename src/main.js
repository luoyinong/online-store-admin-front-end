// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import request from './api/request'
import axios from 'axios'
import moment from 'moment'
import lang from 'iview/dist/locale/en-US';

import { Input, Button, DropdownMenu, Dropdown, DropdownItem, 
  Icon, Avatar, MenuItem, MenuGroup, Menu, Submenu, Page, 
  Table, Modal, Message, InputNumber,Select, Option, DatePicker,
  locale  } from 'iview'
import VeLine from 'v-charts/lib/line.common'
import 'iview/dist/styles/iview.css'
import './style/button.css'
import './style/modalStyle.css'
import './style/animate/animate.css'

Vue.prototype.$axios = request
Vue.prototype.axios = axios
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal
Vue.prototype.$Moment = moment


Vue.config.productionTip = false
locale(lang);//transfor iview to english

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
Vue.component('InputNumber', InputNumber)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('DatePicker', DatePicker)
Vue.component(VeLine.name, VeLine)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

