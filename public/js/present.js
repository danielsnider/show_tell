console.log("starting");
var current_slide_id = "";
var current_slide_keywords = [];

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en";

recognition.onresult = function (event) {
  console.log("function call: ");
  console.log("current_slide_keywords: "+JSON.stringify(current_slide_keywords));
  
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    console.log("checking: "+ event.results[i][0].transcript);
    for (var y = 0; y < current_slide_keywords.length; y++) {
      console.log("current_slide_keywords[y] == event.results[i][0].transcript: -" +current_slide_keywords[y] +"- -"+ event.results[i][0].transcript)+"-";
      if (event.results[i][0].transcript.indexOf(current_slide_keywords[y]) >= 0 ){
        console.log("duplicate ignored");
        return false;
      }
    }
    // if (event.results[i].isFinal) {
      console.log("is final: "+ event.results[i][0].transcript);
      //$('textarea#transcript').val(event.results[i][0].transcript);
      checkKeyword(event.results[i][0].transcript);
    // }
  }
};

window.onload = function()
{
 if (window.webkitSpeechRecognition){
 }
 else{
  alert("Oops: webkitSpeechRecognition is not supported in your browser. Please use Chrome 25 or higher.");
}

};

function changeButton()
{
  var elem = document.getElementById("startStopButton");

  if (elem.value=="Start") {
    elem.value = "Stop";
    elem.setAttribute("src", "/img/microphone_on.png");
    recognition.start();
  }
  else {
    elem.value = "Start";
    elem.setAttribute("src", "/img/microphone.png");
    recognition.stop();
  }
}

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
      document.getElementById("slide-area").innerHTML=xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET","checkForKeywordMatch.js?body="+transcript.replace(/ /g,'-') ,true);
  xmlhttp.send();
}

function checkKeyword(transcript)
{
  $('#transcript').val(transcript);
  transcript = transcript.split(' ');

  for (var x = 0; x < slides_arr.length; x++) {
    for (var y = 0; y < slides_arr[x].keywords.length; y++) {
      for (var z = 0; z < transcript.length; z++) {
        match = slides_arr[x].keywords[y].indexOf(transcript[z]);
        if ( match >= 0 && transcript[z] != '') {
          console.log("match found: " + transcript[z]);
          current_slide_keywords = slides_arr[x].keywords;
          current_slide_id = slides_arr[x]._id;
          $('#slide-area').html('<img src="' + slides_arr[x].resource + '", id="slide")>');
          return true;
        }
      }
    }
  }
  //for each slide
  //if a keyword is found in the transcript
  //show the slide
}

$(document).keydown(function(e){
  if (current_slide_id == "") { //if no slide shown yet, and right is pressed, show the first slide
    if (e.keyCode == 39) { //right
      $('#slide-area').html('<img src="' + slides_arr[0].resource + '", id="slide")>');
      current_slide_id = slides_arr[0]._id;
    }
  }
  else {
    for (var i = 0; i < slides_arr.length; i++) {
      if (slides_arr[i]._id == current_slide_id) {
        if (e.keyCode == 37) { //left
          if (slides_arr[i-1]) {
            $('#slide-area').html('<img src="' + slides_arr[i-1].resource + '", id="slide")>');
            current_slide_id = slides_arr[i-1]._id;
            return true;
          }
        }
        else if (e.keyCode == 39) { //right
          if (slides_arr[i+1]) {
            $('#slide-area').html('<img src="' + slides_arr[i+1].resource + '", id="slide")>');
            current_slide_id = slides_arr[i+1]._id;
            return true;
         }
        }
      }
    }
  }
});