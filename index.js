import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import initApp from './src/index.routes.js'
import  scheduler  from 'node-schedule'
import { sendReminderEmails } from './src/utils/reminderMailer.js'

//*set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })

const app = express()
// setup port and the baseUrl
initApp(app,express)

const port = +process.env.PORT
app.listen(port, () => console.log(`App listening on port:${port}!`))

//*function that runs everyday at 9:00 *pm and send a reminder email to all users didn’t confirm their emails to warn them from delete their accounts*
const reminderJob = scheduler.scheduleJob('0 0 21 * * *', sendReminderEmails);
