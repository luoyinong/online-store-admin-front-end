<template>
    <div>
        <div class="toolbar">
            <span v-text="path" class="path"></span>
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
        </div>
        <Table border ref="selection" :columns="col_6" height="600" :data="compositData.result" @on-selection-change="handleSelectionChange"></Table>
 
         <Modal
            v-model="modalForDetails"
            :title="modalDetailsData.name">
            <div class="selfDefineModal">
                <img class="bigImage" :src="modalDetailsData.image" alt="error" title="ad picture">
                <div>
                    <p>
                        {{modalDetailsData.info}}
                    </p>
                    <br>      
                    <span><strong>type:</strong> {{modalDetailsData.type}}</span>
                    <br>
                    <template v-if="modalDetailsData.type=='commodity'">
                        <span><strong>shop name:</strong> {{modalDetailsData.shopName}}</span>
                        <br>
                        <span><strong>category:</strong> {{modalDetailsData.category}}</span>
                        <br>
                    </template>
                    <span><strong>telephone:</strong> {{modalDetailsData.telephone}}</span> 
                    <br>
                    <span><strong>email:</strong> {{modalDetailsData.email}}</span>
                </div>
          
            </div>
        </Modal>
    </div>
</template>
<script>
import Search from './Search'
import { ROUTERS, GET_URL, REQUEST_STATUS, INSTANCE_STATUS } from '../myConfig.js'

export default {
    name: 'AdRequestTable',
    props: ['tableData','path','updateCurrentPage'],
    components: {
        Search,
    },
    data() {
        return {
            col_6: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'ad revenues',
                    key: 'fee'
                },
                {
                    title: 'name',
                    key: 'name',
                },
                {
                    title: 'type',
                    key: 'type',
                },
                {
                    title: 'Telephone',
                    key: 'telephone',
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
            modalForDetails: false,
            modalDetailsData: [],
            modalImage: 'smallImage',
            selection: [],
            tableType: 'applying'
        }
        //className:""
    },
    computed: {
        compositData: function(){//需要从props中提取数据， 但是需要保持提取数据的实时性，所以要用侦听器,也可以使用Vue.set(this,'name',obj)
            let result = []
            let details = []

            if(this.tableData.length == 0){
                return { details, result }
            }
            else{
                console.log(this.tableData)
                for(let item of this.tableData){
                    let { id, fee, product, shop, image } = item
                    if(product === null && shop === null){//出bug咯
                        console.log(1)
                    }else if(product === null && shop !== null){//店铺广告
                        let { name, info, email, telephone } = shop
                        details.push({ name, info, image, type: 'shop', email, telephone  })
                        result.push({ id, fee, name, type: 'shop', telephone })
                    }else if( shop === null && product !== null){//商品广告
                        let { name, info, shop: shop1, category } = product
                        let { name: shopName, email, telephone } = shop1
                        details.push({ name, info, image, type: 'commodity', shopName, category, email, telephone })
                        result.push({ id, fee, name, type: 'commodity', telephone })
                    }else{
                        console.log('nothing is matched')
                    }
                }
                console.log(result)
                return { details, result }
            }
            
        },
    },
    mounted: function(){//首次进入requestTable,不会检测path变成此路径（因为之前这个组件就没有挂载上），所以需要初始化
        switch(this.path){
            case ROUTERS.adApplying: {this.tableType = 'applying'; break}
            case ROUTERS.adApproved: {this.tableType = 'approved'; break}
            case ROUTERS.adRejected: {this.tableType = 'rejected'; break}
            default: {
                console.log('no path is found')
            }
        }
        this.col_6.pop()// 弹出btn组，后面根据判断再加，不能直接赋值，那样不会引起table组件刷新
        this.col_6.push( this.createBtnGroup(this.path) )
    },
    watch: {
        path: function(){// 还是上述问题，path改变render里的东西不会改变，只能出此下策
            switch(this.path){
                case ROUTERS.adApplying: {this.tableType = 'applying'; break}
                case ROUTERS.adApproved: {this.tableType = 'approved'; break}
                case ROUTERS.adRejected: {this.tableType = 'rejected'; break}
                default: {console.log('no path is found')}
            }
            this.col_6.pop()// 弹出btn组，后面根据判断再加，不能直接赋值，那样不会引起table组件刷新
            this.col_6.push( this.createBtnGroup(this.path) )
        },
        modalForDetail:function(){// 将图片回归原位
            this.modalImage = 'smallImage'
        }
    },
    methods: {
            getDetails(index){
                this.modalDetailsData = this.compositData.details[index]
                this.modalForDetails = true
            },
            changeImageSize(src){
                console.log(src)
                if(this.modalImage == 'smallImage')
                    this.modalImage = 'bigImage'
                else
                    this.modalImage = 'smallImage'
            },
            approveRequest(id){// request id
                this.$axios({ 
                    method:'put', 
                    url: ROUTERS.handleAdvertisement, 
                    data:{
                        id,
                        status: REQUEST_STATUS.approved.status
                    }
                })
                .then( res => {this.$Message.success('approve the request successfully');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed to approve the request ')})
            },
            rejectRequest(id){
                this.$axios({ 
                    url: ROUTERS.handleAdvertisement, 
                    method: 'put', 
                    data:{
                        id,
                        status: REQUEST_STATUS.rejected.status
                    }
                })
                .then( res => {this.$Message.success('reject the request successfully');this.$emit('updateCurrentPage')})
                .catch( err => this.$Message.error('failed to reject the request '))
            },
            handleSelectionChange(selection, row){
                this.selection = selection //update options
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
                        url:ROUTERS.handleAdvertisement, 
                        method:'put', 
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
                        url: ROUTERS.handleAdvertisement, 
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
                }
            },
            createBtnGroup( type ){
                if( type === ROUTERS.adApplying ){
                    return {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [ this.createBtn( h, params, 'detailBtn'), this.createBtn( h, params, 'approveBtn'), this.createBtn( h, params, 'rejectBtn') ]) 
                        }
                    }
                }else if( type === ROUTERS.adApproved || type === ROUTERS.adRejected ){
                    return {
                        title: 'Action',
                        key: 'action',
                        width: 225,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [ this.createBtn( h, params, 'detailBtn') ]) 
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