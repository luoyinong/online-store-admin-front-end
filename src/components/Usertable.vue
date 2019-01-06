<template>
    <div>
        <div class="toolbar">
            <span v-text="path" class="path"></span>
            <button  
                @click="deletetheseUser"
                class="lynBtn delete"
            >delete</button>
            <button 
                class="lynBtn black"  
                @click="blacktheseUser" 
            >black</button>
            <Search @submitSearchValue="handleSearch"></Search>
        </div>
        <Table border ref="selection" :columns="col_8" height="600" :data="tableData" @on-selection-change="handleSelectionChange"></Table>
        <Modal
            v-model="modalForRole"
            title="identity information">
            <ul>
                <li v-for="item in modalDataForRole" :key="item.id">
                    <span>id: {{item.id}}</span>
                    <p>role: {{item.name}}</p>
                </li>
            </ul>
          
        </Modal>
    </div>
</template>
<script>
    import Search from './Search'
    import { ROUTERS, GET_URL, REQUEST_STATUS, INSTANCE_STATUS } from '../myConfig.js'
    
    export default {
        name: 'Usertable',
        props: ['tableData','path','updateCurrentPage','submitSearchValue'],
        components: {
            Search,
        },
        data () {
            return {
                col_8: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'name',
                        key: 'username'
                    },
                    {
                        title: 'Telephone',
                        key: 'telephone'
                    },                    
                    {
                        title: 'Email',
                        key: 'email'
                    },                    
                    {
                        title: 'Address',
                        key: 'address'
                    },                                      
                    {
                        title: 'UpdateTime',
                        key: 'updateTime'
                    },                    
                    {
                        title: 'RegisterTime',
                        key: 'registerTime'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            const roleInfoBtn = h('button', {
                                    attrs: {
                                        class: 'lynBtn info smallBtn'
                                    },
                                    on: {
                                        click: () => {
                                            this.getRoleInfo(params.index)
                                        }
                                    }
                                }, 'roleInfo')
                            const blackBtn = h('button', {
                                    attrs: {
                                        class: 'lynBtn black smallBtn'
                                    },
                                    on: {
                                        click: () => {
                                            this.blackSomebody(params.row.id)
                                        }
                                    }
                                }, 'black')
                            const deleteBtn = h('button', {
                                    attrs: {
                                        class: 'lynBtn delete smallBtn'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteSomebody(params.row.id)
                                        }
                                    }
                                }, 'delete')
                            return h('div', [ roleInfoBtn, blackBtn, deleteBtn ]) 
                        }
                    }
                ],
                modalForRole: false,
                modalDataForRole: [],
                selection: [],
            }
            //className:""
        },
        computed: {
            userInfo: function(){//需要从props中提取数据， 但是需要保持提取数据的实时性，所以要用侦听器,也可以使用Vue.set(this,'name',obj)
                let userInfo = []
                console.log('userInfo')
                for(let item of this.tableData){
                    let { roles } = item
                    userInfo.push(roles)
                }
                return userInfo
            },
        },
        methods: {
            handleSelectionChange(selection){
                this.selection = selection //update options
            },
            getRoleInfo(index){
                this.modalDataForRole = this.userInfo[index]
                this.modalForRole = true
            },
            blackSomebody(id){// request id
                let type = 0
                if( this.path === ROUTERS.listSeller || this.path === ROUTERS.SearchForSeller ){// 当前是卖家路径
                    type = INSTANCE_STATUS.seller
                }else if( this.path === ROUTERS.listBuyer || this.path === ROUTERS.SearchForBuyer){// 买家
                    type = INSTANCE_STATUS.buyer
                }

                this.$axios({ 
                    url: ROUTERS.blackSomething, 
                    method: 'post', 
                    data: {
                        id,
                        type: type
                    }
                })
                .then( res => {this.$Message.success('black this user successfully');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed to black this user')})
            },
            deleteSomebody(id){
                let url = ''
                if( this.path === ROUTERS.listSeller || this.path === ROUTERS.listSeller){// 当前是卖家路径
                    url = GET_URL(ROUTERS.deleteSeller)
                }else if( this.path === ROUTERS.listBuyer || this.path === ROUTERS.SearchForBuyer){// 买家
                    url = GET_URL(ROUTERS.deleteBuyer)
                }
                let result = confirm('are you sure to delete this user?')
                if(result){
                    this.$axios({ 
                        url, 
                        method: 'delete',
                        params:{ id:id }
                    })
                    .then( res => {this.$Message.success('delelte successfully');this.$emit('updateCurrentPage')})
                    .catch( err => {this.$Message.error('failed to delete')})
                }             
            },
            blacktheseUser(){
                if(this.selection.length==0) {
                    this.$Message.warning('no options are selected')
                    return 0
                }

                let type = 0
                if( this.path === ROUTERS.listSeller || this.path === ROUTERS.SearchForSeller){// 当前是卖家路径
                    type = INSTANCE_STATUS.seller
                }else if( this.path === ROUTERS.listBuyer || this.path === ROUTERS.SearchForBuyer){
                    type = INSTANCE_STATUS.buyer
                }
                let result = confirm('are you sure to black these people')
                if(result){
                    let arr = []
                    for(let item of this.selection.values()){
                        let p = this.$axios({ 
                            url: ROUTERS.blackSomething, 
                            method: 'post', 
                            data: { id:item.id, type: type }
                        })
                        arr.push(p)
                    }
                    Promise.all(arr)
                    .then( res => {this.$Message.success('black these user successfully');this.$emit('updateCurrentPage')})
                    .catch( err => {this.$Message.error('failed to black these user')})
                }
            },
            deletetheseUser(){
                if(this.selection.length==0) {
                    this.$Message.success('no options are selected')
                    return 0
                }

                let url = ''
                if( this.path === ROUTERS.listSeller || this.path === ROUTERS.SearchForSeller){// 当前是卖家路径
                    url = GET_URL(ROUTERS.deleteSeller)
                }else if( this.path === ROUTERS.listBuyer || this.path === ROUTERS.SearchForBuyer){// 买家
                    url = GET_URL(ROUTERS.deleteBuyer)
                }
                let result = confirm('are you sure to delete these people')
                if(result){
                    let arr = []
                    for(let item of this.selection.values()){
                        let p = this.$axios.delete({ 
                            url, 
                            method: 'delete', 
                            params:{ id:item.id }
                        })
                        arr.push(p)
                    }
                    Promise.all(arr)
                    .then( res => {this.$Message.success('delelte these user successfully');this.$emit('updateCurrentPage')})
                    .catch( err => {this.$Message.error('failed to delelte these user')})
                }
            },
            handleSearch(value){
                let path = ''
                if(this.path === ROUTERS.listSeller)
                    path = ROUTERS.SearchForSeller
                else if(this.path === ROUTERS.listBuyer)
                    path = ROUTERS.SearchForBuyer
                this.$emit('submitSearchValue', value, path)
            },
        }
    }
</script>
<style scoped>
.toolbar{
    height: 35px;
    margin: 20px;
}
.path{
    color: rgb(49, 49, 49);
    line-height: 35px;
    font-size: 20px;
}
</style>

