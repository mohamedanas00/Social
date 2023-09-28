import connectDB from "../DB/connection.js"


const initApp =(app,express)=>{
    app.use(express.json())
    connectDB()
}


export default initApp