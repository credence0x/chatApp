const mongoose = require("mongoose"),
    { Schema } = mongoose,
    publicMessageSchema = new Schema({
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true,
        },

    }, {
        timestamps: true
    });







module.exports = mongoose.model("PublicMessage", publicMessageSchema);