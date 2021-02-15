import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const Owner = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ownergrade: {
        type: Number,
        required: true
    }

},{
    timestamps: true
})

Owner.plugin(mongoosePaginate)

export default new mongoose.model('owner',Owner)