import { Router } from 'express'
import SessionController from './app/controllers/SessionController'
import EmployeeController from './app/controllers/EmployeeController'
import SaleController from './app/controllers/SaleController'
import ProductController from './app/controllers/ProductController'
import OwnerController from './app/controllers/OwnerController'

import authMiddleware from './app/middlewares/auth'
import authMiddlewareOwner from './app/middlewares/authowner'

// import all controllers
// import SessionController from './app/controllers/SessionController'

const routes = new Router()

// Add routes
routes.post('/v1/employee', EmployeeController.create)
routes.get('/v1/employee/:id', authMiddleware,EmployeeController.show)

routes.post('/v1/sale',authMiddleware,SaleController.create)

routes.get('/v1/products',ProductController.index)

routes.post('/v1/sessions', SessionController.create)
routes.post('/v1/:type/sessions/', SessionController.createadm)

routes.post('/v1/admin/manage',OwnerController.create)

routes.get('/v1/employee',authMiddlewareOwner,EmployeeController.index)
routes.put('/v1/employee', authMiddlewareOwner, EmployeeController.update)

routes.post('/v1/product',authMiddlewareOwner,ProductController.create)


module.exports = routes
