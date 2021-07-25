
$(document).ready(() => {
    let socket = io(),
        userId = $("#current-user").val();
    if (userId) {
        socket.emit("online", userId)
    }
    socket.on("onlineStatusUpdated", () => {
        console.log("I am online")
    });
    
    socket.on("connect_error", (err) => {
        console.log(err.message,"general socket"); // not authorized
        $(".logged-in").html("<a href='/login' style='text-decoration:none;color:white'>Sign in</a>")
        $(".logged-in").css({"background-color":"red","color":"white"})
        $(".log-out").hide()
        $("#online-status").text("")
    });
})