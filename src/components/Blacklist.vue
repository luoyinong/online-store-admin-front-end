<template>
    <div id="blacklist">
        <div class="toolbar">
            <span v-text="path" class="path"></span>
            <button  
                @click="remove"
                class="lynBtn black"
            >delete</button>
            <Search @submitSearchValue="handleSearch"></Search>
        </div>
        <Table border ref="selection" :columns="col_4" height="600" :data="computedData" @on-selection-change="handleSelectionChange"></Table>

    </div>
</template>
<script>
import { ROUTERS, GET_URL, REQUEST_STATUS, INSTANCE_STATUS } from '../myConfig.js'
import Search from './Search'


export default {
    name: 'Blacklist',
    props: ['tableData','path','updateCurrentPage','submitSearchValue'],
    components: {
        Search,
    },
    data(){
        return {
            col_4: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'Username',
                    key: 'username'
                },
                {
                    title: 'Telephone',
                    key: 'telephone',
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        const removeBtn = h('button', {
                                attrs: {
                                    class: 'lynBtn black smallBtn'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.row.id)
                                    }
                                }
                            }, 'remove')
                        return h('div', [ removeBtn ]) 
                    }
                }
            ],
            selection: [],
        }
    },
    mounted(){
        switch(this.path){
                case ROUTERS.sellerBlacklist: {
                    this.col_4.splice( 1, 1, { title: 'Username',key: 'username' })
                    break
                }
                case ROUTERS.buyerBlacklist: {
                    this.col_4.splice( 1, 1, { title: 'Username',key: 'username' })
                    break
                }
                case ROUTERS.shopBlacklist: {
                    this.col_4.splice( 1, 1, { title: 'Shopame',key: 'shopname' })
                    break
                }
                default: {console.log('no path is found')}
            }
    },
    watch: {
        path(){
            switch(this.path){
                case ROUTERS.sellerBlacklist: {
                    this.col_4.splice( 1, 1, { title: 'Username',key: 'username' })
                    break
                }
                case ROUTERS.buyerBlacklist: {
                    this.col_4.splice( 1, 1, { title: 'Username',key: 'username' })
                    break
                }
                case ROUTERS.shopBlacklist: {
                    this.col_4.splice( 1, 1, { title: 'Shopame',key: 'name' })
                    break
                }
                default: {console.log('no path is found')}
            }
        }
    },
    computed: {
        computedData(){
            let result = []
            let attr = ''
            switch(this.path){
                case ROUTERS.sellerBlacklist: {
                    attr = 'username'
                    break
                }
                case ROUTERS.buyerBlacklist: {
                    attr = 'username'
                    break
                }
                case ROUTERS.shopBlacklist: {
                    attr = 'name'
                    break
                }
                default: {attr = 'username'}
            }

            for(let index of this.tableData.keys()){

                let { id, object } = this.tableData[index]
                result.push({ id, [attr]: object[attr], telephone: object.telephone }) 

            }
            return result
        }
    },
    methods: {
        remove(id){
            if( typeof id !== 'number' && this.selection.length==0) {
                console.log(typeof id)
                this.$Message.warning('no options are selected')
                return 0
            }else if( typeof id !== Number && this.selection.length > 0 ){

                let arr = []
                for(let item of this.selection.values()){
                    console.log(item)
                    let p = this.$axios({ 
                        url: ROUTERS.removeFromBlacklist, 
                        method: 'delete', 
                        params: { id:item.id } 
                        })
                    arr.push(p)
                }
                Promise.all(arr)
                .then( res => {this.$Message.success('remvoe successfully');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed to remove')})               
            }else{
                this.$axios({ 
                    url: ROUTERS.removeFromBlacklist, 
                    method: 'delete', 
                    params: { id: id } 
                    })
                .then( res => {this.$Message.success('remvoe successfully');this.$emit('updateCurrentPage')})
                .catch( err => {this.$Message.error('failed to remove')})
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
        handleSelectionChange(selection){
            this.selection = selection //update options
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
