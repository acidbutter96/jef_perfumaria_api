import * as Yup from 'yup'
import bcrypt from 'bcryptjs'
import Employee from '../models/Employee'

class EmployeeController {
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
        })
    
        if(!(await schema.isValid(req.body))){
          return res.status(400).json({
            error: true,
            code: 101,
            message: 'Error: data structure is wrong, verify your request json'
          })
        }

        var data = req.body
        data.password = await bcrypt.hash(data.password, 8)
        data.totalmonthsale = 0
        data.completedsales = 0

        console.log(data)
        console.log(data.cpf)

        const cpfE = await Employee.findOne({cpf:req.body.cpf})
              .then(()=>{
              }).catch((e)=>{
                return res.json({'iih':e})
              })
        console.log(cpfE)
        if(cpfE){
          return res.status(400).json({
            error: true,
            code: 102,
            message: 'User has already been registered, or something weird happened'
          })
        }

        

        const employee = await Employee.create(data, (err)=>{
          if(err){
            return res.status(400).json({
              error: true,
              code: 103,
              message: 'User has not been registered'
            })
          }
        })

        return res.status(200).json({
          error: false,
          message: 'User has been registered',
          body: employee
        })
        
      }
}

export default new EmployeeController();
