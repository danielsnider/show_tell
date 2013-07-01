( function($) {
    $(document).ready( function() { 
    	if (window.webkitSpeechRecognition){


        }
        else{
          alert("Oops: webkitSpeechRecognition is not supported in your browser. Please use Chrome 25 or higher."); 
      }
  });
}) (jQuery);

function changeButton() 
{
    var elem = document.getElementById("startStopButton");

    if (elem.value=="Start") {
        elem.value = "Stop";
        recognition.start();
    }
    else {
        elem.value = "Start";
        recognition.stop();
    }
}


console.log("starting");

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en";

recognition.onresult = function (event) {
    console.log("event");
    for (var i = event.resultIndex; i < event.results.length; ++i) {
            console.log("final");
            $('textarea#transcript').val(event.results[i][0].transcript);
            checkForKeywordMatch();
    }
};


function checkForKeywordMatch()
{
    $('img#visuals').attr('src',"images/happy.jpg");
}