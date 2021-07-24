
$(document).ready(() => {
    let socket = io(),
        userId = $("#current-user").val();
    if (userId){
        socket.emit("online",userId)
    }
    socket.on("onlineStatusUpdated",()=>{
        console.log("I am online")
    })  
})