  console.log('js loaded');
  var triggers = [];

// ------------------------ SETUP Standby-----------------------------
  function standBy(){
   

    // idleTimer() takes an optional object argument that defines any/all setting
    $( document ).idleTimer( {
        timeout:10000, 
        idle:true,
        events:'touchstart'
    });

   $( document ).on( "idle.idleTimer", function(event, elem, obj){
       stopStandBy();
    });

    $( document ).on( "active.idleTimer", function(event, elem, obj, triggerevent){
       startStandBy();
    });


}
 function startStandBy(){
 
 $('standby').css('display','block');

 $('standby').css('opacity',1);
 console.log('standby On');
 }
 function stopStandBy(){
 
 $('standby').css('opacity',0);
  setTimeout(function () {
    $('standby').css('display','none');
}, 500);
  console.log('standby Off');
 }
 
 // ------------------------ scrollhor-----------------------------
 function setupScrollHor(){
	
	 $('.scrollhorSlide').each(function(index) {
	 var width = 0;
    	var i = 0;
    	
    	$('#scrollhorSlide'+(index+1)).hammer().bind("swipeleft", function(event) {
    console.log("You swiped left - " + $(this).css('margin-left') );
    event.preventDefault();
    
	scrollContainer = $(this).attr('id');
	
	prevSlide = parseInt($('#'+scrollContainer).attr('current'));
	if(prevSlide < $('#scrollhorSlide'+(index+1)).children().length - 1){

		thisSlide = Math.abs(prevSlide+1);
		$('#'+scrollContainer).attr('current', thisSlide);

		$('#'+scrollContainer).siblings('menuhor').children('.horLink').removeClass('active');
		$('#'+scrollContainer).siblings('menuhor').children('.horLink').eq(thisSlide).addClass('active');
	
		console.log(prevSlide +'..'+ thisSlide);
		offset = thisSlide*100;
		distance = Math.abs(prevSlide - thisSlide);
		time = distance*0.5;
		margin = '-'+offset+'vw';

		$('#'+scrollContainer).css('transition', 'all '+time+'s ease-in-out').css('margin-left', margin);
		console.log(prevSlide+'prev - next'+thisSlide);
	} else {console.log('end');}
});
        	
$('#scrollhorSlide'+(index+1)).hammer().bind("swiperight", function(event) {
    console.log("You swiped right - " + $(this).css('margin-left') );

    event.preventDefault();
	scrollContainer = $(this).attr('id');
	
	prevSlide = parseInt($('#'+scrollContainer).attr('current'));
	if(!prevSlide < 1){
	thisSlide = Math.abs(prevSlide-1);
		$('#'+scrollContainer).attr('current', thisSlide);
	
	

	$('#'+scrollContainer).siblings('menuhor').children('.horLink').removeClass('active');
	$('#'+scrollContainer).siblings('menuhor').children('.horLink').eq(thisSlide).addClass('active');
	
	console.log(prevSlide +'..'+ thisSlide);


	offset = thisSlide*100;
	distance = Math.abs(prevSlide - thisSlide);
	time = distance*0.5;
	margin = '-'+offset+'vw';

	$('#'+scrollContainer).css('transition', 'all '+time+'s ease-in-out').css('margin-left', margin);

	
    } else {console.log('start');}
    });
		

		
		$(this).children('div').not('.indicator').each(function(i) {
				 

		newMenuItem = $(this).attr('id');
		newMenuItemTitle = newMenuItem.replace(/_/g , " ");
newMenuItemTitle = newMenuItemTitle.replace(/plus/g , "&");
newMenuItemTitle = newMenuItemTitle.replace(/comma/g , ",");
newMenuItemTitle = newMenuItemTitle.replace(/dpunkt/g , ":");
$('menuHor').eq(index).append('<div class="horLink '+i+'"><div class="menuDot">●</div><div class="menuTitle">'+newMenuItemTitle+'</div></div>');

    	width += $(this).outerWidth( true );
    	$(this).attr('jswidth',$(this).outerWidth( true ));
			});
		$(this).css('width',width+'px');
		$('menuHor').eq(index).children('.horLink').first().addClass('active');
		});
 
  }
  
function menuSetup(){
// ------------------------ SETUP Menu-----------------------------

$('slide').each(function(){

var newMenuItem = $(this).attr('id')+'';
var newMenuItemTriggerIn = $(this).attr('data-triggerin');
var newMenuItemTriggerOut = $(this).attr('data-triggerout');
var newMenuItemColor = $(this).attr('data-color');

newMenuItemTitle = newMenuItem.replace(/_/g , " ");
newMenuItemTitle = newMenuItemTitle.replace(/plus/g , "&");
newMenuItemTitle = newMenuItemTitle.replace(/comma/g , ",");
newMenuItemTitle = newMenuItemTitle.replace(/dpunkt/g , ":");
$('menu').append('<a href="#'+newMenuItem+'" data-color="'+newMenuItemColor+'" data-triggerin="'+newMenuItemTriggerIn+'" data-triggerout="'+newMenuItemTriggerOut+'"><div class="menuDot">●</div><div class="menuDotCurrent">‣</div><div class="menuTitle">'+newMenuItemTitle+'</div></a>');

})

// ------------------------ SETUP BUTTONS-----------------------------

$('.closeParent').click(function(e){
e.preventDefault();
$(this).parent().fadeOut(800); 
return false;
})

$('.flag.one').click(function(e){
e.preventDefault();
$('.popup.one').css({'opacity': '1', 'display':'block'});
console.log('flag one click');
return false;
})

$('.menuHide').click(function(e){
e.preventDefault();
$(this).parent().toggleClass('hide');
if(!$(this).hasClass()){
$('.slideIn.caption').removeClass('out');
}
return false;
})

$('.captionHide').click(function(e){
e.preventDefault();
$(this).siblings('.caption').toggleClass('out');
$(this).toggleClass('out');
$('menu').addClass('hide');
console.log('slide caption click');
return false;
})

$('.slideBtn').click(function(e){
e.preventDefault();
that = $(this).attr('id')+'';
slide = that.replace(/Btn/g , "In");
$('.slideIn').not('#'+slide).removeClass('out');
$('#'+slide).toggleClass('out');
console.log(that+'clicked'+slide+'opened');
return false;
})


$('.slideIn,.popup').click(function(e){
e.preventDefault();
that = $(this).attr('id');
$(this).toggleClass('out');
$(this).siblings('.captionHide').toggleClass('out');
console.log(that+'clicked');
return false;
})

}
// ------------------------ drag-zoom-----------------------------   
        		
function hammerIt(elm) {
hammertime = new Hammer(elm, {});
hammertime.get('pinch').set({
    enable: true
});
var posX = 0,
    posY = 0,
    scale = 1,
    last_scale = 1,
    last_posX = 0,
    last_posY = 0,
    max_pos_x = 0,
    max_pos_y = 0,
    transform = "",
    el = elm;

hammertime.on('doubletap pan pinch panend pinchend', function(ev) {
    if (ev.type == "doubletap") {
        transform =
            "translate3d(0, 0, 0) " +
            "scale3d(2, 2, 1) ";
        scale = 2;
        last_scale = 2;
        try {
            if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
                transform =
                    "translate3d(0, 0, 0) " +
                    "scale3d(1, 1, 1) ";
                scale = 1;
                last_scale = 1;
            }
        } catch (err) {}
        el.style.webkitTransform = transform;
        transform = "";
    }

    //pan    
    if (scale != 1) {
        posX = last_posX + ev.deltaX;
        posY = last_posY + ev.deltaY;
        max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
        max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
        if (posX > max_pos_x) {
            posX = max_pos_x;
        }
        if (posX < -max_pos_x) {
            posX = -max_pos_x;
        }
        if (posY > max_pos_y) {
            posY = max_pos_y;
        }
        if (posY < -max_pos_y) {
            posY = -max_pos_y;
        }
    }


    //pinch
    if (ev.type == "pinch") {
        scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
    }
    if(ev.type == "pinchend"){last_scale = scale;}

    //panend
    if(ev.type == "panend"){
    last_posX = posX < max_pos_x ? posX : max_pos_x;
    last_posY = posY < max_pos_y ? posY : max_pos_y;
    }

    if (scale != 1) {
        transform =
            "translate3d(" + posX + "px," + posY + "px, 0) " +
            "scale3d(" + scale + ", " + scale + ", 1)";
    }

    if (transform) {
        el.style.webkitTransform = transform;
    }
});
}

// ------------------------ setup triggers-----------------------------   
function getTriggers(){

$('slide').each(function(index){

	triggers.push({
				triggerin: $(this).attr('data-triggerin'),
				triggerout: $(this).attr('data-triggerout'),
				color: $(this).attr('data-color')
		   		});
     
   
})

}

function black(){
$('body').removeClass('white black trans');

$('body').addClass('black');
// $('menu > a').removeClass('current');
// $('scrollIndicator').css('opacity', 1);
console.log('add black');
}
function white(){
$('body').removeClass('white black trans');
$('body').addClass('white');
// $('menu > a').removeClass('current');
// $('scrollIndicator').css('opacity', 1);
console.log('add white');
}        


// ------------------------ setup skrollr-----------------------------       		
function skrollrSetup(){
console.log(triggers);

	var currentSlide = '';
	var totalHeight = $('body').css('height');
	console.log(totalHeight);
	var doit;
      // Init Skrollr
	        var s = skrollr.init(

				{ 
					smoothScrolling:true,
	 				render: function(data) {
        				//Log the current scroll position.
       					 $('#countTop').html(data.curTop);
       				
       					 console.log('progress'+data.curTop);
       				 
       	 
       


			
				
					
// ------------------------ menu hide-----------------------------
						if(data.curTop > 100){
  						 $('menu').addClass('hide');
               			} else {
  						 $('menu').removeClass('hide');
               			}
               		
               			clearTimeout(doit);
  						doit = setTimeout(setTriggers, 50);
  					
							function setTriggers(){
					 		console.log('set triggers');

               				
           
// ------------------------ menu color and active slide-----------------------------
							$.each(triggers, function( index, value ) {
  									currentPos = data.curTop;
  									console.log('change colors');
								if(currentPos > triggers[index].triggerin  && currentPos < triggers[index].triggerout){
									if(triggers[index].color == "black"){
									black();
									} else {
									white();
									}
								// $('menu > a').eq(index).addClass('current');
								}
							console.log(triggers[index].triggerin+'<'+index+'>'+triggers[index].triggerout+'color'+triggers[index].color);

							});
					
							}

               		
   		 		}
				}
			); 


//The options (second parameter) are all optional. The values shown are the default values.
			skrollr.menu.init(s, {
    //skrollr will smoothly animate to the new position using `animateTo`.
    		animate: true,

    //The easing function to use.
   			 easing: 'sqrt',

    //How long the animation should take in ms.
   			 duration: function(currentTop, targetTop) {
    	    //By default, the duration is hardcoded at 500ms.
        return Math.abs(currentTop - targetTop) * 5;

        //But you could calculate a value based on the current scroll position (`currentTop`) and the target scroll position (`targetTop`).
        //return Math.abs(currentTop - targetTop) * 10;
    },

    //If you pass a handleLink function you'll disable `data-menu-top` and `data-menu-offset`.
    //You are in control where skrollr will scroll to. You get the clicked link as a parameter and are expected to return a number.
    handleLink: function(link) {
  
  	link = link.toString().split('"');
    link = link[0].toString().split('#');
	console.log($('#'+link[1]).attr('data-triggerin'));
     return $('#'+link[1]).attr('data-triggerin');
       //  return 400; Hardcoding 400 doesn't make much sense.
    },
    //By default skrollr-menu will only react to links whose href attribute contains a hash and nothing more, e.g. `href="#foo"`.
    //If you enable `complexLinks`, skrollr-menu also reacts to absolute and relative URLs which have a hash part.
    //The following will all work (if the user is on the correct page):
    //http://example.com/currentPage/#foo
    //http://example.com/currentDir/currentPage.html?foo=bar#foo
    ///?foo=bar#foo
    complexLinks: false,

    //This event is triggered right before we jump/animate to a new hash.
    change: function(newHash, newTopPosition) {
        //Do stuff
        console.log(newHash, newTopPosition)
        currentSlide = newHash
    },

    //Add hash link (e.g. `#foo`) to URL or not.
    updateUrl: true //defaults to `true`.
});  
}


   $(document).ready(function(){

		
		parallaxSetup();
		 menuSetup();
		

	});
	// ------------------------ on load-----------------------------

  $(window).load(function(){
  		getTriggers();
		skrollrSetup();
		setupScrollHor();
		var popups = document.getElementsByClassName('popup');
		hammerIt(popups);
			 var currentMenu = 0;
  
  
  
		 $('.horLink').click(function(e){
		e.preventDefault();
		scrollContainer = $(this).parent().siblings('.scrollhorSlide').attr('id');
		$('#'+scrollContainer).siblings('menuhor').children('.horLink').removeClass('active');
		$(this).addClass('active');
		prevSlide = $('#'+scrollContainer).attr('current');

		that = parseInt($(this).index()-1);
		$(this).parent().siblings('.scrollhorSlide').attr('current', that);
		thisSlide = $('#'+scrollContainer).attr('current');


		console.log(prevSlide +'..'+ thisSlide);


		offset = thisSlide*100;
		distance = Math.abs(prevSlide - thisSlide);
		time = distance*0.5;
		margin = '-'+offset+'vw';

		$('#'+scrollContainer).css('transition', 'all '+time+'s ease-in-out').css('margin-left', margin);

		console.log(that+'clicked -'+offset+'vw - distance - '+distance+'menunr - '+scrollContainer);
		currentMenu = that;
		return false;
})
		$('body').css('opacity','1');
	});