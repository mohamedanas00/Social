import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import initApp from './src/index.routes.js'

//*set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })

const app = express()
initApp(app,express)


const port = +process.env.PORT
app.listen(port, () => console.log(`App listening on port:${port}!`))