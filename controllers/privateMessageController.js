const UserModel = require("../models/user"),
    PrivateMessage = require("../models/privateMessage"),
    User = require("../models/user"),
    mongoose = require("mongoose"),
    { emitError } = require("../utils/socketErrors");


updatePrivateAlert = (alertList, secondIdString, userId, socket = false) => {
    let mapFunction = function (value, index, array) {
        let end = value != this.senderId
        return end
    };
    let indices = alertList.map(mapFunction, { senderId: secondIdString })
    newPrivateAlertValues = []
    for (i = 0; i < indices.length; i++) {
        if (indices[i] == true) {
            newPrivateAlertValues.push(alertList[i])
        }
    }
    // return newPrivateAlertValues
    User.findOneAndUpdate({ _id: userId },
        { privateMessageAlert: newPrivateAlertValues },
    )
        .then(user => {
            console.log("edited private message alerts")
        })
        .catch(error => {
            if (socket) { emitError(client, "couldn't update your message alerts") }
            else {
                next(error)
            }
        })
};


module.exports = {
    home: (req, res, next) => {
        let currentUser = res.locals.currentUser;
        UserModel.find({})
            .then((users) => {
                let alertList = currentUser.privateMessageAlert,
                    mapfunc = function (val) {
                        return val.toString()
                    },

                    checkList = alertList.map(mapfunc), //convert objectId to string
                    allAlerts = {}
                for (each in checkList) {
                    let each1 = checkList[each]
                    console.log(each1)
                    if (!allAlerts[each1]) {
                        allAlerts[each1] = 1
                    } else {
                        allAlerts[each1] = allAlerts[each1] + 1
                    }
                }
                res.render('private/home', {
                    users: users,
                    allAlerts: allAlerts,
                })
            })
            .catch((err) => {
                next(err)
            })
    },

    chat: (req, res, next) => {

        let secondUserIdString = req.params.SecondUserId,
            userId = res.locals.currentUser,
            secondUserId = mongoose.Types.ObjectId(secondUserIdString);

        // to remove unread message logo 
        User.findOne({ _id: userId }, (error, user) => {
            if (error) {
                next(error)
            }
            else {
                let privateAlerts = user.privateMessageAlert;
                updatePrivateAlert(privateAlerts, secondUserIdString, user.id);
            }
        })

        // find private chat messages
        PrivateMessage.find({
            $or: [{ sender: secondUserId, receiver: userId },
            { sender: userId, receiver: secondUserId }]
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .then((messages) => {
                User.findById(secondUserId)
                    .then(secondUser => {
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
    socketRespond: (endpoint, client) => {
        console.log(`private chat socket id is ${client.id}`)

        client.on("join", (data) => {
            let firstId = data[0],
                secondId = data[1],
                joint = [firstId, secondId].sort()
            chatId = joint[0] + joint[1]  //chatid is the joint ids of both users
            client.join(chatId)
            console.log(`Client joined ${chatId}`);
            client.emit("joined", chatId)
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
                .then((message) => {
                    message = {
                        sender: message.sender,
                        userName: senderName,
                        content: message.content

                    },
                        User.findByIdAndUpdate(data.receiver,
                            { $push: { privateMessageAlert: data.sender } },
                            (error, update) => {
                                if (error) { emitError(client, "Couldn't alert about new message", error) }
                                else {
                                    endpoint.to(chatId).emit("incomingDm", message);
                                }
                            }
                        )
                })
                .catch(error => {
                    console.log(error)
                    emitError(client, "Could not create private message", error)
                })


        });

        client.on("im online, update database to read", data => {
            let userId = data[0],
                secondId = data[1];
            User.findById(userId, (error, user) => {
                if (error) { emitError(client, "Could not change to read", error) }
                else if (user){
                    let privateAlerts = user.privateMessageAlert;
                    updatePrivateAlert(privateAlerts, secondId, user.id, socket = true);

                }
            })
        })

        client.on("checkOtherUserStatus", data => {
            let secondId = data.secondId,
                chatId = data.chatId;
            User.findById(secondId,(error, user)=>{
                if (error) {emitError(client,"Can't find out whether the other user is online or not")}
                if (user){
                    let status = Boolean(user.online)
                    client.emit("serverConfirmStatus",status)
                }
                else{}//handle no user
            })

        })

    },
}