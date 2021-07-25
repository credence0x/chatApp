
module.exports ={
    emitError : (client, message, error,room = false, broadcast = false) => {
        console.log(error)
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