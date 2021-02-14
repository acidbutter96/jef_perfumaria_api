import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Employee from '../models/Employee'
import Owner from '../models/Owner'
import configAuth from '../../config/auth'

class SessionController {
  async create(req, res) {
    const { username, password } = req.body

    const employeeExists = await Employee.findOne(
      {
        username: username
      })

    if (!employeeExists) {
      return res.json({
        error: true,
        code: 110,
        message: 'Usuário não cadastrado'
      })
    }

    if (!(await bcrypt.compare(password, employeeExists.password))) {
      return res.json({
        error: true,
        code: 111,
        message: 'Senha inválida'
      })
    }

    return res.json({
      user: {
        id: employeeExists.id,
        username: employeeExists.username
      },
      token: jwt.sign({ id: employeeExists._id },
        configAuth.secret,
        {
          expiresIn: configAuth.expiresIn
        })
    })
  }

  async createadm(req, res) {
    if (req.params.type == '08fb271e6bfe936ea19875b814b86999') {

      const { username, password } = req.body

      const ownerExists = await Owner.findOne(
        {
          username: username
        })

      if (!ownerExists) {
        return res.json({
          error: true,
          code: 110,
          message: 'Administrador não cadastrado'
        })
      }

      if (!(await bcrypt.compare(password, ownerExists.password))) {
        return res.json({
          error: true,
          code: 111,
          message: 'Senha inválida'
        })
      }

      return res.json({
        user: {
          id: ownerExists.id,
          username: ownerExists.username
        },
        token: jwt.sign({ id: ownerExists._id },
          configAuth.admsecret,
          {
            expiresIn: configAuth.admexpiresIn
          })
      })
    }

    return res.status(404).send()
  }
}

export default new SessionController();
