const User = require("../models/user"),
    PublicMessage = require("../models/publicMessage"),
    mongoose = require("mongoose"),
    { emitError } = require("../utils/socketErrors");


module.exports = {
    chat: (req, res, next) => {
        let userId = res.locals.currentuser;
        User.findByIdAndUpdate(userId,{publicMessageAlert:false},(error,done)=>{
            if (error) {next(error)}   
        })
        PublicMessage.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('sender')
            .then((messages) => {
                res.render("public/chat", {
                    messages: messages,
                    public: true //to be included in layout
                })
            })
            .catch((err) => {
                next(err)
            })

    },
    socketRespond: (endpoint, client) => {
        console.log(`public chat socket id is ${client.id}`)
        client.on("join", () => {
            chatId = "publicChatRoom"
            client.join(chatId)
            client.emit("joined")

        });
        client.on('publicMessage', (data) => {
            let content = data.content,
                sender = mongoose.Types.ObjectId(data.sender),
                senderName = data.senderName,
                chatId = "publicChatRoom";

            PublicMessage.create({
                sender: sender,
                content: content
            })
                .then((message) => {
                    message = {
                        sender: message.sender,
                        senderName: senderName,
                        content: message.content
                    },
                        endpoint.to(chatId).emit("incomingPublicMessage", message);
                })
                .catch(error => {
                    console.error(error)
                    emitError(client,"Could not register public message")
                })


        });

        

    },
}