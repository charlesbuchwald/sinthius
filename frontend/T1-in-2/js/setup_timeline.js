  console.log('js loaded');

// ------------------------ SETUP Standby-----------------------------
  function standBy(){
   

    // idleTimer() takes an optional object argument that defines any/all setting
    jQuery( document ).idleTimer( {
        timeout:10000, 
        idle:true,
        events:'touchstart'
    });

   jQuery( document ).on( "idle.idleTimer", function(event, elem, obj){
       stopStandBy();
    });

    jQuery( document ).on( "active.idleTimer", function(event, elem, obj, triggerevent){
       startStandBy();
    });


}
 function startStandBy(){
 
 jQuery('standby').css('display','block');

 jQuery('standby').css('opacity',1);
 console.log('standby On');
 }
 function stopStandBy(){
 
 jQuery('standby').css('opacity',0);
  setTimeout(function () {
    jQuery('standby').css('display','none');
}, 500);
  console.log('standby Off');
 }
 
 // ------------------------ scrollhor-----------------------------
 function setupScrollHor(){
	 
	 jQuery('.scrollhorSlide').each(function() {
	 var width = 0;
    	
		
		jQuery(this).children('div').each(function() {
    	width += jQuery(this).outerWidth( true );
    	jQuery(this).attr('jswidth',jQuery(this).outerWidth( true ));
		});
		jQuery(this).css('width',width+'px')
		});
  
  }
  
function menuSetup(){
// ------------------------ SETUP Menu-----------------------------

jQuery('slide').each(function(){

var newMenuItem = jQuery(this).attr('id')+'';
var newMenuItemTriggerIn = jQuery(this).attr('data-triggerin');
var newMenuItemTriggerOut = jQuery(this).attr('data-triggerout');


newMenuItemTitle = newMenuItem.replace(/_/g , " ");
newMenuItemTitle = newMenuItemTitle.replace(/plus/g , "&");
jQuery('menu').append('<a href="#'+newMenuItem+'"><div class="menuDot">●</div><div class="menuTitle">'+newMenuItemTitle+'</div></a>');

})

// ------------------------ SETUP BUTTONS-----------------------------

jQuery('.closeParent').click(function(e){
e.preventDefault();
jQuery(this).parent().fadeOut(800); 
return false;
})

jQuery('.flag.one').click(function(e){
e.preventDefault();
jQuery('.popup.one').css({'opacity': '1', 'display':'block'});
console.log('flag one click');
return false;
})

jQuery('.menuHide').click(function(e){
e.preventDefault();
jQuery(this).parent().toggleClass('hide');
if(!jQuery(this).hasClass()){
jQuery('.slideIn.caption').removeClass('out');
}
return false;
})

jQuery('.captionHide').click(function(e){
e.preventDefault();
jQuery(this).siblings('.slideIn.caption').toggleClass('out');
jQuery(this).toggleClass('out');
jQuery('menu').addClass('hide');
console.log('slide caption click');
return false;
})

jQuery('.slideBtn').click(function(e){
e.preventDefault();
that = jQuery(this).attr('id')+'';
slide = that.replace(/Btn/g , "In");
jQuery('.slideIn').not('#'+slide).removeClass('out');
jQuery('#'+slide).toggleClass('out');
console.log(that+'clicked'+slide+'opened');
return false;
})


jQuery('.slideIn').click(function(e){
e.preventDefault();
that = jQuery(this).attr('id');
jQuery(this).toggleClass('out');
console.log(that+'clicked');
return false;
})

}

function skrollrSetup(){
	var currentSlide = '';
	var totalHeight = jQuery('body').css('height');
	console.log(totalHeight);
      // Init Skrollr
	        var s = skrollr.init(

				{ 
					smoothScrolling:true,
	 				render: function(data) {
        			//Log the current scroll position.
       				 jQuery('#counter').html(data.curTop);
       				 progress = (data.curTop/totalHeight)*100;
       				 jQuery('#progress').css('height',progress+'%');
       				 console.log('progress'+progress);
       				 
       	 // ------------------------ menu hide-----------------------------
        // ------------------------ menu color-----------------------------


			function black(){
			jQuery('body').removeClass('white black trans');
			jQuery('body').addClass('black');
			jQuery('menu > a').removeClass('current');

			}
			function white(){
			jQuery('body').removeClass('white black trans');
			jQuery('body').addClass('white');
			jQuery('menu > a').removeClass('current');

			}


					if(data.curTop > 100){
  						 jQuery('menu').addClass('hide');
               		} else {
  						 jQuery('menu').removeClass('hide');
               		}

               		if(data.curTop < 398){
               			white();
  						jQuery('menu > a').eq(1).addClass('current');
               		}
               		
               		if(data.curTop > 499 && data.curTop < 700){
               			black();
               			jQuery('menu > a').eq(2).addClass('current');
               		}
               		
               		if(data.curTop > 700 && data.curTop < 1300 ){
               			white();
  						 jQuery('menu > a').eq(3).addClass('current');
               		}
               		if(data.curTop > 1450 && data.curTop < 1700){
               			black();
  						 jQuery('menu > a').eq(4).addClass('current');
               		}
               			if(data.curTop > 1850 && data.curTop < 2000){
               			white();
  						 jQuery('menu > a').eq(5).addClass('current');
               		}
               		if(data.curTop > 2150 && data.curTop < 2300){
               			black();
  						 jQuery('menu > a').eq(6).addClass('current');
               		}
               		if(data.curTop > 2450 && data.curTop < 3350){
               			white();
  						 jQuery('menu > a').eq(7).addClass('current');
               		}
               		if(data.curTop > 3450 && data.curTop < 3600){
               			white();
  						 jQuery('menu > a').eq(8).addClass('current');
               		}
               		if(data.curTop > 3700 ){
               			black();
  						 jQuery('menu > a').eq(9).addClass('current');
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
	console.log(jQuery('#'+link[1]).attr('data-triggerin'));
     return jQuery('#'+link[1]).attr('data-triggerin');
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

function triggerSetup(){
var triggerFuncIf = '';
jQuery('slide').each(function(i){


var newMenuItemTriggerIn = jQuery(this).attr('data-triggerin');
var newMenuItemTriggerOut = jQuery(this).attr('data-triggerout');
var triggers = [];

var trigger1 = {
'triggerin':newMenuItemTriggerIn,
'triggerout':newMenuItemTriggerOut
};
triggers.push(trigger1);


 
})

}
   jQuery(document).ready(function(){

		menuSetup();
		parallaxSetup();
		triggerSetup();

	});
	// ------------------------ SETUP SKROLLR-----------------------------

  jQuery(window).load(function(){
		skrollrSetup();
		setupScrollHor();
		jQuery('body').css('opacity','1');
	});