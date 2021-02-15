import * as Yup from 'yup'
import bcrypt from 'bcryptjs'
import Owner from '../models/Owner'

class OwnerController {
    async create(req, res) {
        const schema = Yup.object().shape({
            username: Yup.string()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
            email: Yup.string()
                .required()
                .email(),
            ownergrade: Yup.number()
                .required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: true,
                code: 101,
                message: 'Error: data structure is wrong, verify your request json'
            })
        }

        var data = req.body
        const usernameExists = await Owner.findOne({ username: data.username })

        if (usernameExists) {
            return res.status(400).json({
                error: true,
                code: 102,
                message: `Erro: administrador, ${usernameExists.username} já cadastrado.`
            })
        }

        const emailExists = await Owner.findOne({
            email: data.email
        })

        data.password = await bcrypt.hash(data.password,8)

        if(emailExists){
            res.status(400).json({
                error: true,
                code: 104,
                message: `Erro: username já está sendo utilizado por outro administrador.`
              })
        }

        await Owner.create(data).then((created)=>{
            return res.json({
                error: false,
                data: created
            }).catch((err)=>{
                return res.status(400).json({
                    error: true,
                    code:104,
                    message: 'Usuário não foi criado'
                })
            })
        })
    }
}

export default new OwnerController()