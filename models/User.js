const mongoose =require(`mongoose`)    

const user = mongoose.model(`User`, {
    name: String,
    email: String,
    senha: String
})

module.exports = user


