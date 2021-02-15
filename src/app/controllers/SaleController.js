import * as Yup from 'yup'
import Sale from '../models/Sale'
import IndividualSale from '../models/IndividualSale'
import Employee from '../models/Employee'
import { response } from 'express'
import Product from '../models/Product'

class SaleController {
    async create(req, res) {
        const schema = Yup.object().shape(
            {
                vendorid: Yup.string()
                    .required(),
                salejson: Yup.object()
                    .required()
            }
        )

        var data = req.body
        data.value = 0

        if (!(await schema.isValid(data))) {
            return res.status(400).json({
                error: true,
                code: 101,
                message: 'Error: data structure is wrong, verify your request json'
            })
        }

        //verificar se vendedor está cadastrado e apto para realizar vendas

        const vendorExists = await Employee.findOne({ _id: data.vendorid }).catch((err) => {
            return res.status(400).json({
                finished: false,
                error: true,
                code: 301,
                message: 'Vendedor não encontrado'
            })
        })

        //vendedor ativo segue =>

        if (vendorExists.status) {
            const total = vendorExists.completedsales + data.value
            const month = vendorExists.totalmonthsale + data.value
            const sale = await Sale.create(data)
            
            
            if (sale) {
                //recuperar preço e estoque dos produtos pelo id
                const product = await Product.find({})
                var items = [{},{}]

                product.map((item)=>{
                    items[0][item._id] = item.price
                    items[1][item._id] = item.storage
                })

                //return res.json(items)
                data.salejson.roll.map(async (obj) => {
                    obj.saleid = sale._id
                    obj.cancelled = false
                    obj.vendorid = vendorExists._id
                    obj.value = items[0][obj.itemid] * obj.amount
                    
                    data.value = data.value+ obj.value

                    const storage = items[1][obj.itemid] - obj.amount
                    if(storage<0){
                        return res.status(400).json({
                            error: true,
                            code:606,
                            status: 'Verifique o estoque'
                        })
                    }
                                       
                    const productquery = await Product.updateOne({ _id: obj.itemid }, { storage })
                })

                const upsale = await Sale.updateOne({_id:sale._id},{value:data.value})

                const individualsale = await IndividualSale.create(data.salejson.roll)

                if (individualsale && upsale) {

                    const employee = await Employee.updateOne({ _id: vendorExists._id }, {
                        completedsales: total,
                        totalmonthsale: month
                    }, async (err) => {

                        if (err) {
                            return res.status(400).json({
                                error: true,
                                code: 117,
                                message: err
                            })
                        }
                    })

                    return res.json({
                        error: false,
                        message: 'Venda concluída',
                        saleid: individualsale[0].saleid
                    })
                }
            } else {
                return res.status(400).json({
                    error: true,
                    code: 303,
                    message: 'Vendedor desativado, consulte administrador do sistema.'
                })
            }


            //return res.json(vendorExists.totalmonthsale+data.value)
        }

        return res.status(400).json({
            error: true,
            code: 302,
            message: 'Vendedor desativado, consulte administrador do sistema.'
        })

        //return res.json(vendorExists)
    }

    async show(req, res) {
        const _id = req.params.id
        const sale = Sale.findOne({ _id })
        return res.json(sale)
    }

    async index(req, res) {
        const { page = 1 } = req.query
        const { limit = 20 } = req.query

        //const sale = await Sale.
        return res.json(req.body)
    }

    async indexof(req, res) {
        return res.json(req.params.id)
    }


}

export default new SaleController()