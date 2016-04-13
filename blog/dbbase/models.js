module.exports={
    user:{
        name: { type: String, required: true },
        password: { type: String, required: true }
    },
    post:{
        pname:{type:String},
        content:{type:String},
        time:{type:Date,default:Date.now()}
    }
}