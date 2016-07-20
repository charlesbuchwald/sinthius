$(window).load(function(){
$('body').css('opacity','1');
console.log('loaded');
 var speed = 40;
    var lastScrollLeft = 0;
    // higher variation = faster acceleration
    function pos(variation) {
        newPosition = (scrollPercent * (speed * variation)) - (speed * variation);
        return newPosition;
    }
    $(window).scroll(function(e) {
        var scrollNum = $(window).scrollLeft();
         // slide 1
     if(scrollNum > 0 && scrollNum < $(window).width()*1.5){
             scrollPercent = $(window).scrollLeft() / $(window).width();

$('.slide1 > .text ').css("transform", 'translate('+pos(-0.5)+'vw ,0)');
$('.slide1 > .image ').css("transform", 'translate('+pos(-2)+'vw ,0)');
     }
        
   console.log('pos'+ scrollNum + 'percent'+scrollPercent);
    console.log('pos'+ scrollNum + 'percent'+scrollPercent);
       
            // downscroll
            
         
        
        lastScrollTop = scrollNum;
    })
})

$(document).ready(function() {
   $('slide').each(function(i){
   
   		 $(this).css("left", (i*100)+'vw');
   
   })
})
