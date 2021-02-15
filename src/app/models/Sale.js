import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const Sale = new mongoose.Schema({
    vendorid:{
        type: String,
        required: true
    },
    value:{
        type: Number,
        required: true
    },
    salejson: {
        type:Object,
        required: true
    }
},{
    timestamps:true
})

Sale.plugin(mongoosePaginate)

export default new mongoose.model('sale',Sale)