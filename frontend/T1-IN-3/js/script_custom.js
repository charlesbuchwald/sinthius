// ------------------------ SETUP SLIDES CONTENT DOMINO DELAY  -----------------------------
$(document).ready(function(){
var delay = 80;
$('slide').each( function(index) {
 console.log('slidecount'+(index+1));
 $(this).addClass('slide'+index);
		 inTrig = parseInt($('slide').eq(index).attr('data-triggerin'))+delay;
		 outTrig = parseInt($('slide').eq(index).attr('data-triggerout'))+delay;
	
       // ------------------------ SETUP parent dependent in and out animation  -----------------------------
		 $(this).children('div').each( function(count) {
		$(this).attr('animecount','slidecount'+(index+1)+'animate count'+count);
 		offset = 10*count;
       transIn = 'transform:translate('+offset+'vw,0vh)';
       $(this).attr('data-'+inTrig, transIn).attr('data-'+outTrig, 'transform:translate(0vw,0vh)');
      })
     
   

});
$('.languageSwitch').click(function(e){
$(this).toggleClass('english');
	if($(this).hasClass('english')){
	$('.english').css('display','block');
	$('.spanish').css('display','none');
	} else {
	$('.spanish').css('display','block');
	$('.english').css('display','none');
	}
})
});	

$(window).load(function(){
$('body').css('opacity','1');
 var s = skrollr.init(

				{ 
					smoothScrolling:true,
					scale: 3,
	 				render: function(data) {
        				//Log the current scroll position.
       					 $('#countTop').html(data.curTop);
       				
       					  console.log('progress'+data.curTop);
       				}
				}
			); 
})
