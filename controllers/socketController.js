
var privateMessageController = require("./privateMessageController");
var publicMessageController = require("./publicMessageController");



module.exports = io => {
    const PrivateChat = io.of("/privateChat");
    const PublicChat = io.of("/publicChat");
    PrivateChat.on("connection", client => {
        privateMessageController.respond(PrivateChat,client);
    });
    PublicChat.on("connection", client => {
        publicMessageController.respond(PublicChat,client);
    });
};
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////// P R I V A T E   M E S S A G E S /////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////


//             client.on("disconnect", () => {
//                 client.broadcast.emit("user disconnected"); //broadcat.emit is to send to all other users
//                 // except disconnecting user
//                 console.log("user disconnected");
//             });
//    