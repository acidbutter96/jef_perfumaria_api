import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const Product = new mongoose.Product({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    storage:{
        type: Number,
        required: true
    }
},{
    timestamps: true
})

Product.plugin(mongoosePaginate)

export default new mongoose.model('product',Product)