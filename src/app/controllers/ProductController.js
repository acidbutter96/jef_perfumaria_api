import * as Yup from 'yup'
import Product from '../models/Product'

class ProductController {
    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string()
                .required(),
            price: Yup.number()
                .required(),
            storage: Yup.number()
                .required()
        })

        var data = req.body

        if (!(await schema.isValid(data))) {
            return res.status(400).json({
                error: true,
                code: 101,
                message: 'Error: data structure is wrong, verify your request json'
            })
        }

        const nameExists = await Product.findOne({
            name: data.name
        })

        if (nameExists) {
            return res.status(400).json({
                error: true,
                code: 102,
                message: `Erro: produto já está cadastrado. id: ${nameExists._id}.`
            })
        }

        const product = await Product.create(data)

        return res.status(200).json({
            error: false,
            message: 'Produto cadastrado com sucesso',
            body: product
        })
    }

    async index(req, res) {
        const { page = 1 } = req.query
        const { limit = 40 } = req.query

        await Product.paginate({},{
            select: '_id name price storage updatedAt',
            page,
            limit
        }).then((products)=>{
            return res.json({
                error: false,
                products
              })
        }).catch((err)=>{
            return res.status(400).json({
                error: true,
                code: 111,
                message: `Não foi possível processar a solicitação.\nError: ${err}`
              })
        })
    }
}

export default new ProductController()