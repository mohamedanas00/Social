import mongoose from "mongoose";

const connectDB = async () => {
    return await mongoose.connect(process.env.DB_ATLAS)
        .then(res => console.log(`DB Connected successfully✅ .........`))
        .catch(err => console.log(` Fail to connect  DB❌.........${err} `))

}

export default connectDB