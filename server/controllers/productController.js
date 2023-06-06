const uuid = require('uuid')
const path = require('path');
const {Product, ProductInfo, Color, Size, ProductSizes} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require("sequelize");
class ProductController {



    async create(req, res, next) {
        try{
            let {name, price, typeId, info, amount,  size} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({
                name,
                price,
                typeId,
                img: fileName,
                amount,
            });

           if(size){
               size = JSON.parse(size)
               size.forEach(sizes =>
               ProductSizes.create({
                   size: sizes.size,
                   quantity: sizes.quantity,
                   productId: product.id
               }))
           }
            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })

                )
            }
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    // async setDescription(req, res, next) {
    //     try {
    //         let {_id,text} = req.body
    //         const product = await Product.update(
    //             {_info: text},
    //             {where: {id: _id}}
    //         );
    //         return res.json(product)
    //     } catch (e) {
    //         next(ApiError.badRequest(e.message))
    //     }
    // }

    async getSimilarProducts(req, res) {
        try {
            const productId = req.params.id
            if (!productId) {
                return res.status(400).json({ message: 'Не передан параметр "id"' })
            }
            const product = await Product.findByPk(productId)

            if (!product) {
                return res.status(404).json({ message: 'Товар не найден' })
            }
            const products = await Product.findAll({
                where: {
                    typeId: product.typeId,
                    id: {
                        [Op.ne]: productId
                    }
                },
                limit: 4
            })
            console.log(products);
            return res.json(products)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Ошибка на сервере' })
        }
    }
    async getAll(req, res) {
        let {typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 5
        let  offset = page * limit - limit
        let products;
        if (!typeId) {
            products = await Product.findAndCountAll({
                limit, offset,  include: { model: ProductSizes, as: 'size' }
            })
        }
        if (typeId){
            products = await Product.findAndCountAll({where: {typeId}, limit, offset,
                include: { model: ProductSizes, as: 'size' }
            })
        }
        return res.json(products)
    }



    async getOne(req, res, next) {
        const {id} = req.params;
        const product = await Product.findOne({
            where: {id: id},
            include: [{model: ProductInfo, as: 'info'},
                {model: ProductSizes, as: 'size'}]
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json(product);
    }
    //  async delOne(req, res) {
    //     const {id} = req.params
    //     const product = await Product.update(
    //         {amount: '0'},
    //         {where: {id: id}}
    //     )
    //     return res.json(product)
    // }
    async delOne(req, res) {
        const { id } = req.params;
        await Product.destroy({ where: { id: id } });
        return res.sendStatus(200);
    }

    async updated(req, res) {
        const {_id,_amount} = req.body
        const product = await Product.update(
            {amount: _amount},
            {where: {id: _id}}
        )
        return res.json(product)
    }

    async getAllForInventory(req, res) {
        try {
            const { status } = req.query;
            const products = await Product.findAll({ where: { accepted: status === 'accepted' } });
            return res.json(products);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async updateProductStatus(req, res, next) {
        try {
            const { productId, accepted } = req.body;
            const updatedProduct = await Product.update(
                { accepted: accepted },
                { where: { id: productId } }
            );

            if (updatedProduct[0] === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            return res.json(updatedProduct);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async updateProductSize(req, res, next) {
        try {
            const { productId, sizeId } = req.params;
            const { quantity } = req.body;

            const productSize = await ProductSizes.findOne({
                where: { id: sizeId, productId: productId },
            });

            if (!productSize) {
                return res.status(404).json({ error: 'ProductSize not found' });

            }

            productSize.quantity = quantity;
            await productSize.save();

            return res.json({ message: 'Product size updated successfully' });
        } catch (error) {
            return res.status(404).json({ error: 'Failed' });

        }
    }

}


module.exports = new ProductController()