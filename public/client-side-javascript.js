console.log("starting");
//( function($) {
  //  $(document).ready( function() { 
    //  if (window.webkitSpeechRecognition){


      //  }
        //else{
          //alert("Oops: webkitSpeechRecognition is not supported in your browser. Please use Chrome 25 or higher."); 
//      }
  //});
//}) (jQuery);

function changeButton() 
{
    var elem = document.getElementById("startStopButton");

    if (elem.value=="Start") {
        elem.value = "Stop";
        elem.setAttribute("src", "/images/microphone_on.png");
        recognition.start();
    }
    else {
        elem.value = "Start";
        elem.setAttribute("src", "/images/microphone.png");
        recognition.stop();
    }
}



var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en";

recognition.onresult = function (event) {
    console.log("event");
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        console.log("final");
        $('textarea#transcript').val(event.results[i][0].transcript);
        checkForKeywordMatch(event.results[i][0].transcript);
    }
};

function checkForKeywordMatch(transcript)
{
var xmlhttp;
if (window.XMLHttpRequest)
  {
  xmlhttp=new XMLHttpRequest();
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById("visuals-div").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET","checkForKeywordMatch.js?body="+transcript.replace(/ /g,'-') ,true);
xmlhttp.send();
}

