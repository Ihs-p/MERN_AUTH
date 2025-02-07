const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        mongoose.connection.on('connected',() => {
            console.log("database connected");
            
        })
         await mongoose.connect(process.env.MONGO_URI)

    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }

}

module.exports = connectDB