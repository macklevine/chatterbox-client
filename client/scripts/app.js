// YOUR CODE HERE:

//var ourScript = '<script>$(&quot;body&quot;).text(&quot;<img src=&quot;http://38.media.tumblr.com/a9c039cda3c688a820dd6a642e72404a/tumblr_nrfblwWSch1tz9mcyo1_500.gif&quot;/>&quot;)</script>';
var allMessagesOnServer;

$(document).ready(function(){
  app.init();
});

var app = {};

app.init = function(){
  setInterval(function(){app.fetch();}, 1000);
}
//

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
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('something is bad and wrong');
    }
  });
};

app.appendDataToFeed = function(allMessagesOnServer){
  $(".messageFeed").text("");
  var theMessages = allMessagesOnServer["results"];
  for (var i = 0; i < theMessages.length; i++){
    $(".messageFeed").append('<div class="postedMessage message' + i +'"></div>');
    $(".message" + i).text(allMessagesOnServer.results[i].username + ": " + allMessagesOnServer.results[i].text);
  }
  var rooms = {}; //may want to make this an object
  for (var j = 0; j < theMessages.length; j++){
    if ("roomname" in theMessages[j]){
      if (!theMessages[j].roomname in rooms){
        rooms[theMessages[j].roomname] = theMessages[j].roomname;
        //check to see if a given room is in the selection before we append it as a child to the node.
      }
    }
  }
  for (var key in rooms){
    //if (!$('.rooms').children().each()) FIND A WAY TO ITERATE OVER THE CHILDREN OF .rooms TO TEST FOR PRESENCE OF KEY.
    //if the key isn't there, let's append the key as a child element of the.rooms node.
    $('.rooms').append('<option value="'+ key +'">'+ key +'</option>');
  }
  //console.log(rooms);
};

app.clearMessages = function(){
  $("#chats").text("");
  //debugger;
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
  //debugger;
  var currentMessage = document.getElementById("messagetext").value;
  var roomname = document.getElementById("roomname").value;
  var message = new Message(userName, currentMessage, roomname);
  //debugger;
  //$("body").append("<div>" + message.text + "</div>");
  app.send(message);
  //return message;
  //add functionality later to actually use a ajax post request with JSON.stringify(message)
};

var Message = function(username, text, roomname){
  //debugger;
  this.username = username;
  this.text = text;
  this.roomname = roomname;
};

