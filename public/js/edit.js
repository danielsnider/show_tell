
$(document).ready(function(){

    //when keyword change is typed, change keywords in database
    $("#keywords_text_area").bind("keyup", function(event, ui) { 
        updateKeywords($("#keywords_text_area").val()); // TOTALLY INEFFICIENT (This does a database update query on every keystroke... to do: cache keyword changes locally and commit in lump)
    });

    //if keyword change is made and it's text area is unfocused, update the local variable for the keyword and other references
    $("#keywords_text_area").change( function() { 
      var id;
      for (var i = 0; i < slides_arr.length; i++) {
        if (slides_arr[i]._id == current_slide_id) {
          slides_arr[i].keywords = $("#keywords_text_area").val();
          id = '#slide'+slides_arr[i]._id;
          $(id).html('<img id="current_img", src="' + slides_arr[i].resource + '", onclick="displaySlide(\'' + slides_arr[i].resource + '\', \'' + slides_arr[i].keywords + '\', \'' + slides_arr[i]._id + '\')">');
        }
      };
    });
});

function updateKeywords(keywords)
{
  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    xmlhttp=new XMLHttpRequest();
  }
  xmlhttp.open("GET","updateKeywords?slideid=" + current_slide_id + "&keywords=" + keywords , true);
  xmlhttp.send();
}

function myFunction()
{
var node=document.createElement("LI");
var textnode=document.createTextNode("Water");
node.appendChild(textnode);
//var btn=document.createElement("br");
//var temp=document.getElementById("123123");
//btn.src="../../img/slide.png";
document.getElementById("123123").appendChild(textnode);
};


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    var copyimg = document.createElement("img");
    var original = document.getElementById(data);
    copyimg.src = original.src;
	copyimg.width = 700;
	copyimg.height =400;
    ev.target.appendChild(copyimg);
}

function displaySlide(resource, keywords, id) {
    $('#current_slide').html('<img id="current_img", src="' + resource + '")>');
    $('#keywords_text_area').val(keywords);
    current_slide_id = id;
}

// $(document).bind('keypress', 'left', function() {
//     alert('left (bind) handled by jQuery.hotkeys');
// });

// $(document).bind('keypress', 'right', function() {
//     alert('right (bind) handled by jQuery.hotkeys');
// });




// $('#keywords_text_area').change(function(){
//     var keywords = ($(this).val());
//     console.log(keywords);
// });

