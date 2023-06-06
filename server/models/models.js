const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},

    })

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: {type: DataTypes.STRING,  allowNull: false},
    postcode: {type: DataTypes.STRING, allowNull: false},
    addressee: {type: DataTypes.STRING, allowNull: false},
    status:{type: DataTypes.INTEGER, defaultValue: 1}
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
})

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    sizeName: {type: DataTypes.STRING, allowNull: false}
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING,unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    amount:{type: DataTypes.INTEGER, allowNull: false},
    accepted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
})


const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})


const ProductInfo = sequelize.define('product-info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})


const ProductSizes = sequelize.define('productSizes', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    size: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
})

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    sizeName: {type: DataTypes.STRING, allowNull: false}
})


User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

// Order.hasOne(User);
// User.belongsTo(Order);

Type.hasMany(Product)
Product.belongsTo(Type)



Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

Product.hasMany(ProductInfo, {as: 'info'})
ProductInfo.belongsTo(Product)

Product.hasMany(ProductSizes, {as: 'size'})
ProductSizes.belongsTo(Product);




Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

BasketProduct.belongsTo(ProductSizes);
OrderProduct.belongsTo(ProductSizes);

module.exports = {
    User,
    Basket,
    BasketProduct,
    Product,
    Type,
    ProductInfo,
    ProductSizes,
    Order,
    OrderProduct,
}