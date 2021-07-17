
const mongoose = require("mongoose"),
    { Schema } = mongoose,
    privateMessageSchema = new Schema({
        sender: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        receiver: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],

        content: {
            type: String,
            required: true,
        },

    }, {
        timestamps: true
    });


// privateMessageSchema.pre("save", function(next){
//     let pm = this;
//     if (pm.particants.length > 2){
//         let err = new Error('There are more than two people in private message model');
//         // If you call `next()` with an argument, that argument is assumed to be
//         // an error.
//         console.log(error)
//         next(err);

//     }
// })



module.exports = mongoose.model("PrivateMessage", privateMessageSchema);
