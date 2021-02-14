import * as Yup from 'yup'
import bcrypt from 'bcryptjs'
import Employee from '../models/Employee'
import { cpf } from 'cpf-cnpj-validator'

class EmployeeController {
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required(),
      username: Yup.string()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      cpf: Yup.string()
        .required()
        .min(11)
        .max(11),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        code: 101,
        message: 'Error: data structure is wrong, verify your request json'
      })
    }

    var data = req.body
    const cpfExists = await Employee.findOne({ cpf: data.cpf })

    if (cpfExists) {
      return res.status(400).json({
        error: true,
        code: 102,
        message: `Erro: colaborador, ${cpfExists.name} já cadastrado.`
      })
    }

    if (!cpf.isValid(data.cpf)) {
      return res.status(400).json({
        error: true,
        code: 103,
        message: `Erro: cpf, ${cpf.format(data.cpf)} é inválido.`
      })
    }

    const userNameExists = await Employee.findOne({
      username: data.username
    })

    if (userNameExists) {
      return res.status(400).json({
        error: true,
        code: 104,
        message: `Erro: username já está sendo utilizado por outro colaborador.`
      })
    }

    data.totalmonthsale = 0
    data.completedsales = 0
    data.status = true
    data.type = 10
    data.password = await bcrypt.hash(data.password, 8)

    const employee = await Employee.create(req.body)

    return res.status(200).json({
      error: false,
      message: 'Usuário cadastrado com sucesso',
      body: employee
    })
  }

  async show(req, res) {
    await Employee.findOne({ _id: req.params.id }).then((employee) => {
      return res.json({
        error: false,
        data: employee
      })
    }).catch((err) => {
      return res.status(400).json({
        error: true,
        code: 110,
        message: 'Nenhum colaborador foi retornado'
      })
    })
  }

  async index(req, res) {
    const { page = 1 } = req.query
    const { limit = 40 } = req.query

    await Employee.paginate({},
      {
        select: '_id name username cpf totalmonthsale completedsales status type createdAt updatedAt',
        page,
        limit
      }).then((employees) => {
        return res.json({
          error: false,
          employees
        })
      }).catch((err) => {
        return res.status(400).json({
          error: true,
          code: 111,
          message: `Não foi possível processar a solicitação.\nError: ${err}`
        })
      })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      _id: Yup.string()
        .required(),
      username: Yup.string(),
      password: Yup.string()
        .min(6),
      type: Yup.number(),
      oldpassword: Yup.string()
        .min(6)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        code: 112,
        message: 'Verifique os dados informados'
      })
    }

    const { _id, username, password, type, oldpassword } = req.body

    const employeeExists = await Employee.findOne({
      _id: _id
    })

    if (!employeeExists) {
      return res.status(400).json({
        error: true,
        code: 113,
        message: 'Colaborador não encontrado'
      })
    }

    var data = {}

    if(type){
      data.type = type
    }

    if (username) {
      if ((await Employee.findOne({ username: username }))) {
        return res.status(400).json({
          error: true,
          code: 114,
          message: 'Username já está sendo utilizado'
        })
      }
      data.username = username
    }

    if (password) {
      const passCheck = await Employee.findOne({ _id: _id })
      if (oldpassword) {
        if (!(await bcrypt.compare(oldpassword, passCheck.password))) {
          return res.status(403).json({
            error: true,
            code: 115,
            message: 'Senha antiga incorreta'
          })
        }
      } else {
        return res.status(403).json({
          error: true,
          code: 116,
          message: 'Informe a senha antiga'
        })
      }

      data.password = await bcrypt.hash(password, 8)
    }

    await Employee.updateOne({ _id: _id }, data, (err) => {
      if (err) {
        return res.status(400).json({
          error: true,
          code: 117,
          message: 'Edição não concluída'
        })
      }

      return res.json({
        error: false,
        message: 'Colaborador editado com sucesso'
      })
    })

    return res.json({ data })

  }

  async delete(req, res) {
    return res.json(req.body)
  }
}

export default new EmployeeController();
