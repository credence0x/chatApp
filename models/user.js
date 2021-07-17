
const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    { Schema } = mongoose,
    userSchema = new Schema({
        name: {
            first: {
                type: String,
                trim: true, // remove white spaces
                required:true
            },
            last: {
                type: String,
                trim: true,
                required:true
            }
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        // apiToken: {
        //     type: String,
        // },
        // courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    }, {
        timestamps: true
    });




// userSchema.pre("save", function (next) {
//     let user = this;
//     if (!user.apiToken) {
//         user.apiToken = randToken.generate(16)
//         console.log(user)
//     };
//     next();
// });


userSchema.virtual("fullName")
    .get(function () {
        return `${this.name.first} ${this.name.last}`;
    });


userSchema.plugin(passportLocalMongoose, {
    usernameField: "email" //defaults to username field
});
module.exports = mongoose.model("User", userSchema);
