import * as Yup from 'yup'
import Product from '../models/Product'

class ProductController{
    async create(req,res){
        return  res.json(req.body)
    }
}

export default new ProductController()