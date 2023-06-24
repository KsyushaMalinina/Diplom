import {makeAutoObservable} from "mobx";

export default class ProductStore{
    constructor() {
        this._types = []
        this._products = []
        this._baskets = []
        this._orders = []
        this._orders_lists = []
        this._selectedType = []
        this._selectedProduct = []
        this._selectedOrder = 0
        this._page = 1
        this._totalCount = 0
        this._limit = 6
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    setProducts(products) {
        this._products = products
    }

    setBaskets(basket){
        this._baskets = basket
    }

    setOrders(order){
        this._orders = order
    }
    setOrdersList(order){
        this._orders_lists = order
    }

    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type

    }

    setSelectedProduct(product) {
        this._selectedProduct = product
    }
    setSelectedOrder(order) {
        this._selectedOrder = order
    }

    setPage(page) {
        this._page = page

    }

    setTotalCount(count) {
        this._totalCount = count

    }
    get types() {
        return this._types
    }
    get products() {
        return this._products
    }


    get basket() {
        return this._baskets
    }

    get order() {
        return this._orders
    }

    get selectedType() {
        return this._selectedType
    }

    get selectedOrder() {

        return this._selectedOrder
    }
    get acceptedProducts() {
        return this._products.filter(product => product.accepted);
    }


    get page() {
        return this._page
    }
    get totalCount() {
        return this._totalCount
    }
    get limit() {
        return this._limit
    }
}
