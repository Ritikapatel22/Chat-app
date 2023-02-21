

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser : true,
            useUnifiedTopology :true
        });
        console.log(`MongoDB Connected ${conn.connection.host}`);
    } catch (error) {
        console.log('error: ', error);   
    }

};

module.exports = connectDB;
