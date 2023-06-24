const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), productController.create)
router.get('/', productController.getAll)
router.get('/:id', productController.getOne)
router.put('/update/:id',checkRole('ADMIN'), productController.updated)
router.delete('/del/:id',checkRole('ADMIN'), productController.delOne)
router.get('/:id/similar', productController.getSimilarProducts);
router.get('/inventory', productController.getAllForInventory)
router.put('/status', productController.updateProductStatus)
router.put('/:productId/size/:sizeId', productController.updateProductSize)

module.exports = router
