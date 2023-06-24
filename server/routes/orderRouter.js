const Router = require('express')
const router = new Router()
const orderController = require("../controllers/orderController")
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/', orderController.addOrder)
router.get('/', checkRole('MANAGER'), orderController.getAll)
router.get('/user/:id',  orderController.getUserOrder)
router.put('/user/update/:id', checkRole('MANAGER'), orderController.updateUserOrder)
router.get('/:id', orderController.getUserOrderList)




module.exports = router
