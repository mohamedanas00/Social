


//*Error Class: to create Error WITH his status EX.404 and /message:To clear the error why is happen. 
export class ErrorClass extends Error {
    constructor(message, status) {
        super(message)
        this.status = status || 400
    }
}
