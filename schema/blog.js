// Mongoose / Schema creation
var schema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

// Mongoose / model config
var Blog = mongoose.model("Blog", schema);

module.exports = Blog;