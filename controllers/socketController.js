
const privateMessageController = require("./privateMessageController"),
    publicMessageController = require("./publicMessageController"),
    User = require("../models/user"),
    { emitError } = require("../utils/socketErrors");



module.exports = io => {
    const PrivateChat = io.of("/privateChat");
    const PublicChat = io.of("/publicChat");
    const generalControl = io;
    PrivateChat.on("connection", client => {
        privateMessageController.socketRespond(PrivateChat, client);
    });
    PublicChat.on("connection", client => {
        publicMessageController.socketRespond(PublicChat, client);
    });

    generalControl.on("connection", client => {
        client.on("online", (Id) => {
            let userId = Id;
            User.findByIdAndUpdate(userId, { online: client.id }, (error, user) => {
                if (error) {
                    emitError(client, "Something went wrong")
                }
                else {
                    console.log("user is now online")
                    client.emit("onlineStatusUpdated")
                }
            })
        })

        client.on("disconnect", () => {
            console.log("it goes down when i disconnect")
            // User.findOneAndUpdate({ online: client.id }, { $set : {online: "" }}, (error, user) => {
            //     if (error) {
            //         emitError(client, "We couldn't find user with socketId")
            //     }
            //     else{
            //         console.log("cliend id",client.id)
            //         console.log(user)
            //     }
            // })
            User.findOneAndUpdate({ online: client.id }, { $set : {online: "" }})
            .then(user=> {
                    console.log("cliend id",client.id)
                    console.log("I am online, yeah?",user.online)//still returns not updated user but changes are committed
            })
            .catch(error =>{
                    emitError(client, "We couldn't find user with socketId")
            })
                
            

        })
    })
}