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