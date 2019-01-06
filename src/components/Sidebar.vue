<template>
    <div id="sidebar">
        <Menu 
            :theme="theme2" 
            class="content" 
            :accordion="true" 
            @on-select="handleMenuItemClick" 
            :active-name="routers.listSeller" 
            :open-names="['1']"
        >
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-person" />
                    seller
                </template>
                <MenuItem :name="routers.listSeller">user</MenuItem>
                <MenuItem :name="routers.listShop">shop</MenuItem>
                <Submenu name="1-1">
                    <template slot="title">
                        shop request
                    </template>
                    <MenuItem :name="routers.applyingRequest">applying</MenuItem>
                    <MenuItem :name="routers.aprrovedRequest">approved</MenuItem>
                    <MenuItem :name="routers.rejectedRequest">rejected</MenuItem>
                </Submenu>
                <Submenu name="1-2">
                    <template slot="title">
                        ad request
                    </template>
                    <MenuItem :name="routers.adApplying">applying</MenuItem>
                    <MenuItem :name="routers.adApproved">approved</MenuItem>
                    <MenuItem :name="routers.adRejected">rejected</MenuItem>
                </Submenu>
            </Submenu>
            <MenuItem :name="routers.listBuyer"><Icon type="ios-people" />buyer</MenuItem>
            <Submenu name="3">
                <template slot="title">
                    <Icon type="ios-book" />
                    blacklist
                </template>
                <MenuItem :name="routers.sellerBlacklist">seller</MenuItem>
                <MenuItem :name="routers.buyerBlacklist">buyer</MenuItem>
                <MenuItem :name="routers.shopBlacklist">shop</MenuItem>
            </Submenu>
            <MenuItem :name="routers.commissionRate"><Icon type="logo-usd" />transaction</MenuItem>
            <MenuItem :name="routers.orders"><Icon type="ios-paper" />orders</MenuItem>

        </Menu>
    </div>
</template>
<script>
    import { ROUTERS } from '../myConfig.js'

    export default {
        name: "Sidebar",
        data () {
            let data = JSON.parse(JSON.stringify(ROUTERS))//避免改变config的值
            return {
                theme2: 'dark',
                routers: data
            }
        },
        mounted:function(){
            this.handleMenuItemClick(this.routers.listSeller)
        },
        methods: {
            handleMenuItemClick(name){
                this.$emit('changePath',name)
            }
        }
    }
</script>

<style scoped>
@keyframes slideToBottom {
    from{
        transform: translate(0,0);
    }
    to{
        transform: translate(0,100%);
    }
}
    #sidebar{
        display: inline-block;
        width: 240px;
        height: 100%;
        background: transparent;        
        position: fixed;
        top: 0;
        left: 0;
        /* animation: slideToBottom 1.2s linear 2.6s forwards; */
        z-index: 9;
    }
    .content{
        background: transparent;
        margin-top: 70px;
    }
</style>
