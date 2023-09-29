
export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString
    }
    pagination(model) {
        //1-pagination
        //if send any thing other number will be NaN || 1 =1
        let pageNumber = this.queryString.page * 1 || 1
        //if send -number 
        if (this.queryString.page <= 0) pageNumber = 1
        let limit = process.env.page_limit
        let skip = (pageNumber - 1) * limit
        this.page = pageNumber
        this.mongooseQuery.skip(skip).limit(limit)
        model.countDocuments().then((value) => {
            this.totalPages = Math.ceil(value / limit)
            this.countDocuments = value
            if (this.totalPages > this.page) {
                this.next = this.page + 1
            }
            if (this.page > 1) {
                this.previous = this.page - 1
            }
            
        })
        return this
    }

    filter() {
        //2-filter
        //... solve obj = obj
        let filterObj = { ...this.queryString }
        let exculdedQuery = ['page', 'sort', 'fields', 'keyword']
        exculdedQuery.forEach(element => {
            delete filterObj[element]
        })
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        filterObj = JSON.parse(filterObj)
        this.mongooseQuery.find(filterObj)
        return this
    }

    fields() {
        //selected fields
        if (this.queryString.fields) {
            let fields = this.queryString.fields.split(',').join(' ')

            this.mongooseQuery.select(fields)
        }
        return this
    }
}