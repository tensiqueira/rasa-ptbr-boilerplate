$(document).ready(function () {
  var mybot =
    '<div class="chatCont" id="chatCont">' +
    '<div class="bot_profile">' +
    '<img src="assets/img/persona/mia.png" class="bot_p_img">' +
    '<div class="close">' +
    '<i class="fa fa-times" aria-hidden="true"></i>' +
    "</div>" +
    "</div><!--bot_profile end-->" +
    '<div id="result_div" class="resultDiv"></div>' +
    '<div class="chatForm" id="chat-div">' +
    '<div class="spinner">' +
    '<div class="bounce1"></div>' +
    '<div class="bounce2"></div>' +
    '<div class="bounce3"></div>' +
    "</div>" +
    '<input type="text" id="chat-input" autocomplete="off" placeholder="Digite aqui a sua mensagem..."' +
    'class="form-control bot-txt"/>' +
    "</div>" +
    "</div><!--chatCont end-->" +
    '<div class="profile_div">' +
    '<div class="row">' +
    '<div class="col-hgt">' +
    '<img src="assets/img/persona/mia_head.png" class="bot_p_img" class="img-circle img-profile">' +
    "</div><!--col-hgt end-->" +
    '<div class="col-hgt">' +
    '<div class="chat-txt">' +
    "Olá, meu nome é MIA! Em que posso lhe ajudar?" +
    "</div>" +
    "</div><!--col-hgt end-->" +
    "</div><!--row end-->" +
    "</div><!--profile_div end-->";

  $("mybot").html(mybot);
  $(".profile_div").click(function () {
    $(".profile_div").toggle();
    $(".chatCont").toggle();
    $(".bot_profile").toggle();
    $(".chatForm").toggle();
    document.getElementById("chat-input").focus();
  });

  $(".close").click(function () {
    $(".profile_div").toggle();
    $(".chatCont").toggle();
    $(".bot_profile").toggle();
    $(".chatForm").toggle();
  });
  var session = function () {
    if (sessionStorage.getItem("session")) {
      var retrievedSession = sessionStorage.getItem("session");
    } else {
      var randomNo = Math.floor(Math.random() * 1000 + 1);
      var timestamp = Date.now();
      var date = new Date();
      var weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      var day = weekday[date.getDay()];
      var session_id = randomNo + day + timestamp;
      sessionStorage.setItem("session", session_id);
      var retrievedSession = sessionStorage.getItem("session");
    }
    return retrievedSession;
  };
  var mysession = session();

  $("#chat-input").on("keyup keypress", function (e) {
    var keyCode = e.keyCode || e.which;
    var text = $("#chat-input").val();
    if (keyCode === 13) {
      if (text == "" || $.trim(text) == "") {
        e.preventDefault();
        return false;
      } else {
        $("#chat-input").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
      }
    }
  });
  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function send(message) {
    console.log("User Message:", message);
    $.ajax({
      url: "http://10.210.134.112:5007/webhooks/rest/webhook",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        message: message,
        sender: "username",
      }),
      success: function (data, textStatus) {
        setBotResponse(data);
        console.log("Rasa Response: ", data, "\n Status:", textStatus);
      },
      error: function (errorMessage) {
        setBotResponse("");
        console.log("Error" + errorMessage);
      },
    });
  }

  function setBotResponse(val) {
    setTimeout(function () {
      if (val.length < 1) {
        val = "Eu não entendi! Tente outra coisa, por favor!";
        var BotResponse =
          '<p class="botResult">' + val + '</p><div class="clearfix"></div>';
        $(BotResponse).appendTo("#result_div");
      } else {
        for (i = 0; i < val.length; i++) {
          if (val[i].hasOwnProperty("text")) {
            var BotResponse =
              '<p class="botResult">' +
              val[i].text +
              '</p><div class="clearfix"></div>';
            $(BotResponse).appendTo("#result_div");
          }
          if (val[i].hasOwnProperty("image")) {
            var BotResponse =
              '<div class="singleCard">' +
              '<img class="imgcard" src="' +
              val[i].image +
              '">' +
              '</div><div class="clearfix">';
            $(BotResponse).appendTo("#result_div");
          }
          if (val[i].hasOwnProperty("buttons")) {
            addSuggestion(val[i].buttons);
          }
        }
      }
      scrollToBottomOfResults();
      hideSpinner();
    }, 500);
  }

  function main(data) {
    console.log(data);
    for (i = 0; i < data.length; i++) {
      var speech = data[i]["text"] || "Sorry!!!";
      setBotResponse(speech);
    }
  }

  function setUserResponse(val) {
    var UserResponse =
      '<p class="userEnteredText">' + val + '</p><div class="clearfix"></div>';
    $(UserResponse).appendTo("#result_div");
    $("#chat-input").val("");
    scrollToBottomOfResults();
    showSpinner();
    $(".suggestion").remove();
  }
  function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById("result_div");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  }
  function showSpinner() {
    $(".spinner").show();
  }
  function hideSpinner() {
    $(".spinner").hide();
  }

  $(document).on("click", ".suggestion span", function () {
    var text = this.innerText;
    setUserResponse(text);
    send(text);
    $(".suggestion").remove();
  });
});
