import express from 'express'
import routes from './routes'
import cors from 'cors'

import './config/connect'

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(express.json())

    this.app.use((req,res,next)=>{
      res.header('Access-Control-Allow-Origin','*')
      res.header('Access-Controll-Allow-Methods','GET, PUT, POST, DELETE')
      res.header('Access-Controll-Allow-Headers','X-PINGOTHER, Content-Type')
      next()
    })
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app