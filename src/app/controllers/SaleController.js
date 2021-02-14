import * as Yup from 'yup'
import Sale from '../models/Sale'
import Employee from '../models/Employee'

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

        const vendorExists = await Employee.findById(data.vendorid)

        if (vendorExists) {
            const total = vendorExists.completedsales + data.value
            const month = vendorExists.totalmonthsale + data.value

            await Employee.updateOne({ _id: vendorExists._id }, {
                completedsales: total,
                totalmonthsale: month
            }, (err) => {
                if (err) {
                    return res.status(400).json({
                        error: true,
                        code: 117,
                        message: err
                    })
                }
            })

            return res.json({ finished: true })
            //return res.json(vendorExists.totalmonthsale+data.value)
        }

        return res.json(vendorExists)




    }
}

export default new SaleController()