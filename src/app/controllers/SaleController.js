import * as Yup from 'yup'
import Sale from '../models/Sale'

class SaleController{
    async create(req,res){
        return res.json(req.body)
    }
}

export default new SaleController()