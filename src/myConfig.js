/* eslint-disable */

const ROOT_URL = 'http://39.98.165.19:8080/admin/'

const PAGE_SIZE = {
    large: 10,
    mid: 6,
    small: 3,
    test: 1,
}

const ROUTERS = {
    applyingRequest: 'seller/request/applying',
    aprrovedRequest: 'seller/request/approved',
    rejectedRequest: 'seller/request/rejected',
    adApplying: 'ad/applying',
    adApproved: 'ad/approved',
    adRejected: 'ad/rejected',
    shopBlacklist: 'blacklist/shop',
    sellerBlacklist: 'blacklist/seller',
    buyerBlacklist: 'blacklist/buyer',
    handleRequest: 'seller/request/deal',
    handleAdvertisement: 'ad/request/approval',
    deleteRequest: 'seller/request/delete',
    deleteShop: 'seller/shop/delete',
    deleteSeller: 'seller/delete',
    deleteBuyer: 'customer/delete',
    blackSomething: 'seller/blacklist/add',
    removeFromBlacklist: 'seller/blacklist/remove',
    changeCommissionRate: 'commission/add',
    backupDatabase: 'db/backup',
    requestAmount: 'seller/request/amount',
    shopAmount: 'seller/shop/amount',
    sellerAmount: 'seller/amount',
    buyerAmount: 'customer/amount',
    ordersAmount: 'order/amount',
    adRequestAmount: 'ad/request/amount',
    blacklistAmount: 'seller/blacklist/amount',
    listRequest: 'seller/request/list',
    listShop: 'seller/shop/list',
    listSeller: 'seller/list',
    listBuyer: 'customer/list',
    listAdRequest: 'ad/request/list',
    listBlacklist: 'seller/blacklist/list',
    orders: 'order/findOrders',
    totalIncome: 'sales/total',
    partlyIncome: 'sales/partly',
    commissionRate: 'commission/findLast',
    SearchForShop: 'seller/search/shopname',
    SearchForSeller: 'seller/search/sellername',
    SearchForBuyer: 'customer/search/name',
    searchForOrder: 'order/search'
}

const REQUEST_STATUS = {
    applying: {status: 0},
    approved: {status: 1},
    rejected: {status: 2}
}


const INSTANCE_STATUS = {
    seller: 0,
    shop: 1,
    buyer: 2,
    ad: 3,
}

const TYPE = {
    request: Symbol('request'),
    blacklist: Symbol('blacklist'),
    seller: Symbol('seller'),
    buyer: Symbol('buyer'),
    shop: Symbol('shop'),
    default: Symbol('default'),
    adRequest: Symbol('adRequest')
}

function GET_URL(path){ //得到url
    return ROOT_URL+path
}

export {
    ROOT_URL,
    PAGE_SIZE,
    ROUTERS,
    REQUEST_STATUS,
    INSTANCE_STATUS,
    GET_URL,
    TYPE
}