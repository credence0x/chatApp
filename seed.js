const mongoose = require("mongoose"),
    User = require("./models/user"),
    passport = require("passport");

mongoose.connect(
    "mongodb://localhost:27017/ChatApp",
    { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection;
commands = []
var people = [
    {
        name: {
            first: "Jon",
            last: "Wexler",
        },
        email: "jon@jonwexler.com",
        password: "me"
    },
    {
        name: {
            first: "Lanre",
            last: "Ojetokun",
        },
        email: "eggplant@recipeapp.com",
        password: "me"


    },
    {
        name: {
            first: "Vicole",
            last: "Odebunmi",
        },
        email: "souffle@recipeapp.com",
        password: "me"

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

