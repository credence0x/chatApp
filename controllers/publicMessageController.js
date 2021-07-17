const UserModel = require("../models/user"),
    PublicMessage = require("../models/publicMessage"),
    mongoose = require("mongoose")

module.exports = {
    chat: (req, res, next) => {
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
    respond: (endpoint, client) => {
        console.log("public chat connection");
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
                    // console.log(messge)
                    message = {
                        sender: message.sender,
                        senderName: senderName,
                        content: message.content
                    },
                    
                        endpoint.to(chatId).emit("incomingPublicMessage", message);
                })


        });

    },
}