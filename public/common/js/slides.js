var slide_index, slide_count;
var unlocked_state = false;

var LEFT_KEY_CODE = 37;
var RIGHT_KEY_CODE = 39;
var P_KEY_CODE = 80;

function nextSlide(event) {
  if(slide_index >= slide_count-1) return false;
  thatSlide(slide_index+1);
  return true;
}

function prevSlide(event) {
  if(slide_index < 1) return false;
  thatSlide(slide_index-1);
  return true;
}

function toggleUnlockEntry() {
	$("#unlock_entry").toggle(1000);
}

function showPageCounter() {
	var html = "Slide "+(slide_index+1)+" of "+slide_count;
	console.log('unlocked state --> '+unlocked_state);
	if (unlocked_state) {
		html += '<span class="unlocked">(Unlocked)</span>';
	}
	
	$(".page_counter").html(html);
}

function thatSlide(index, randomize_pending, from_remote) {
  // Set everyone else's to the same
  if(!from_remote) {
	var slide_url = "/goto/"+index;
	var unlock_code = $("#unlock_code").val();
	
	if (unlock_code != null && unlock_code != "") {
		slide_url += "?unlock="+unlock_code;
	}
	
    $.getJSON(slide_url, executeGoto);
  } else {
	 moveSlide(index);
  }
}

function executeGoto(data, textStatus) {
	slide_index = data.slide_index;
	
	moveSlide(data.slide_index);
}

function moveSlide(index) {
  var i=0;

  slide_index = index;

  // Set page counter content
  showPageCounter();
  
  $("body > ol > li").each(function() {
    li = $(this);
    s = (Math.random() > 0.1)? 1 : -1;
    randrot = s*15*Math.random()
    
    if(i < index) {
      if(!li.hasClass("done")) {
        li.attr("class", "done");
        li.css("-webkit-transform", "rotate("+randrot+"deg)");
      }
    }
    if(i > index) {
      li.attr("class", "pending");
    }
    if(index == i) {
      li.attr("class", "current");
      li.css("-webkit-transform", "rotate(0deg)");
    }
    console.log("thatSlide "+index+" : set class for "+i+" to "+li.attr("class"));    
    i++;
  });  
}

$(document).ready(function() {
    
  slide_index = 0;
  slide_count = $("body > ol > li").length;
  z_counter = slide_count;
  // Set z-indexes
  $("body > ol > li").each(function() {
    li = $(this);
    li.css("z-index", z_counter);
    z_counter--;
  });
  
  // Listen to keypresses
  $("body").keyup(function(event) {
    event.preventDefault();

    if(event.keyCode == LEFT_KEY_CODE) prevSlide();
    if(event.keyCode == RIGHT_KEY_CODE) nextSlide();
	if(event.keyCode == P_KEY_CODE) toggleUnlockEntry();
  });
  
  // Create the status readout
  $("body").prepend('<section class="page_counter"></section>');
  $("body").prepend('<section id="unlock_entry" style="display: none;"><input id="unlock_code" type="text" value="" /></section>');
  
  // Set to slide zero
  thatSlide(0, true, true);
});