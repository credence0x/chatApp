$(document).ready(() => {
  let socket = io("/publicChat"),
    firstId = $("#first-user-id").val(), //firstUserId
    firstName = $("#first-user-name").val(),//firstUserName
    chatIdData = "publicChatRoom"


  socket.emit("join", chatIdData);
  socket.on("joined", (data) => {
  })






  $("#publicChatForm").submit((event) => {
    event.preventDefault();
    let text = $("#chat-input").val(),
      data = {
        content: text,
        sender: $("#first-user-id").val(),
        senderName: $("#first-user-name").val(),
      };

    socket.emit("publicMessage", data);
    $("#chat-input").val("");
    return false;
  });






  socket.on("connect_error", (err) => {
    console.log(err.message);
  });

  socket.on("incomingPublicMessage", (message) => {

    displayMessage(message);
    for (let i = 0; i < 2; i++) {
      $(".chat-icon").fadeOut(200).fadeIn(200);
    }
  });

  let displayMessage = (message) => {
    $("#publicChatBox").prepend($("<li>").html(`<strong class="message ${getCurrentUserClass(message.sender)}">${message.senderName}</strong>: ${message.content}`
    ));
  };
  let getCurrentUserClass = (id) => {
    let userId = $("#first-user-id").val();
    return userId === id[0] ? "current-user" : "";
  };






});



