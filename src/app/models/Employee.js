import { Int32 } from 'bson'
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const Employee = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    lastlogin:{
        type: Date,
        required: false
    },
    totalmonthsale:{
        type: Number,
        required: true
    },
    completedsales:{
        type: Number,
        required: true
    },
},{
    timestamps: true,
})

Employee.plugin(mongoosePaginate)

export default mongoose.model('employee',Employee)