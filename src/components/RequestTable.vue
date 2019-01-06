<template>
    <div>
        <div class="toolbar">
            <span v-text="path" class="path"></span>
            <button 
                class="lynBtn delete"
                @click="handleDelete" 
            >delete</button>
            <button 
                class="lynBtn black" 
                v-if="tableType==='shop'" 
                @click="handleBlack" 
            >black</button>
            <button 
                class="lynBtn approve" 
                v-if="tableType==='applying'" 
                @click="handleApprove" 
            >approve</button>
            <button 
                class="lynBtn reject"
                v-if="tableType==='applying'" 
                @click="handleReject" 
                style="marginRight: '5px'"
            >reject</button>
            <Search @submitSearchValue="handleSearch"></Search>
        </div>
        <Table border ref="selection" :columns="col_5" height="600" :data="compositData.result" @on-selection-change="handleSelectionChange"></Table>

        <div class="lynModalMask" v-if="modalForUserInfo">
            <div class="lynModal" >
                <div class="lynModalHeader">
                    <h2>{{modalDataForUserInfo.username}}</h2>
                    <button class="lynModalBack" @click="closeUserInfo">X</button>
                </div>
                <div class="lynModalBody">
                    <span>id: </span>
                    <span v-text="modalDataForUserInfo.id"></span>
                    <br>
                    <span>telephone: </span>
                    <span v-text="modalDataForUserInfo.telephone"></span>
                    <br>
                    <span>email: </span>        
                    <span v-text="modalDataForUserInfo.email"></span>
                    <br>
                    <span>address: </span>        
                    <span v-text="modalDataForUserInfo.address"></span> 
                    <br>
                    <span>updateTime: </span>        
                    <span v-text="modalDataForUserInfo.updateTime"></span> 
                    <br>
                    <span>registerTime: </span>        
                    <span v-text="modalDataForUserInfo.registerTime"></span> 
                    <br>
                    <span>enabled: </span>        
                    <span v-text="modalDataForUserInfo.enabled"></span>
                </div>
                <div class="lynModalFooter">
                    <button class="lynModalClose" @click="closeUserInfo">close</button>
                </div>

            </div>
        </div>
 
        <Modal
            v-model="modalForDetail"
            :title="modalDataForDetail.name">
            <div class="selfDefineModal">
                <img class="bigImage" :src="modalDataForDetail.image" alt="error" title="ad picture">
                <div>
                    <p>
                        {{modalDataForDetail.info}}
                    </p>
                    <span> <strong>id:</strong> {{modalDataForDetail.id}}</span>
                    <br>
                    <span><strong>email:</strong> {{modalDataForDetail.email}}</span>        
                    <br>      
                    <span><strong>telephone:</strong> {{modalDataForDetail.telephone}}</span>                 
                    <br>
                    <span><strong>updateTime:</strong> {{modalDataForDetail.updateTime}}</span>
                </div>
          
            </div>
        </Modal>
    </div>
</template>
<script>
    import Search from './Search'
    import { ROUTERS, GET_URL, REQUEST_STATUS, INSTANCE_STATUS } from '../myConfig.js'
    
    export default {
        name: 'RequestTable',
        props: ['tableData','path','updateCurrentPage','submitSearchValue'],
        components: {
            Search,
        },
        data () {
            return {
                col_5: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Shop name',
                        key: 'name'
                    },
                    {
                        title: 'Telephone',
                        key: 'telephone'
                    },
                    {
                        title: 'Username',
                        key: 'username',
                        render: (h, params) => {// params === {column, index, row}, detail can be seen by log
                            return h('a',{
                                style: {
                                    color: 'green'
                                },
                                on: {
                                    click: () => {
                                        this.getUserInfo(params.index)
                                    }
                                }
                            },params.row.username)
                        }
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            const detailBtn = h('button', {
                                    attrs: {
                                        class: 'lynBtn info smallBtn'
                                    },
                                    on: {
                                        click: () => {
                                            this.getDetails(params.index)
                                        }
                                    }
                                }, 'details')
                            const approveBtn = h('button', {
                                    attrs: {
                                        class: 'lynBtn approve smallBtn'
                                    },
                                    on: {
                                        click: () => {
                                            this.approveRequest(params.row.id)
                                        }
                                    }
                                }, 'approve')
                            const rejectBtn = h('button', {
                                    attrs: {
                                        class: 'lynBtn reject smallBtn'
                                    },
                                    on: {
                                        click: () => {
                                            this.rejectRequest(params.row.id)
                                        }
                                    }
                                }, 'reject')
                            return h('div', [ detailBtn, approveBtn, rejectBtn ]) 
                            }
                    }
                ],
                modalForUserInfo: false,
                modalForDetail: false,
                modalDataForUserInfo: [],
                modalDataForDetail: [],
                modalImage: 'smallImage',
                selection: [],
                tableType: 'shop'
            }
            //className:""
        },
        computed: {
            compositData: function(){//需要从props中提取数据， 但是需要保持提取数据的实时性，所以要用侦听器,也可以使用Vue.set(this,'name',obj)
                let result = []
                let userInfo = []

                if(this.tableData.length == 0){
                    return { userInfo, result }
                }
                else{
                    for(let item of this.tableData){
                        let {  id, name, user, telephone } = item
                        if(user !== null){
                            userInfo.push(user)
                            result.push({ id, telephone, name, username: user.username })
                        }else if( user === null ){
                            userInfo.push(user)
                            result.push({ id, telephone, name, username: null })
                        }
                    }
                    return { userInfo, result }
                }
                
            },
        },
        mounted: function(){//首次进入requestTable,不会检测path变成此路径（因为之前这个组件就没有挂载上），所以需要初始化
            switch(this.path){
                case ROUTERS.applyingRequest: {this.tableType = 'applying'; break}
                case ROUTERS.aprrovedRequest: {this.tableType = 'approved'; break}
                case ROUTERS.rejectedRequest: {this.tableType = 'rejected'; break}
                case ROUTERS.listShop: {this.tableType = 'shop'; break}
                case ROUTERS.SearchForShop: {this.tableType = 'shop'; break}
                default: {
                    console.log('no path is found')
                }
            }
            this.col_5.pop()// 弹出btn组，后面根据判断再加，不能直接赋值，那样不会引起table组件刷新
            this.col_5.push( this.createBtnGroup(this.path) )
        },
        watch: {
            path: function(){// 还是上述问题，path改变render里的东西不会改变，只能出此下策
                switch(this.path){
                    case ROUTERS.applyingRequest: {this.tableType = 'applying'; break}
                    case ROUTERS.aprrovedRequest: {this.tableType = 'approved'; break}
                    case ROUTERS.rejectedRequest: {this.tableType = 'rejected'; break}
                    case ROUTERS.listShop: {this.tableType = 'shop'; break}
                    case ROUTERS.SearchForShop: {this.tableType = 'shop'; break}
                    default: {console.log('no path is found')}
                }
                this.col_5.pop()// 弹出btn组，后面根据判断再加，不能直接赋值，那样不会引起table组件刷新
                this.col_5.push( this.createBtnGroup(this.path) )
            },
            modalForDetail:function(){// 将图片回归原位
                this.modalImage = 'smallImage'
            }
        },
        methods: {
            closeUserInfo(){
                this.modalForUserInfo = false
            },
            getDetails(index){
                this.modalDataForDetail = this.tableData[index]
                this.modalForDetail = true
            },
            approveRequest(id){// request id
                this.$axios({ 
                    url: ROUTERS.handleRequest, 
                    method: 'put', 
                    data: {
                        id,
                        status: REQUEST_STATUS.approved.status
                    }
                })
                .then( res => {this.$Message.success('approve the request successfully');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed to approve the request ')})
            },
            rejectRequest(id){
                this.$axios({ 
                    url: ROUTERS.handleRequest, 
                    method: 'put', 
                    data: {
                        id,
                        status: REQUEST_STATUS.rejected.status
                    }
                })
                .then( res => {this.$Message.success('reject the request successfully');this.$emit('updateCurrentPage')})
                .catch( err => this.$Message.error('failed to reject the request '))
            },
            getUserInfo(index){
                this.modalDataForUserInfo = this.compositData.userInfo[index]
                if(this.modalDataForUserInfo === null ){
                    this.$Message.info('this user has been delete!')
                    return 0
                }
                this.modalForUserInfo = true
            },
            blackSomething(id){
                this.$axios({ 
                    url: ROUTERS.blackSomething, 
                    method: 'post', 
                    data: {
                        type: INSTANCE_STATUS.shop,
                        id
                    }
                })
                .then( res => {this.$Message.success('black the shop successfully');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed to black the shop ')})
            },
            deleteSomething(id){
                let result = confirm('are you sure to delete this shop?')
                if(result){
                    this.$axios({ 
                        url: ROUTERS.deleteShop, 
                        method: 'delete', 
                        params: { id:id }
                    })
                    .then( res => {this.$Message.success('delelte the shop successfully');this.$emit('updateCurrentPage')})
                    .catch( err => {this.$Message.error('failed to delete the shop ')})
                }             
            },
            handleSelectionChange(selection, row){
                this.selection = selection //update options
            },
            handleDelete(){
                if(this.selection.length==0) {
                    this.$Message.warning('no options are selected')
                    return 0
                }

                let url = ''
                if( this.tableType === 'shop' ){// 当前是店铺路径
                    url = GET_URL(ROUTERS.deleteShop)
                }else if( this.tableType === 'applying' || this.tableType === 'rejected' || this.tableType === 'approved' ){// 申请
                    url = GET_URL(ROUTERS.deleteRequest)
                }
                let result = confirm('are you sure to delete them')
                if(result){
                    let arr = []
                    for(let item of this.selection.values()){

                        let p = this.$axios({ url, method:'delete', params: { id:item.id } })
                        arr.push(p)
                    }
                    Promise.all(arr)
                    .then( res => {this.$Message.success('delelte successfully');this.$emit('updateCurrentPage')})
                    .catch( err => {this.$Message.error('failed to delete')})
                }
            },
            handleBlack(){
                if(this.selection.length==0) {//没有选中或者当前不是shop界面
                    this.$Message.warning('no options are selected')
                    return 0
                }else if(this.tableType !== 'shop'){
                    this.$Message.warning('something wrong')
                    return 0
                }

                let arr = []
                for(let item of this.selection.values()){

                    let p = this.$axios({ 
                        url: ROUTERS.blackSomething, 
                        method: 'post', 
                        data: { 
                            id:item.id, 
                            type:INSTANCE_STATUS.shop 
                        }
                    })
                    arr.push(p)
                }
                Promise.all(arr)
                .then( res => {this.$Message.success('success');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed')})


            },
            handleApprove(){
                if(this.selection.length==0) {
                    this.$Message.warning('no options are selected')
                    return 0
                }else if(this.tableType === 'shop' || this.tableType === 'approved'){
                    this.$Message.warning('something wrong')
                    return 0
                }
                let arr = []
                for(let item of this.selection.values()){

                    let p = this.$axios({ 
                        url: ROUTERS.handleRequest, 
                        method: 'put', 
                        data: { 
                            id:item.id, 
                            status: REQUEST_STATUS.approved.status 
                        }
                    })
                    arr.push(p)
                }
                Promise.all(arr)
                .then( res => {this.$Message.success('success');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed')})


            },
            handleReject(){
                if(this.selection.length==0) {
                    this.$Message.warning('no options are selected')
                    return 0
                }else if(this.tableType === 'shop' || this.tableType === 'rejected'){
                    this.$Message.error('something wrong')
                    return 0
                }

                let arr = []
                for(let item of this.selection.values()){

                    let p = this.$axios({ 
                        url: ROUTERS.handleRequest, 
                        method: 'put', 
                        data: { 
                            id:item.id, 
                            status: REQUEST_STATUS.rejected.status 
                        }
                    })
                    arr.push(p)
                }
                Promise.all(arr)
                .then( res => {this.$Message.success('success');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('reject failed')})

            },
            handleSearch(value){
                this.$emit('submitSearchValue', value, ROUTERS.SearchForShop)
            },
            createBtn( h, params, name ){// 0- createElement, 1- the name of btn, 创建btn
                if( name === 'detailBtn' ){
                    return h('button', {
                                attrs: {
                                    class: 'lynBtn info smallBtn'
                                },
                                on: {
                                    click: () => {
                                        this.getDetails(params.index)
                                    }
                                }
                            }, 'details')
                }else if( name === 'approveBtn' ){
                    return h('button', {
                                attrs: {
                                    class: 'lynBtn approve smallBtn'
                                },
                                on: {
                                    click: () => {
                                        this.approveRequest(params.row.id)
                                    }
                                }
                            }, 'approve')
                }else if( name === 'rejectBtn' ){
                    return h('button', {
                                attrs: {
                                    class: 'lynBtn reject smallBtn'
                                },
                                on: {
                                    click: () => {
                                        this.rejectRequest(params.row.id)
                                    }
                                }
                            }, 'reject')
                }else if( name === 'blackBtn' ){
                    return h('button', {
                                attrs: {
                                    class: 'lynBtn black smallBtn'
                                },
                                on: {
                                    click: () => {
                                        this.blackSomething(params.row.id)
                                    }
                                }
                            }, 'black')
                }else if( name === 'deleteBtn' ){
                    return h('button', {
                                attrs: {
                                    class: 'lynBtn delete smallBtn'
                                },
                                on: {
                                    click: () => {
                                        this.deleteSomething(params.row.id)
                                    }
                                }
                            }, 'delete')
                }
            },
            createBtnGroup( type ){
                if( type === ROUTERS.applyingRequest ){
                    return {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [ this.createBtn( h, params, 'detailBtn'), this.createBtn( h, params, 'approveBtn'), this.createBtn( h, params, 'rejectBtn') ]) 
                        }
                    }
                }else if( type === ROUTERS.aprrovedRequest ){
                    return {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [ this.createBtn( h, params, 'detailBtn') ]) 
                        }
                    }
                }else if( type === ROUTERS.rejectedRequest ){
                    return {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [ this.createBtn( h, params, 'detailBtn') ]) 
                        }
                    }
                }else if( type === ROUTERS.listShop || type === ROUTERS.SearchForShop){//待定
                    return {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [ this.createBtn( h, params, 'detailBtn'), this.createBtn( h, params, 'blackBtn'), this.createBtn( h, params, 'deleteBtn') ]) 
                        }
                    }
                }
            }

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
.selfDefineModal{
    position: relative;
    font-size: 15px;
}
.bigImage{
    max-width: 500px;
    max-height: 600px;
}
</style>

