class APIFeatures {
    constructor (query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = {...this.queryString};
        const excludedQuery = ['limit', 'sort', 'fields', 'page'];
        excludedQuery.forEach(el => delete queryObj[el]);

        // 1B. Advanced Filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`);
        queryString = JSON.parse(queryString);

        this.query = this.query.find(queryString);

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortQuery = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortQuery);
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments();

        //     if (skip >= numTours) throw new Error("Tis page doesn't exists.");
        // }

        return this;
    }
}

module.exports = APIFeatures;