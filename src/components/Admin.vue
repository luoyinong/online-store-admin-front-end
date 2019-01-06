<template>
  <div id="admin">
    <Navigation :adminName="name" @searchListener="handleSearch" @quit="handleQuit"/>
    <Sidebar @changePath="handleChangeContent"/>
    <Content 
        :data="dataFromAdmin" 
        :numberOfPage="numberOfPage"
        :pageSize="pageSize"
        :path="path" 
        @changePage="handleChangePage" 
        @submitSearchValue="handleSearch"
    />
  </div>
</template>

<script>
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import Content from './Content'
import { ROOT_URL, PAGE_SIZE, ROUTERS, REQUEST_STATUS, GET_URL, INSTANCE_STATUS, TYPE } from '../myConfig.js'


export default {
    name: 'Admin',
    props:['adminInfo'],
    data(){
        let name = this.adminInfo.username
        return {
            name: name,
            path: ROUTERS.listSeller,
            dataFromAdmin: [],
            numberOfPage: 0,
            pageSize: PAGE_SIZE.large,

        }
    },
    components: {
        Navigation,
        Sidebar,
        Content
    },
    methods: {
        handleSearch(value,path){
            this.handleChangeContent(path,value)
        },
        handleQuit(){
            this.$emit('toggle')
        },
        handleChangeContent(pageName,searchValue){//  pagename sidebar或者search给的路径   待优化
            let loading = this.$Message.loading({//显示loading
                content: 'loading...',
                duration: 5,
            })

            switch(pageName){
                case ROUTERS.applyingRequest: {// 先查看申请数量，分页，传递数据  申请中
                    this.$axios({ url: ROUTERS.requestAmount, method: 'get', params: REQUEST_STATUS.applying } )
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large // 规定页面大小
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize) // 计算页数, res.data.data-记录数量
                        let options = { status: REQUEST_STATUS.applying.status, size: this.pageSize, page: 0 }
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listRequest), pageName, loading, options) //跳转页面

                    })
                    .catch( err => console.log(err))
                    break
                }
                case ROUTERS.aprrovedRequest: {// 通过的店铺申请
                    this.$axios( { url: ROUTERS.requestAmount, method: 'get', params: REQUEST_STATUS.approved } )
                    .then( res => {
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        // this.pageSize = PAGE_SIZE.large
                        let options = { status: REQUEST_STATUS.approved.status, size: this.pageSize, page: 0 }
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listRequest), pageName, loading, options)

                    })
                    .catch( err => console.log(err))
                    break
                }
                case ROUTERS.rejectedRequest: {// 拒绝的店铺申请
                    this.$axios({ url: ROUTERS.requestAmount, method: 'get', params: REQUEST_STATUS.rejected } )
                    .then( res => {
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        // this.pageSize = PAGE_SIZE.large
                        let options = { status: REQUEST_STATUS.rejected.status, size: this.pageSize, page: 0 }
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listRequest),  pageName, loading, options)

                    })
                    .catch( err => console.log(err))
                    break
                }
                case ROUTERS.adApplying: {//申请中的申请
                    this.$axios({ url: ROUTERS.adRequestAmount, method: 'get' } )
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large // 规定页面大小
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize) // 计算页数, res.data.data-记录数量
                        let options = { status: REQUEST_STATUS.applying.status, size: this.pageSize, page: 0 }
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listAdRequest), pageName, loading, options) //跳转页面

                    })
                    .catch( err => console.log(err))
                    break
                }
                case ROUTERS.adApproved: {//同意的申请
                    this.$axios({ url: ROUTERS.adRequestAmount, method: 'get' } )
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large // 规定页面大小
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize) // 计算页数, res.data.data-记录数量
                        let options = { status: REQUEST_STATUS.approved.status, size: this.pageSize, page: 0 }
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listAdRequest), pageName, loading, options) //跳转页面

                    })
                    .catch( err => console.log(err))
                    break
                }
                case ROUTERS.adRejected: {//拒绝的申请
                    this.$axios({ url: ROUTERS.adRequestAmount, method: 'get' } )
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large // 规定页面大小
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize) // 计算页数, res.data.data-记录数量
                        let options = { status: REQUEST_STATUS.rejected.status, size: this.pageSize, page: 0 }
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listAdRequest), pageName, loading, options) //跳转页面

                    })
                    break
                }
                case ROUTERS.listShop: { // 显示店铺
                    this.$axios({ url: ROUTERS.shopAmount, method: 'get' })
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        let options = { page: 0, size: this.pageSize}
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listShop), pageName, loading, options)

                    })
                    .catch( err => console.log(err))
                    break
                }
                case ROUTERS.listSeller: { // 显示卖家
                    this.$axios({ url: ROUTERS.sellerAmount, method: 'get' })
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        let options = { page: 0, size: this.pageSize}                        
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listSeller), pageName, loading, options)

                    })
                    .catch( err => console.log(err))
                    break
                }
                case ROUTERS.listBuyer: { // 显示买家
                    this.$axios({ url: ROUTERS.buyerAmount, method: 'get' })
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        let options = { page: 0, size: this.pageSize}                        
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listBuyer), pageName, loading, options)

                    })
                    .catch( err => console.log(err.response))
                    break
                }
                case ROUTERS.sellerBlacklist: { // 卖家黑名单
                    this.$axios({ url: ROUTERS.blacklistAmount, method: 'get', params: { type: INSTANCE_STATUS.seller } })
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        let options = { type: INSTANCE_STATUS.seller, page: 0, size: this.pageSize}                        
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listBlacklist), pageName, loading, options)

                    })
                    .catch( err => console.log(err.response))
                    break                    
                }
                case ROUTERS.buyerBlacklist: { // 买家黑名单
                    this.$axios({ url: ROUTERS.blacklistAmount, method: 'get', params: { type: INSTANCE_STATUS.buyer } } )
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        let options = { type: INSTANCE_STATUS.buyer, page: 0, size: this.pageSize}                        
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listBlacklist), pageName, loading, options)

                    })
                    .catch( err => console.log(err.response))
                    break                    
                }
                case ROUTERS.shopBlacklist: { // 店铺黑名单
                    this.$axios({ url: ROUTERS.blacklistAmount, method: 'get', params: { type: INSTANCE_STATUS.shop } })
                    .then( res => {
                        // this.pageSize = PAGE_SIZE.large
                        this.numberOfPage = Math.ceil(res.data.data/this.pageSize)
                        let options = { type: INSTANCE_STATUS.shop, page: 0, size: this.pageSize}                        
                        this.jumpToPageWithOptions( GET_URL(ROUTERS.listBlacklist), pageName, loading, options)

                    })
                    .catch( err => console.log(err.response))
                    break                    
                }
                case ROUTERS.commissionRate: { // rate
                    this.path = pageName
                    loading()
                    break
                }
                case ROUTERS.orders: { // rate
                    this.path = pageName
                    loading()
                    break
                }
                case ROUTERS.SearchForShop:{ //店铺搜索结果,精确搜索，只返回一个结果

                    // this.pageSize = PAGE_SIZE.large
                    this.numberOfPage = 1
                    let options = { shopname: searchValue, type: 'search' }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.SearchForShop), pageName, loading, options)

                    break                    
                }
                case ROUTERS.SearchForSeller: { // 显示卖家搜索结果

                    // this.pageSize = PAGE_SIZE.large
                    this.numberOfPage = 1
                    let options = { username: searchValue, type: 'search' }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.SearchForSeller), pageName, loading, options)

                    break
                }
                case ROUTERS.SearchForBuyer: { // 显示买家搜索结果

                    // this.pageSize = PAGE_SIZE.large
                    this.numberOfPage = 1
                    let options = { name: searchValue, type: 'search' }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.SearchForBuyer), pageName, loading, options)

                    break
                }   
                default: {
                    this.$Message.info(pageName)
                }
            }
        },
        handleChangePage( page, state ){// page 第几页  state 请求页面类型
            let loading = this.$Message.loading({//显示loading
                content: 'loading...',
                duration: 5,
            })
            switch(state.type){
                case TYPE.request: {
                    let options = { status: state.data.status, size: this.pageSize, page: page }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.listRequest), this.path, loading, options)
                    break
                }
                case TYPE.shop: {
                    let options = { size: this.pageSize, page: page }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.listShop), this.path, loading, options)
                    break
                }
                case TYPE.seller: {
                    let options = { size: this.pageSize, page: page }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.listSeller), this.path, loading, options)
                    break
                }
                case TYPE.buyer: {
                    let options = { size: this.pageSize, page: page }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.listBuyer), this.path, loading, options)
                    break
                }
                case TYPE.blacklist: {
                    let options = { type: state.data, page: page, size: this.pageSize }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.listBlacklist), this.path, loading, options)
                    break
                }
                case TYPE.adRequest: {
                    let options = { status: state.data.status, page: page, size: this.pageSize }
                    this.jumpToPageWithOptions( GET_URL(ROUTERS.listAdRequest), this.path, loading, options)
                    break
                }
                default: {
                    this.$Message.info('no type is matched in admin handlechangepage')
                }
            }

        },
        jumpToPageWithOptions(url, pageName, loading, options ){// pageName 路径缩写， size 页面大小 
            this.$axios({ url, method: 'get', params: options })
            .then( res => {
                if( options.type === 'search' ){ //如果是搜索
                    this.dataFromAdmin = []
                    this.dataFromAdmin.push(res.data.data)
                    this.path = pageName
                }else{
                    this.dataFromAdmin = res.data.data
                    this.path = pageName
                }
                loading();// 关闭loading框
                console.log(this.dataFromAdmin)
            })
            .catch( err => {
                this.dataFromAdmin = []
                this.path = pageName 
                this.$Message.error('no result')
                loading();// 关闭loading框
                console.log(`require for ${url} failed`)
                })
        },
    },

}
</script>

<style scoped>
    #admin{
        width: 100%;
        height: 100%;
        background-image: url('../../static/img/background.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center; 
        position: absolute;
    }
</style>
