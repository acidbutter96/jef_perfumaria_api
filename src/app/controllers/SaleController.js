import * as Yup from 'yup'
import Sale from '../models/Sale'
import Employee from '../models/Employee'
import { response } from 'express'

class SaleController {
    async create(req, res) {
        const schema = Yup.object().shape(
            {
                vendorid: Yup.string()
                    .required(),
                value: Yup.number()
                    .required(),
                salejson: Yup.string()
                    .required()
            }
        )
        var data = req.body

        if (!(await schema.isValid(data))) {
            return res.status(400).json({
                error: true,
                code: 101,
                message: 'Error: data structure is wrong, verify your request json'
            })
        }

        const vendorExists = await Employee.findOne({ _id: data.vendorid }).catch((err) => {
            return res.status(400).json({
                finished: false,
                error: true,
                code: 301,
                message: 'Vendedor não encontrado'
            })
            console.log(err)
        })

        if (vendorExists.status) {
            const total = vendorExists.completedsales + data.value
            const month = vendorExists.totalmonthsale + data.value
            /* const ctotal = vendorExists.completedsales - data.value
            const cmonth = vendorExists.totalmonthsale - data.value */

            const sale = await Sale.create(data).then((sale) => {
                return res.json({
                    finished: true,
                    sale
                })
            }).catch((err) => {
                return res.status(400).json({
                    error: true,
                    code: 117,
                    message: err
                })
            })
            if (sale) {
                await Employee.updateOne({ _id: vendorExists._id }, {
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

    async show(req,res){
        const _id = req.params.id
        const sale = Sale.findOne({_id})
        return res.json(sale)
    }

    async index(req,res){
        const {page =1 } = req.query
        const {limit =20 } = req.query

        //const sale = await Sale.
        return res.json(req.body)
    }

    async indexof(req,res){
        return res.json(req.params.id)
    }

    
}

export default new SaleController()