import { Router } from 'express'
import SessionController from './app/controllers/SessionController'
import EmployeeController from './app/controllers/EmployeeController'
import OwnerController from './app/controllers/OwnerController'

import authMiddleware from './app/middlewares/auth'

// import all controllers
// import SessionController from './app/controllers/SessionController'

const routes = new Router()

// Add routes
routes.post('/v1/employee', EmployeeController.create)
routes.get('/v1/employee/:id', authMiddleware,EmployeeController.show)
routes.get('/v1/employee',authMiddleware,EmployeeController.index)
routes.put('/v1/employee', authMiddleware, EmployeeController.update)

routes.post('/v1/sessions', SessionController.create)
routes.post('/v1/:type/sessions/', SessionController.createadm)

routes.post('/v1/admin/manage',OwnerController.create)


module.exports = routes
