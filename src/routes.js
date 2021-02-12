import { Router } from 'express'
import SessionController from './app/controllers/SessionController'
import EmployeeController from './app/controllers/EmployeeController'

// import all controllers
// import SessionController from './app/controllers/SessionController'

const routes = new Router()

// Add routes
routes.post('/v1/employee', EmployeeController.create)
// routes.post('/', SessionController.store)
// routes.put('/', SessionController.store)
// routes.delete('/', SessionController.store)

module.exports = routes
