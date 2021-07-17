const mongoose = require("mongoose"),
    User = require("./models/user"),
    passport = require("passport");

mongoose.connect(process.env.MONGOODB.URI || "mongodb://localhost:27017/ChatApp",
    { useNewUrlParser: true, useUnifiedTopology: true }
);
commands = []
var people = [
    {
        name: {
            first: "Bolu",
            last: "Tife",
        },
        email: "first@gmail.com",
        password: "meh"
    },
    {
        name: {
            first: "Lanre",
            last: "Ojetokun",
        },
        email: "bot1@gmail.com",
        password: "meh"


    },
    {
        name: {
            first: "Vicole",
            last: "Odebunmi",
        },
        email: "chosen@yes.com",
        password: "meh"

    }
];

User.deleteMany()
    .exec()
    .then(() => {
        console.log("User data is empty!");
    });




people.forEach((c) => {
    commands.push(
        User.register(c, c.password, (error, user) => {
        if (user){
            console.log(user.fullName)
        } else {
            console.log(error.message)
        }
        
           
        
        })
)
});



Promise.all(commands)
    .then(r => {
        console.log(JSON.stringify(r));
        // mongoose.connection.close();
    })
    .catch(error => {
        console.log(`ERROR: ${error}`);
    });
////////////////////////////////////////////////////////////

