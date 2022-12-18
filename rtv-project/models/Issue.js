const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issueSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    likedBy: {
        type: Array
    },
    dislikedBy: {
        type: Array
    }
})

module.exports = mongoose.model("Issue", issueSchema)