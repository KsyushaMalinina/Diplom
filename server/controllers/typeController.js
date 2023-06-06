const {Type, Product} =require('../models/models')
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res) {
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)

    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }

    async delete(req, res) {
        const { id } = req.params;

        try {
            // Удаление связанных товаров
            await Product.destroy({
                where: { typeId: id }
            });

            // Удаление типа
            await Type.destroy({
                where: { id }
            });

            res.json({ message: 'Тип и связанные товары успешно удалены' });
        } catch (error) {
            console.error('Ошибка при удалении типа и связанных товаров', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}

module.exports = new TypeController()