
const privateMessageController = require("./privateMessageController"),
    publicMessageController = require("./publicMessageController"),
    User = require("../models/user"),
    { emitError } = require("../utils/socketErrors"),
    { sessionMiddleware } = require("../app"),
    passport = require("passport");



module.exports = io => {


    const PrivateChat = io.of("/privateChat");
    const PublicChat = io.of("/publicChat");
    const generalControl = io;
    const endpoints = [PrivateChat,PublicChat,generalControl]
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

    for (each in endpoints){
        let endpoint = endpoints[each];

        endpoint.use(wrap(sessionMiddleware));
        endpoint.use(wrap(passport.initialize()));
        endpoint.use(wrap(passport.session()));
        endpoint.use((client, next) => {
            if ((!!client.request.user)) {
                next();
            } else {
                // emitError(client, "User is not signed in", "UserNotSignedInError")
                const err = new Error("not authorized");
                err.data = { content: "Please sign in" }; // additional details
                next(err);
            }
        });


    }
    


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
                    emitError(client, "Something went wrong", error)
                }
                else {
                    console.log("user is now online")
                    client.emit("onlineStatusUpdated")
                }
            })
        })

        client.on("disconnect", () => {
            console.log("it goes down when i disconnect")
            User.findOneAndUpdate({ online: client.id }, { $set: { online: "" } })
                .then(user => {
                    console.log("cliend id", client.id)
                    console.log("I am online, yeah?", user.online)//still returns not updated user but changes are committed
                })
                .catch(error => {
                    emitError(client, "We couldn't find user with socketId", error)
                })



        })
    })
}