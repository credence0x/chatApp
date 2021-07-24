
module.exports ={
    emitError : (client, message, room = false, broadcast = false) => {
        if (!room) {
    
            if (broadcast) {
                client.broadcast.emit("error", message)
            }
            else {
                client.emit("error", message)
            }
    
        } else {
    
            if (broadcast) {
                client.to(room).broadcast.emit("error", message)
            }
            else {
                client.to(room).emit("error", message)
            }
    
        }
    }
}