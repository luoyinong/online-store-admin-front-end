<template>
    <div id="content">
        <div class="mask"></div>
        <div class="form">
            <component 
                :is="whichDisplay.currentContent"
                :tableData="data" 
                :path="this.path" 
                @updateCurrentPage="handleUpdatePage"
                @submitSearchValue="handleSearch"
            ></component>
            <div class="pageContainer" v-if="whichDisplay.page">
                <Page :total="numberOfPage*pageSize" :page-size="pageSize" class="page" show-elevator :current="page" @on-change="handleChangePage"/>
            </div>
            
        </div>
        
    </div>
</template>
<script>
import RequestTable from './RequestTable'
import UserTable from './UserTable'
import Blacklist from './Blacklist'
import AdRequestTable from './AdRequestTable'
import CommissionRate from './CommissionRate'
import OrderTable from './OrderTable'

import { ROUTERS, REQUEST_STATUS, INSTANCE_STATUS, TYPE } from '../myConfig.js'

export default {
    name: "Content",
    props: {
        numberOfPage: { 
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 0
        },
        data: {
            type: Array,
            default: []
        },
        path: {
            type: String,
            default: ROUTERS.listSeller
        },
        submitSearchValue: {
            type: Object,
            default: function(){ console.log('no search value')}
        }
    },
    data(){
        return {
            page: 1,//第几页
            currentContent: 'RequestTable'
        }
    },
    components: {
        RequestTable,
        UserTable,
        Blacklist,
        AdRequestTable,
        CommissionRate,
        OrderTable
    },
    computed: {
        whichDisplay: function(){
            let options = {
                page: true,
                currentContent: 'RequestTable',
            }
            if( this.path === ROUTERS.applyingRequest ||
                this.path === ROUTERS.aprrovedRequest ||
                this.path === ROUTERS.rejectedRequest ||
                this.path === ROUTERS.listShop ||
                this.path === ROUTERS.SearchForShop
            ){
                options.currentContent = 'RequestTable'
            }else if( this.path === ROUTERS.listSeller ||
                      this.path === ROUTERS.listBuyer ||
                      this.path === ROUTERS.SearchForSeller ||
                      this.path === ROUTERS.SearchForBuyer
                    ){
                options.currentContent = 'UserTable'
            }else if( this.path === ROUTERS.sellerBlacklist ||
                      this.path === ROUTERS.buyerBlacklist ||
                      this.path === ROUTERS.shopBlacklist 
                    ){
                options.currentContent = 'Blacklist'
            }else if(                
                this.path === ROUTERS.adApplying ||
                this.path === ROUTERS.adApproved ||
                this.path === ROUTERS.adRejected
                ){
                    options.currentContent = 'AdRequestTable'
            }else if(                
                this.path === ROUTERS.commissionRate
                ){
                    options.currentContent = 'CommissionRate'
                    options.page = false
                }
            else if(                
                this.path === ROUTERS.orders
                ){
                    options.currentContent = 'OrderTable'
                    options.page = false
                }
            else{
                console.log('can not find the path')
            }
            return options
        }
    },
    methods: {
        handleChangePage(page){
            page = page - 1
            let state = { type: TYPE.default, data: 0}// 计算出 是哪种页面类型
            switch( this.path ){
                case ROUTERS.rejectedRequest: {
                    state.type = TYPE.request
                    state.data = REQUEST_STATUS.rejected
                    this.$emit('changePage', page, state)
                    break
                }
                case ROUTERS.aprrovedRequest: {
                    state.type = TYPE.request
                    state.data = REQUEST_STATUS.approved
                    this.$emit('changePage', page, state)
                    break
                }
                case ROUTERS.applyingRequest: {
                    state.type = TYPE.request
                    state.data = REQUEST_STATUS.applying
                    this.$emit('changePage', page, state)      
                    break                         
                }
                case ROUTERS.listShop: {
                    state.type = TYPE.shop
                    state.data = INSTANCE_STATUS.shop
                    this.$emit('changePage', page, state)
                    break
                }
                case ROUTERS.listSeller: {
                    state.type = TYPE.seller
                    state.data = INSTANCE_STATUS.seller
                    this.$emit('changePage', page, state)
                    break
                }
                case ROUTERS.listBuyer: {
                    state.type = TYPE.buyer
                    state.data = INSTANCE_STATUS.buyer
                    this.$emit('changePage', page, state)  
                    break              
                }
                case ROUTERS.sellerBlacklist: {
                    state.type = TYPE.blacklist
                    state.data = INSTANCE_STATUS.seller
                    this.$emit('changePage', page, state) 
                    break
                }
                case ROUTERS.buyerBlacklist: {
                    state.type = TYPE.blacklist
                    state.data = INSTANCE_STATUS.buyer
                    this.$emit('changePage', page, state) 
                    break
                }
                case ROUTERS.shopBlacklist: {
                    state.type = TYPE.blacklist
                    state.data = INSTANCE_STATUS.shop
                    this.$emit('changePage', page, state) 
                    break
                }
                case ROUTERS.adApplying: {
                    state.type = TYPE.adRequest
                    state.data = REQUEST_STATUS.applying
                    this.$emit('changePage', page, state)
                    break
                }
                case ROUTERS.adApproved: {
                    state.type = TYPE.adRequest
                    state.data = REQUEST_STATUS.approved
                    this.$emit('changePage', page, state)
                    break
                }
                case ROUTERS.adRejected: {
                    state.type = TYPE.adRequest
                    state.data = REQUEST_STATUS.rejected
                    this.$emit('changePage', page, state)
                    break
                }
                default: {
                    console.log('can not find the path')
                }
            }
            this.page = page + 1
            
        },
        handleUpdatePage(){
            console.log('update page:'+this.path)
            this.handleChangePage(this.page)
        },
        handleSearch(value,path){
            this.$emit('submitSearchValue',value,path)
        }
    }

}
</script>
<style scoped>
    @keyframes slideToLeft {
        from{
            transform: translate(0);
        }
        to{
            transform: translate(-100%)
        }
    }
    #content{
        width: 100%;
        height: 100%;
        background: transparent;
        position: absolute;
        left: 0;
        /* animation: slideToLeft 1.2s linear 1.4s forwards; */
    }
    .mask{
        width: 100%;
        height: 100%;
        background: rgba(255, 232, 169, 0.1);
    }
    .form{
        display: block;
        min-width: 650px;
        overflow-y: scroll;
        background: rgba(255, 255, 255, 0.767);
        position: absolute;
        top: 70px;
        left: 240px;
        bottom: 0;
        right: 0;

    }
    .pageContainer{
        display: inline-block;
        position: relative;
        left: 50%;
    }
    .page{
        position: relative;
        left: -50%;
    }
</style>
