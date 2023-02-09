const mongoose = require('mongoose');

const dbConnection = async () => {


    try {

        mongoose.set("strictQuery", false);

        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
        })

        console.log("Db online");


    } catch (error) {
        console.log(error);
        throw new Error("error initializing database")
    }

}

module.exports = {
    dbConnection
};