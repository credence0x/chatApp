$(document).ready(() => {
  var socket = io("/privateChat"),
    yes = "yes",
    firstId = $("#first-user-id").val(), //firstUserId
    secondId = $("#second-user-id").val(),//secondUserId
    // firstName = $("#first-user-name").val(),//firstUserName
    secondName = $("#second-user-name").val(),//secondUserName

    chatIddata = [firstId, secondId]

  socket.on("connect", () => {
    //to make sure it rejoins after every disconnection
    socket.emit("join", chatIddata);
  });
  socket.on("connect_error", (err) => {
    console.log(err.message); 
});
  socket.on("joined", (data) => {
    window.chatId = data
  })



  $("#privateChatForm").submit((event) => {
    event.preventDefault();
    let text = $("#chat-input").val(),
      data = {
        content: text,
        chatId: [firstId, secondId].sort()[0] + [firstId, secondId].sort()[1],
        receiver: $("#second-user-id").val(),//secondUserId
        sender: $("#first-user-id").val(),
        senderName: $("#first-user-name").val(),
        receiverName: secondName
      };
    socket.emit("privateMessage", data);
    console.log("SID 1: ", socket.id)

    $("#chat-input").val("");
    return false;
  });





  // let secondId = data.secondId,
  //   chatId = data.chatId;
  checkStatus = () => {
    let chatId = window.chatId,
      secondId = $("#second-user-id").val();

    if (chatId) {
      let data = {
        chatId: chatId,
        secondId: secondId
      }
      socket.emit("checkOtherUserStatus", data)
    }

  }
  setInterval(checkStatus, 3000)


  socket.on("serverConfirmStatus", (status) => {
    if (status == true) {
      $("#online-status").text("Online")
    } else {
      $("#online-status").text("")
    }
  })



  socket.on("incomingDm", (message) => {
    console.log("SID 2: ", socket.id)

    displayMessage(message);
    for (let i = 0; i < 2; i++) {
      $(".chat-icon").fadeOut(200).fadeIn(200);
    }
    let data = [firstId, secondId];
    if (message.sender != data[0]) {
      socket.emit("im online, update database to read", data)
    }
  })



  let displayMessage = (message) => {
    $("#privateChatBox").prepend($("<li>").html(`<strong class="message ${getCurrentUserClass(message.sender)}">${getCurrentUserName(message.sender)}</strong>: ${message.content}`
    ));
  };
  let getCurrentUserClass = (id) => {
    let userId = $("#first-user-id").val();
    return userId === id[0] ? "current-user" : "";
  };
  let getCurrentUserName = (id) => {
    let userId = $("#first-user-id").val();
    if (userId === id[0]) {
      return "Me"
    } else {
      return secondName
    }

  };





});



