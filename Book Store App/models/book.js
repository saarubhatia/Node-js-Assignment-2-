var mongoose=require("mongoose");

var bookSchema = new mongoose.Schema({
    id:String,
    title:String,
    image:String,
    price:Number,
    description:String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("Book", bookSchema);