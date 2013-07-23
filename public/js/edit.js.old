console.log("starting");

function testquery()
{
  var elem = document.getElementById("test_result");
  var query_result = "button change";
  elem.innerHTML = query_result;
  console.log("testquery");

  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    xmlhttp=new XMLHttpRequest();
  }
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      document.getElementById("test_result").innerHTML=xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET","testquery", true);
  xmlhttp.send();
}

function createEmptyDeck()
{
  var elem = document.getElementById("n/a");
  // elem.innerHTML = query_result;

  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    xmlhttp=new XMLHttpRequest();
  }
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      // document.getElementById("test_result").innerHTML=xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET","createEmptyDeck", true);
  xmlhttp.send();
}

function deleteDeckById(id)
{
  var elem = document.getElementById("n/a");

  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    xmlhttp=new XMLHttpRequest();
  }
  // xmlhttp.onreadystatechange=function()
  // {
  //   if (xmlhttp.readyState==4 && xmlhttp.status==200)
  //   {
  //     // document.getElementById("test_result").innerHTML=xmlhttp.responseText;
  //   }
  // }
  xmlhttp.open("GET","deleteDeckById?id="+id, true);
  xmlhttp.send();
}

$(document).ready(function(){
  // old code
  // $('#current_slide').attr('src', 'test');
  // $('#text').html(#{deck._id});
})