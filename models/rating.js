const mongoose = require('mongoose');

const ratinSchema = mongoose.Schema({
    userId :{
        type: String,
        required : true,
    },
    rating: {
        type :Number,
        required: true,
    }
});

module.exports= ratinSchema;