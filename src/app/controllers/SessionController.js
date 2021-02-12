import * as Yup from 'yup'
import bcrypt from 'bcryptjs'
import Employee from '../models/Employee'

class SessionController {
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
          .required(),
      email: Yup.string()
          .email()
          .required(),
      password: Yup.string()
          .required()
          .min(6),
      cpf: Yup.string()
          .required()
          .min(11)
          .max(11),
      lastlogin: Yup.date(),
      completedsales: Yup.number()
    })

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({
        error: true,
        code: 101,
        message: 'Error: data structure is wrong, verify your request json'
      })
    }
    
  }
}

export default new SessionController();
