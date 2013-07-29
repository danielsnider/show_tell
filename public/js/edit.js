
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
  // $('#test').html("displaySlide()");
  current_slide.keywords = keywords;
  document.getElementById(current_slide.resource).setAttribute("onclick", "displaySlide('"+current_slide.resource+"','"+current_slide.keywords+"', '"+current_slide._id+"')" );
  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    xmlhttp=new XMLHttpRequest();
  }
  xmlhttp.open("GET","updateKeywords?slideid=" + current_slide_id + "&keywords=" + keywords , true);
  xmlhttp.send();
}

function displaySlide(resource, keywords, id) {
  $('#current_slide').html('<img id="current_img", src="' + resource + '")>');
  $('#keywords_text_area').val(keywords);
  current_slide_id = id;
  for (var i = 0; i < slides_arr.length; i++) {
    if (slides_arr[i]._id == current_slide_id){
      current_slide = {
        _id : slides_arr[i]._id,
        resource: slides_arr[i].resource,
        keywords: slides_arr[i].keywords
      }
    }
  }
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

