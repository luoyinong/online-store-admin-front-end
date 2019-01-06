<template>
    <div>
        <div class="toolbar">
            <span class="path">order</span>
            <Search @submitSearchValue="handleSearch"></Search>
        </div>
        <div class="table">
            <h1 class="curveTitle">{{timeForOrders}} {{typeForTime}}(s) ago orders chart</h1>
            <div class="tool">
                <div>
                    <DatePicker 
                        :type="whichToDisplay" 
                        v-if="whichToDisplay!=='week'" 
                        placement="bottom-end" 
                        style="width: 120px"
                        v-model="timeDate"
                    ></DatePicker>
                    <InputNumber :min="0" v-model="timeNumber" v-if="whichToDisplay==='week'"></InputNumber>
                    <Select v-model="typeForTime" slot="prepend" style="width: 80px">
                        <Option value="day">day(s)</Option>
                        <Option value="week">week(s)</Option>
                        <Option value="month">month(s)</Option>
                        <Option value="year">year(s)</Option>
                    </Select>
                    <Button slot="append" icon="ios-search" @click="handleSearchForOrders" type="info"></Button>
                    <span>0 means current time</span>
                </div>
            </div>
            <div class="tableContainer">
                <Table border ref="selection" :columns="col_7" height="600" :data="compositData"></Table>
            </div>
            <div class="pageContainer">
                <Page :total="amount" :page-size="pageSize" class="page" show-elevator :current="page" @on-change="handleChangePage"/>
            </div>
        </div>
    </div>
</template>
<script>
import Search from './Search'
import { ROUTERS, PAGE_SIZE, GET_URL, REQUEST_STATUS, INSTANCE_STATUS } from '../myConfig.js'

export default {
    name: 'OrderTable',
    components: {
        Search,
    },
    data() {
        return {
            col_7: [
                {
                    title: 'Product name',
                    key: 'productName',
                },
                {
                    title: 'Shop name',
                    key: 'shopName'
                },
                {
                    title: 'Customer name',
                    key: 'userName',
                },
                {
                    title: 'Money',
                    key: 'totalPrice',
                },
                {
                    title: 'Commission',
                    key: 'commission',
                },
                {
                    title: 'State',
                    key: 'status'
                },
                {
                    title: 'Date',
                    key: 'createTime',
                }
            ],
            tableData: [],
            timeForOrders: 0,
            timeDate: new Date(),
            timeNumber: 0,
            typeForTime: 'day',
            amount: 5,
            pageSize: PAGE_SIZE.large,
            page: 1,
        }
        //className:""
    },
    mounted: function(){
        this.getOrders()
    },
    computed: {
        compositData: function(){//需要从props中提取数据， 但是需要保持提取数据的实时性，所以要用侦听器,也可以使用Vue.set(this,'name',obj)
            let result = []

            if(this.tableData.length == 0){
                return result
            }
            else{
                console.log(this.tableData)
                for(let item of this.tableData){
                    let { productName, shopName, userName, totalPrice, commission, status, createTime } = item
                    result.push({ productName, shopName, userName, totalPrice, commission, status, createTime })
                }
                return result
            }
            
        },
        formatedType(){
            let result = {
                day: 'daily',
                week: 'weekly',
                month: 'monthly',
                year: 'yearly'
            }
            return result[this.typeForTime]
        },
        whichToDisplay(){
            let result = {
                day: 'date',
                week: 'week',
                month: 'month',
                year: 'year'
            }
            return result[this.typeForTime]
        }
    },
    methods: {
        handleSearch(value){
            if( value.trim() === '')
                this.$Message.info('you should enter order id')
            else 
                this.$axios({ url: ROUTERS.searchForOrder, params: { orderId: value }})
                .then( res => {
                    this.tableData = []
                    this.tableData.push(res.data.data) 
                    })
        },
        handleSearchForOrders(){
            switch(this.typeForTime){
                case 'day': {
                    let i = Math.floor((new Date().getTime()-this.timeDate.getTime())/(1000*60*60*24));
                    if(i < 0){
                        this.$Message.info('date is not correct')
                    }else{
                        this.timeForOrders = i
                    }
                    break;
                }
                case 'week': {
                    this.timeForOrders = this.timeNumber
                    break;
                }
                case 'month': {
                    let i = (new Date().getFullYear()-this.timeDate.getFullYear())*12+new Date().getMonth()-this.timeDate.getMonth()
                    if(i < 0){
                        this.$Message.info('date is not correct')
                    }else{
                        this.timeForOrders = i
                    }
                    break;
                }
                case 'year': {
                    let i = new Date().getFullYear()-this.timeDate.getFullYear()
                    if(i < 0){
                        this.$Message.info('date is not correct')
                    }else{
                        this.timeForOrders = i
                    }
                    break;
                }
            }
            this.getOrders()
        },
        getOrders(){
            this.$axios({ url: ROUTERS.ordersAmount, params: { beforeNum:this.timeForOrders, type: this.formatedType }})
            .then( res => {
                this.amount = res.data.data
                this.$axios({ 
                    url: ROUTERS.orders, 
                    params:{ beforeNum:this.timeForOrders, type: this.formatedType, page: this.page - 1, size: this.pageSize }
                    })
                .then( res => {
                    this.tableData = res.data.data
                })
                .catch( err => {
                    this.tableData = []
                    this.$Message.error('no result')
                })
            })
        },
        handleChangePage(num){
            this.page = num
            this.getOrders()
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
.table{
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.curveTitle{
    text-align: center;
}
.tool{
    margin: 20px 0;
}
.tableContainer{
    width: 100%;
}
.pageContainer{
    margin: 20px 0;
}

</style>