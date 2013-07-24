console.log("starting");

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


var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en";



recognition.onresult = function (event) {
  // console.log("event");
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    console.log("checking: "+ event.results[i][0].transcript);
    $('textarea#transcript').val(event.results[i][0].transcript);
    // checkForKeywordMatch(event.results[i][0].transcript);
    checkKeyword(event.results[i][0].transcript);
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
      document.getElementById("slide-area").innerHTML=xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET","checkForKeywordMatch.js?body="+transcript.replace(/ /g,'-') ,true);
  xmlhttp.send();
}

function checkKeyword(transcript)
{
  transcript = transcript.split(' ');

  var slides = slides_arr;

  console.log(slides);

  for (var x = 0; x < slides.length; x++) {
    for (var y = 0; y < slides[x].keywords.length; y++) {
      for (var z = 0; z < transcript.length; z++) {
        match = slides[x].keywords[y].indexOf(transcript[z]);
        if ( match >= 0 && transcript[z] != '') {
          console.log("match found: " + transcript[z]);
          $('#slide-area').html('<img src="' + slides[x].resource + '", length="400", width="500")>');
        }
      }
    }
  }
  //for each slide
  //if a keyword is found in the transcript
  //show the slide
}

