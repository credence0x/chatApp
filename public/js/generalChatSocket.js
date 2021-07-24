$(document).ready(() => {
    let socket = io(),
        userId = $("#current-user").val();
    if (userId){
        socket.emit("online",userId)
    }
    socket.on("onlineStatusUpdated",()=>{
        console.log("You are now online")
    })
    

    //   firstName = $("#first-user-name").val(),//firstUserName
    //   chatIdData = "publicChatRoom"


    // socket.emit("join", chatIdData);
    // socket.on("joined", (data) => {
    //   console.log("public chat join emit received")     
    // })






    // $("#publicChatForm").submit((event) => {
    //   event.preventDefault();
    //   let text = $("#chat-input").val(),
    //   data = {
    //     content: text,
    //     sender: $("#first-user-id").val(),
    //     senderName:$("#first-user-name").val(),
    //   };

    //   console.log(data)
    //   socket.emit("publicMessage", data);
    //   $("#chat-input").val("");
    //   return false;
    // });








    // socket.on("incomingPublicMessage", (message) => {

    //   displayMessage(message);
    //   for (let i = 0; i < 2; i++) {
    //     $(".chat-icon").fadeOut(200).fadeIn(200);
    //   }
    // });

    // let displayMessage = (message) => {
    //   console.log("message",message)
    //   $("#publicChatBox").prepend($("<li>").html(`<strong class="message ${getCurrentUserClass(message.sender)}">${message.senderName}</strong>: ${message.content}`
    //   ));
    // };
    // let getCurrentUserClass = (id) => {
    //   let userId = $("#first-user-id").val();
    //   return userId === id[0] ? "current-user" : "";
    // };
    
  
  
  
  
  
  });



