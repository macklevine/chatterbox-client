// YOUR CODE HERE:

//var ourScript = '<script>$(&quot;body&quot;).text(&quot;<img src=&quot;http://38.media.tumblr.com/a9c039cda3c688a820dd6a642e72404a/tumblr_nrfblwWSch1tz9mcyo1_500.gif&quot;/>&quot;)</script>';
var allMessagesOnServer;

$(document).ready(function(){
  setInterval(function(){getMessagesFromServer();}, 1000)
});


var Message = function(username, text, roomname){
  //debugger;
  this.image = null;
  this.username = username;
  this.text = text;
  this.roomname = roomname;
};

var makeMessage = function(){
  var userName = document.getElementById("username").value;
  //debugger;
  var currentMessage = document.getElementById("messagetext").value;
  var roomname = document.getElementById("roomname").value;
  var message = new Message(userName, currentMessage, roomname);
  //debugger;
  //$("body").append("<div>" + message.text + "</div>");
  postMessagesToServer(message);
  //return message;
  //add functionality later to actually use a ajax post request with JSON.stringify(message)
};


var getMessagesFromServer = function(){
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
      appendDataToFeed(allMessagesOnServer);
      allMessagesOnServer;
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('something is bad and wrong');
    }
  });
};

var appendDataToFeed = function(allMessagesOnServer){
  $(".messageFeed").text("");
  for (var i = 0; i < allMessagesOnServer["results"].length; i++){
    $(".messageFeed").append('<div class="postedMessage message' + i +'"></div>');
    $(".message" + i).text(allMessagesOnServer.results[i].username + ": " + allMessagesOnServer.results[i].text);
  }
};

var postMessagesToServer = function(message){
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