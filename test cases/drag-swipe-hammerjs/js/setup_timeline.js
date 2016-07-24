  console.log('js loaded');
  var triggers = [];
	 var currentMenu = 0;
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
    
    });
        	
$('#scrollhorSlide'+(index+1)).hammer().bind("swiperight", function(event) {
    console.log("You swiped right - " + $(this).css('margin-left') );
    });
		
		$(this).children('div').not('.indicator').each(function(i) {
				 console.log('setup scroll hor '+index +'slide'+i);

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
$(this).siblings('.slideIn.caption').toggleClass('out');
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


$('.slideIn').click(function(e){
e.preventDefault();
that = $(this).attr('id');
$(this).toggleClass('out');
console.log(that+'clicked');
return false;
})

}
        		

// ------------------------ setup triggers-----------------------------   
function getTriggers(){
triggers.push({
			triggerin: 'filler',
			triggerout: 'filler',
			color: 'filler'
		   });
$('menu > a').not('.menuHide').each(function(index){

triggers.push({
			triggerin: $(this).attr('data-triggerin'),
			triggerout: $(this).attr('data-triggerout'),
			color: $(this).attr('data-color')
		   });
     
   
})

}
function trigger(number){


}
function black(){
$('body').removeClass('white black trans');

$('body').addClass('black');
$('menu > a').removeClass('current');
$('scrollIndicator').css('opacity', 1);
}
function white(){
$('body').removeClass('white black trans');
$('body').addClass('white');
$('menu > a').removeClass('current');
$('scrollIndicator').css('opacity', 1);
}        

// ------------------------ setup skrollr-----------------------------       		
function skrollrSetup(){
getTriggers();

	var currentSlide = '';
	var totalHeight = $('body').css('height');
	console.log(totalHeight);
      // Init Skrollr
	        var s = skrollr.init(

				{ 
					smoothScrolling:true,
	 				render: function(data) {
        			//Log the current scroll position.
       				 $('#counter').html(data.curTop);
       				
       				 console.log('progress'+data.curTop);
       				 
       	 
       


			
				
					
// ------------------------ menu hide-----------------------------
					if(data.curTop > 100){
  						 $('menu').addClass('hide');
               		} else {
  						 $('menu').removeClass('hide');
               		}
               		
// ------------------------ top bottom indicators hide/show-----------------------------
               		if(data.curTop < triggers[1].triggerout){
  						 $('.scrolltop').css('opacity', 0);
               		} else {
  						 $('.scrolltop').css('opacity', 1);
               		}
               		if(data.curTop > triggers[3].triggerin){
  						 $('.scrollbottom').css('opacity', 0);
               		} else {
  						 $('.scrollbottom').css('opacity', 1);
               		}
               		currentPos = data.curTop;
           
// ------------------------ menu color and active slide-----------------------------
               		if(currentPos > -1 && currentPos < triggers[1].triggerout){
               			if(triggers[1].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(1).addClass('current');
  						console.log(triggers[1].triggerin+'<1>'+triggers[1].triggerout+'color'+triggers[1].color);
               		}
               		
               		else if(currentPos > triggers[2].triggerin && currentPos < triggers[2].triggerout){
               			if(triggers[2].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(2).addClass('current');
  						console.log(triggers[2].triggerin+'<2>'+triggers[2].triggerout+'color'+triggers[2].color);
               		}
               		
               		else if(currentPos > triggers[3].triggerin && currentPos < triggers[3].triggerout){
               			if(triggers[3].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(3).addClass('current');
  						console.log(triggers[3].triggerin+'<3>'+triggers[3].triggerout+'color'+triggers[3].color);
               		}
               		
               		else if(currentPos > triggers[4].triggerin && currentPos < triggers[4].triggerout){
               			if(triggers[4].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(4).addClass('current');
  						console.log(triggers[4].triggerin+'<4>'+triggers[4].triggerout+'color'+triggers[4].color);

               		}
               		
               		else if(currentPos > triggers[5].triggerin && currentPos < triggers[5].triggerout){
               			if(triggers[5].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(5).addClass('current');
  						console.log(triggers[5].triggerin+'<5>'+triggers[5].triggerout+'color'+triggers[5].color);

               		}
               		
               		else if(currentPos > triggers[6].triggerin && currentPos < triggers[6].triggerout){
               			if(triggers[6].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(6).addClass('current');
  						console.log(triggers[6].triggerin+'<6>'+triggers[6].triggerout+'color'+triggers[6].color);

               		}
               		
               		else if(currentPos > triggers[7].triggerin && currentPos < triggers[7].triggerout){
               			if(triggers[7].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(7).addClass('current');
  						console.log(triggers[7].triggerin+'<7>'+triggers[7].triggerout+'color'+triggers[7].color);

               		}
               		
               		else if(currentPos > triggers[8].triggerin && currentPos < triggers[8].triggerout){
               			if(triggers[8].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(8).addClass('current');
   						console.log(triggers[8].triggerin+'<8>'+triggers[8].triggerout+'color'+triggers[8].color);

               		}
               		
               		else if(currentPos > triggers[9].triggerin && currentPos < triggers[9].triggerout){
               			if(triggers[9].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(9).addClass('current');
  						console.log(triggers[9].triggerin+'<9>'+triggers[9].triggerout+'color'+triggers[9].color);

               		}
               		
               		else if(currentPos > triggers[10].triggerin && currentPos < triggers[10].triggerout){
               			if(triggers[10].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(10).addClass('current');
  						console.log(triggers[10].triggerin+'<10>'+triggers[10].triggerout+'color'+triggers[10].color);

               		}
               		
               		else if(currentPos > triggers[11].triggerin && currentPos < triggers[11].triggerout){
               			if(triggers[11].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(11).addClass('current');
  						console.log(triggers[11].triggerin+'<11>'+triggers[11].triggerout+'color'+triggers[11].color);

               		}
               		
               		else if(currentPos > triggers[12].triggerin && currentPos < triggers[12].triggerout){
               			if(triggers[12].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(12).addClass('current');
  						console.log(triggers[12].triggerin+'<12>'+triggers[12].triggerout+'color'+triggers[12].color);

               		}
               		
               		else if(currentPos > triggers[13].triggerin && currentPos < triggers[13].triggerout){
               			if(triggers[13].color == "black"){
               				black();
               				} else {
               				white();
               			}
               			$('menu > a').eq(13).addClass('current');
  						console.log(triggers[13].triggerin+'<13>'+triggers[13].triggerout+'color'+triggers[13].color);

               		} else {
               		$('scrollIndicator').css('opacity', 0);
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

		// 
// 		parallaxSetup();
		// menuSetup();
		

	});
	// ------------------------ on load-----------------------------

  $(window).load(function(){
		// skrollrSetup();
		setupScrollHor();
		
  
  
  
		 $('.horLink').click(function(e){
e.preventDefault();
menuID = $(this).parent().parent().parent().attr('id');
menuNr = $('#'+menuID).index();

$(this).siblings('.horLink').removeClass('active');
that = $(this).attr('class').split(" ")[1];
offset = that*100;
distance = Math.abs(currentMenu - that);
time = distance*0.5;
margin = '-'+offset+'vw';
$(this).addClass('active');
$('#'+menuID).find('.scrollhorSlide')
.css('transition', 'all '+time+'s ease-in-out')
.css('margin-left', margin);

console.log(that+'clicked -'+offset+'vw - distance - '+distance+'menunr - '+menuNr+menuID);
currentMenu = that;
return false;
})
		$('body').css('opacity','1');
	});