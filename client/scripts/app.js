// YOUR CODE HERE:

var allMessagesOnServer;
var selected = "Select a Room..."
var friends = [];

$(document).ready(function(){
  app.init();
 //WE MAY HAVE TO MOVE THIS SOMEWHERE AND ADD THIS EVENT WATCHER EACH TIME OUR MESSAGE DIVS GET WIPED AND RE-APPENDED.
});

var app = {};

app.init = function(){
  setInterval(function(){app.fetch();}, 1000);
}


app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: JSON.stringify({
      key: 'value: '
    }),
    contentType: 'application/json',
    success: function (data) {
      allMessagesOnServer = data;
      app.appendDataToFeed(allMessagesOnServer);
      console.log("we're getting data");
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('something is bad and wrong');
    }
  });
};

var rooms = {};

app.appendDataToFeed = function(allMessagesOnServer){
  $(".messageFeed").text("");
  var theMessages = allMessagesOnServer["results"];

  for (var i = 0; i < theMessages.length; i++){
    if (app.validateData(theMessages[i])){
      $(".messageFeed").append('<div class="postedMessage message' + i +'" data-room-name="' + theMessages[i].roomname + '"' + ' data-username="' + theMessages[i].username + '"></div>');
      $(".message" + i).text(theMessages[i].username + ": " + theMessages[i].text);
      if($(".message" + i).data("room-name") !== selected && selected !== "Select a Room..."){
        $(".message" + i).hide();
      }
      if (friends.indexOf(theMessages[i].username) > -1){
        $(".message" + i).css('font-weight', 'bold');
      }
      //app.boldFriend();
    }
  }
  app.setHandlers();
  app.populateRoomDropdown();
};

app.setHandlers = function(){
  $(".postedMessage").click(function(){
    var friended = $(this).data("username");
    if (friends.indexOf(friended) === -1){
      friends.push(friended);
    }
  });
};

app.validateData = function(message){
  var OK = false;
  _.each(message, function(key){
    if (key && key.length > 0 || key === ""){
      if (key.indexOf("<script>") === -1){
        OK = true;
      }
    }
  });
  return OK;
}

app.populateRoomDropdown = function(){
  var theMessages = allMessagesOnServer["results"];

  for (var j = 0; j < theMessages.length; j++){
    if ("roomname" in theMessages[j]){
      rooms[theMessages[j].roomname] = theMessages[j].roomname;
    }
  }

  for (var key in rooms){
    var found = false;
    for (j = 0; j < $(".rooms").children().length; j++){
      if ($(".rooms").children()[j].value === rooms[key] || /["]/.test($(".rooms").children()[j].value) || $(".rooms").children()[j].value === null){ //if some jackass uses null w/o quotes, write a new test
        found = true;
        //break;
      }
    }
    if (!found){
      $('.rooms').append('<option value="'+ rooms[key] +'">'+ rooms[key] +'</option>');
    }
  };
}

app.clearMessages = function(){
  $("#chats").text("");
  //debugger;
}

app.filterMessages = function(){
  //ultimately, appendDataToFeed should check what room is selected ("selected" can eventually be moved to the global scope), append all messages, and hide() any appended divs that do not match
//the value of var selected
  var menu = document.getElementsByClassName("rooms")[0];
  selected = menu.options[menu.selectedIndex].value; //does this get what we want?
  if (selected === "Select a room..."){
    $(".postedMessage").show();
    return;
  }
  var messageDivsInFeed = $("#chats").children();
  _.each(messageDivsInFeed, function(div){
    if ($(div).data("room-name") !== selected){
      $(div).hide();
    }
  });
}

app.send = function(message){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.makeMessage = function(){
  var userName = document.getElementById("username").value;
  var currentMessage = document.getElementById("messagetext").value;
  var roomname = document.getElementById("roomname").value;
  var message = new Message(userName, currentMessage, roomname);
  app.send(message);
};

var Message = function(username, text, roomname){
  this.username = username;
  this.text = text;
  this.roomname = roomname;
};

