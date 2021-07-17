const UserModel = require("../models/user"),
    PrivateMessage = require("../models/privateMessage"),
    User = require("../models/user"),
    mongoose = require("mongoose");

module.exports = {
    home: (req, res, next) => {
        UserModel.find({})
            .then((model) => {
                res.render('private/home', {
                    users: model,
                })
            })
            .catch((err) => {
                next(err)
            })
    },
    chat: (req, res, next) => {
        console.log(req.params.SecondUserId)
        let secondUserIdString = req.params.SecondUserId,
            userId = res.locals.currentUser,
            secondUserId = mongoose.Types.ObjectId(secondUserIdString);
            console.log(userId,secondUserId,"yyyyyyyyyde")

        PrivateMessage.find({
            $or: [{ sender: secondUserId, receiver: userId }, { sender: userId, receiver: secondUserId }]
            // participants: { "$in": [userId, secondUserId] }
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .then((messages) => {
                User.findById(secondUserId)
                    .then(secondUser => {
                        console.log(".................messages")
                        console.log(messages)
                        res.render("private/chat", {
                            messages: messages,
                            secondUser: secondUser,
                            
                        })
                    })

            })
            .catch((err) => {
                next(err)
            })

    },
    respond:(endpoint,client)=> {
        console.log("private chat connection");
        client.on("join", (data) => {
            let firstId = data[0],
                secondId = data[1],
                joint = [firstId, secondId].sort()
            chatId = joint[0] + joint[1]  //chatid is the joint ids of both users
            console.log("Client joined ${chatId}");
            client.join(chatId)
            client.emit("joined",chatId)
            
        });
        client.on('privateMessage', (data) => {
            let content = data.content,
                chatId = data.chatId,
                receiver = mongoose.Types.ObjectId(data.receiver),
                sender = mongoose.Types.ObjectId(data.sender),
                receiverName = data.receiverName,
                senderName = data.senderName;

            PrivateMessage.create({
                sender: sender,
                receiver: receiver,
                content: content
            })
                .then((message)=>{
                    // console.log(messge)
                    
                    message = {
                        sender : message.sender,
                        userName: senderName,
                        content:message.content

                    },
                    console.log(chatId)
                    endpoint.to(chatId).emit("incomingDm",message);
                })

            
        });

    },
}