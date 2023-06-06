const { Product, BasketProduct, Basket, ProductSizes} = require("../models/models")

class BasketController {
    // ------ CRUD корзины ------ //

    async addToBasket(req,res,next){
        const user = req.user
        const { productId, productSizeId} = req.body
        const sizeNames = await ProductSizes.findByPk(productSizeId)
        const size = await ProductSizes.findByPk(productSizeId)
        if (!size) {
            return res.status(400).json({message: 'Size is required'})
        }
        // создайте новую запись BasketProduct с использованием размера продукта
        const basket = await BasketProduct.create({
            basketId: user.id,
            productId: productId,
            productSizeId: size.id, // сохраняем ID размера продукта
            sizeName: sizeNames.size, // сохраняем размер
        })
// console.log(size.sizeName)

        return res.json(basket)
    }

    async getBasketUser(req,res){
        const {id} = req.user
        const basket = await BasketProduct.findAll({ include: {
                model: Product,
                include: {model: ProductSizes, as: 'size'},
            }, where: {basketId: id}})
        //console.log(basket)

        if(!basket) res.status(400).json('None Id')
        return res.json(basket)
    }



    async deleteBasket (req, res) {
        const {id} = req.body
        if(!id) res.status(400).json('None Id')
        await BasketProduct.destroy({where: {id: id}})
        res.status(200).json('Product deleted')
    }

}

module.exports = new BasketController()