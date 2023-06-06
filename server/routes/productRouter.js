const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), productController.create)
router.get('/', productController.getAll)
router.get('/:id', productController.getOne)
router.post('/update/:id',checkRole('ADMIN'), productController.updated)
router.post('/del/:id',checkRole('ADMIN'), productController.delOne)
router.get('/:id/similar', productController.getSimilarProducts);
router.get('/inventory', productController.getAllForInventory)
router.post('/status', productController.updateProductStatus)
router.post('/:productId/size/:sizeId', productController.updateProductSize)

module.exports = router