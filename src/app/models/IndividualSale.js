import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const IndividualSale = new mongoose.Schema({
    saleid: {
        type: String,
        required: true
    },
    itemid: {
        type: String,
        required: true
    },
    vendorid:{
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    cancelled: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
})

IndividualSale.plugin(mongoosePaginate)

export default new mongoose.model('individualsale',IndividualSale)