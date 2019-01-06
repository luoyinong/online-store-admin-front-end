<template>
    <div id="navigation">
        <div class="blank"></div>
        <img src="../../static/img/logo.png" class="logo"/>
        <div class="user">
            <Dropdown @on-click="handleUserOperation" trigger="click">
                <a href="javascript:void(0)" class="username">
                {{adminName}}
                <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                        <DropdownItem name="backup">backup database</DropdownItem>
                        <DropdownItem name="password">change password</DropdownItem>
                        <DropdownItem name="quit">quit</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
import { ROUTERS, GET_URL } from '../myConfig.js'
import { Input } from 'iview'

export default {
    name: "Navigation",
    props: ["adminName"],
    data(){
        return {
            searchValue: '',
            oldPsd: '',
            newPsd: '',
        }
    },
    methods: {
        handleSearch(){
            if(!this.searchValue.trim()){
                this.$Message.warning('no value to search')
                return 0
            }
            this.$emit('searchListener',this.searchValue)
        },
        handleUserOperation(value){
            console.log(value)
            switch(value){
                case 'quit': {this.$emit('quit'); break;}
                case 'password': {
                    this.$Modal.confirm({
                        render(h){
                            let oldPsdInput = h('Input', {
                                props: {
                                        value: this.oldPsd,
                                        autofocus: true,
                                        placeholder: 'Please enter your old password'
                                },
                                style: {
                                    marginBottom: '15px'
                                },
                                on: {
                                    input: (val) => {
                                        this.oldPsd = val;
                                    }
                                }
                            })
                            let newPsdInput = h('Input', {
                                props: {
                                        value: this.newPsd,
                                        placeholder: 'Please enter your new password'
                                },
                                on: {
                                    input: (val) => {
                                        this.newPsd = val;
                                    }
                                }
                            })
                            return h('div', [ oldPsdInput, newPsdInput ])
                        },
                        onOk(){
                            this.axios.post( 'http://39.98.165.19:8080/change/password', { before: this.oldPsd, after: this.newPsd })
                            .then( res => {
                                this.$Message.success('change password successfully')
                            })
                            .catch( err => {
                                this.$Message.error('failed')
                                console.log(err.response)
                            })
                        }
                    })
                    break
                }
                case 'backup': {
                    this.$axios({ url: ROUTERS.backupDatabase, method: 'post'})
                    .then( res => this.$Message.success('backup datase successfuly'))
                    .catch( err => this.$Message.error('there is something wrong with backup'))
                    break
                }
                default: alert(value)
            }
        }
    }
}
</script>

<style scoped>
@keyframes slideToRight{
    from{
        transform: translate(-100%);
    }
    to{
        transform: translate(0)
    }
}
    #navigation{
        width: 100%;
        min-width: 900px;
        height: 70px;
        padding: 15px 0;
        background-image: url('../../static/img/nav.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center; 
        box-shadow: 0 3px 3px rgb(49, 49, 49);
        position: fixed;
        top: 0;
        left: 0;
        /* animation: slideToRight 1.2s linear; */
        z-index: 10;
    }
    .logo{
        width:200px
    }
    .username{
        font-size: 27px;
        text-shadow: 0 0 1px rgb(24, 24, 24);
        color: rgb(195, 176, 145);
        
    }
    .blank{
        display: inline-block;
        width: 40px;
    }
    .searchForm{
        display: inline-block;
        margin-left: 200px;
    }
    .user{
        float: right;
        margin-right: 30px;
    }
</style>
