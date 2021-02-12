import mongoose from 'mongoose';

class DataBase{
    constructor(){
        this.mongoDataBase()
    }

    mongoDataBase(){
        this.mongoDBConnection = mongoose.connect('mongodb+srv://admin:Popo.3039110@cluster0.dw7bq.mongodb.net/jef_perfumaria?retryWrites=true&w=majority',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }).then(()=>{
            console.log("Connected with MongoDB")
        }).catch((e)=>{
            console.log("Error: Not conencted with MongoDB. Err: "+e)
        })
    }
}

export default new DataBase()