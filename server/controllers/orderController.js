const { Order, OrderProduct, BasketProduct, Product, ProductSizes} = require("../models/models")

class OrderController {
    // ------ CRUD корзины ------ //

    async addOrder(req, res, next) {
        let newOrder = {
            userId: req.body.id,
            phone: req.body.phone,
            postcode: req.body.postcode,
            addressee: req.body.addressee
        };

        const basket = await BasketProduct.findAll({ where: { basketId: req.body.id } });

        if (basket.length >= 1) {
            const order = await Order.create(newOrder);

            for (let i = 0; i < basket.length; i++) {
                const basketItem = basket[i];

                await OrderProduct.create({
                    orderId: order.id,
                    productId: basketItem.productId,
                    basketId: basketItem.id,
                    productSizeId: basketItem.productSizeId,
                    sizeName: basketItem.sizeName,
                });

                const productSize = await ProductSizes.findOne({ where: { id: basketItem.productSizeId } });
                if (productSize) {
                    if (productSize.quantity > 0) {
                        productSize.quantity -= 1;
                        await productSize.save();
                    } else {
                        return res.status(400).json({ message: "Product is out of stock" });
                    }
                }
            }

            await BasketProduct.destroy({ where: { basketId: req.body.id } });

            res.status(201).json(order);
        } else {
            res.status(404).json({ message: "No devices in the basket" });
        }
    }
    async getAll(req,res){
        const order = await Order.findAll()
        return res.json(order)
    }

    async getUserOrder(req,res){
        const {id} = req.params
        const date = await Order.findAll({where: {userId: id}} )
        return res.json(date)
    }
    async getUserOrderList(req,res){
        const {id} = req.params
        const date = await Order.findOne( {where: {id: id}})
        const a =  await OrderProduct.findAll({include: {
                model: Product,
                include: {model: ProductSizes, as: 'size'},
            }, where: {orderId: id}});
        return res.json(a)
    }
    async updateUserOrder(req, res) {
        const {id} = req.params;
        const {status} = req.body;
        const updatedOrder = await Order.update({ status: status }, { where: { id: id } });
        return res.json(updatedOrder);
    }
}

module.exports = new OrderController()
