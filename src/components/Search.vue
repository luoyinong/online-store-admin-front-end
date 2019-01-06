<template>
    <div class="searchForm">
        <Input v-model="searchValue" placeholder="Search something..." clearable style="width: 200px" />
        <Button type="warning" style="width: 80px" @click="handleSearch">search</Button>
    </div>
</template>

<script>
export default {
    name: 'Search',
    props: ['submitSearchValue'],
    data(){
        return {
            searchValue: '',
        }
    },
    methods: {
        handleSearch(){
            if(this.searchValue === ''){
                alert('you should enter something')
                return 0
            }
            this.$emit('submitSearchValue',this.searchValue)
        }
    }
}
</script>

<style scoped>
.searchForm{
    float: right;
    margin-right: 40px;
}
</style>
