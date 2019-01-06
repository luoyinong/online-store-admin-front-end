<template>
    <div>
        <div class="toolbar">
            <span class="path">transaction</span>
        </div>
        <div class="table">
            <h1 class="curveTitle">{{startTime}} {{typeForTime}}(s)-{{endTime}} {{typeForTime}}s ago income curve</h1>
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
                    <Button slot="append" icon="ios-search" @click="handleSearchForPartlyIncome"></Button>
                </div>
                <Button type="info" @click="handleGetAllIncome">total income</Button>
                <div style="fontSize: 20px;">
                    <span>Current commission rate: <span style="color: red;">{{rate*100}}</span> %</span>
                    <Button type="success" @click="handleChange">change</Button>
                </div>
            </div>
            <div class="curve">
                <ve-line :data="{ columns: columns, rows: realRows }" :settings="chartSettings" width="700px"></ve-line>
            </div>
        </div>
        <Modal title="Total income" v-model="modalboolean" init-options="light">
            <ul>
                <li>advertisement income: {{totalIncome.adSales}}</li>
                <li>commission income: {{totalIncome.commission}}</li>
                <li>total income: {{totalIncome.totalSales}}</li>
            </ul>
        </Modal>
    </div>
</template>
<script>
import { ROUTERS, REQUEST_STATUS, INSTANCE_STATUS, TYPE } from '../myConfig.js'

export default {
    name: 'CommissionRate',
    data(){
        return {
            rate: '',
            totalIncome: { ad:0, commission:0, totalSales:0 },
            modalboolean: false,
            income: [],//考虑到异步添加数据，最好由键名而不是插入顺序决定键值
            timeDate: new Date(),
            timeNumber: 0,
            timeForIncome: 0,
            typeForTime: 'day',
            startTime: 0,
            curveData: [],
            columns: [ 'date', 'adIncome', 'commissionIncome', 'totalIncome'],
            rows: Array(7).fill(0),
            realRows: [],
            chartSettings: {
                metrics: ['adIncome', 'commissionIncome', 'totalIncome'],
                dimension: ['date'],
                area: true,
            }
        }
    },
    mounted(){
        this.getCommissionRate()
        for( let i = this.timeForIncome; i <= this.timeForIncome+6; i++){
            this.getPartlyIncome( i, this.formatedType )
        }
        this.changeChart()
    },
    methods: {
        handleChange(){
            let rateValue = 0
            this.$Modal.confirm({
                render: (h) => {
                    return h('InputNumber', {
                        props: {
                            value: rateValue,
                            autofocus: true,
                            max: 100,
                            min: 0,
                        },
                        on: {
                            input: (val) => {
                                rateValue = val;
                            }
                        },
                    })
                },
                onOk: () => {
                    if (rateValue > 100 || rateValue < 0){
                        this.$Message.info('rate must be between 0-100')
                    }else{
                        this.$axios({ url: ROUTERS.changeCommissionRate, method: 'post', data: { rate: rateValue/100 } })
                        .then( res => this.getCommissionRate())
                    }
                }
            })
 
        },
        handleSearchForPartlyIncome(){
            this.rows = Array(7).fill(0)
            switch(this.typeForTime){
                case 'day': {
                    let i = Math.floor((new Date().getTime()-this.timeDate.getTime())/(1000*60*60*24));
                    if(i < 0){
                        this.$Message.info('date is not correct')
                    }else{
                        this.timeForIncome = i
                    }
                    break;
                }
                case 'week': {
                    this.timeForIncome = this.timeNumber
                    break;
                }
                case 'month': {
                    let i = (new Date().getFullYear()-this.timeDate.getFullYear())*12+new Date().getMonth()-this.timeDate.getMonth()
                    if(i < 0){
                        this.$Message.info('date is not correct')
                    }else{
                        this.timeForIncome = i
                    }
                    break;
                }
                case 'year': {
                    let i = new Date().getFullYear()-this.timeDate.getFullYear()
                    if(i < 0){
                        this.$Message.info('date is not correct')
                    }else{
                        this.timeForIncome = i
                    }
                    break;
                }
            }

            this.startTime = this.timeForIncome
            for( let i = this.timeForIncome; i <= this.timeForIncome+6; i++){
                this.getPartlyIncome( i, this.formatedType )
            }
            this.changeChart()
        },
        getCommissionRate(){
            this.$axios({ url: ROUTERS.commissionRate })
            .then( res => this.rate = res.data.data )
        },
        handleGetAllIncome(){
            this.$axios({ url: ROUTERS.totalIncome })
            .then( res => {
                let data = res.data.data
                this.totalIncome = data
                this.modalboolean = true
            })
        },
        getPartlyIncome( date, type ){
            this.$axios({ url: ROUTERS.partlyIncome, params: { beforeNum: date, type }})
            .then( res => {
                let data = res.data.data
                data.date = date
                let row = this.formatData(data)
                if( this.typeForTime !== 'week' ){ // date越大时间越小
                    this.rows.splice( this.endTime-date, 1, row)//为了保持顺序
                }else{
                    this.rows.splice( date-this.startTime, 1, row)//为了保持顺序
                }
            })
            .catch( err => console.log('something is wrong'))
        },
        formatData( data ){
            let result = { date:0, adIncome:0, commissionIncome:0, totalIncome:0 }
            if(this.typeForTime !== 'week')
                result.date = this.$Moment().subtract( data.date,this.typeForTime+'s' ).format(this.formatedTime)
            else
                result.date = data.date + 'week'
            result.adIncome = data.adSales
            result.commissionIncome = data.commission
            result.totalIncome = data.totalSales
            return result
        },
        changeChart(){//自动更新有问题，手动更新
            this.realRows = this.rows
        }
    },
    computed: {
        formatedType(){
            let result = {
                day: 'daily',
                week: 'weekly',
                month: 'monthly',
                year: 'yearly'
            }
            return result[this.typeForTime]
        },
        formatedTime(){
            let result = {
                day: 'YYYY-MM-DD',
                month: 'YYYY-MM',
                year: 'YYYY'
            }
            return result[this.typeForTime]
        },
        endTime(){
            return this.startTime+6
        },
        whichToDisplay(){
            let result = {
                day: 'date',
                week: 'week',
                month: 'month',
                year: 'year'
            }
            return result[this.typeForTime]
        },
    }
}
</script>
<style scoped>
    .toolbar{
        margin: 20px;
    }
    .path{
        color: rgb(49, 49, 49);
        line-height: 35px;
        font-size: 20px;
    }
    .table{
        width: 100%;
        min-height: 700px;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: initial;
        align-items: center;
    }
    .curveTitle{
        font-size: 35px;
        color: black;
        text-align: center;
    }
    .tool{
        color: rgb(19, 19, 19);
        width: 80%;
        margin: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .curve{
        width: 700px;
        height: 400px;
        background: yellowgreen;
        margin-top: 20px;
    }
</style>