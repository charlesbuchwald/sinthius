
function parallaxSetup(){
// ------------------------ SETUP MOTION SLIDES-----------------------------
var totalSlides = jQuery('slide').length;
var scrollCount = 0;
var slideAttr = [];
var object = {};

jQuery('slide').each(function(index, object) {
var start = scrollCount;
var startEnd = (400 + scrollCount);
var finish = (1000 + scrollCount);
var finishEnd = (1400 + scrollCount);
var color = $(this).attr('data-color');
var object = {
[start] :"transform:translate(0,150vh);",
 [startEnd] :"transform:translate(0,0vh);",
'triggerin': startEnd,
[finish] :"transform:translate(0,0vh);",
'triggerout' : finish, 
[finishEnd] :"transform:translate(0,-150vh);",
'color': color};
console.log(object);
       jQuery.each(object,function(attribute, value){
      	//console.log(attribute+'-'+value);


        jQuery('slide').eq(index).attr('data-'+attribute, value);
   		})
   		scrollCount = scrollCount + 900;
   		object = {};
	});
	
	// ----slide override-----
// ------ SETUP SLIDE 1-------
// 
// 
// var startEnd = (400 + scrollCount);
// var finish = (1000 + scrollCount);
// var finishEnd = (1400 + scrollCount);
// var slide1Attr = {
// [scrollCount] :"transform:translate(0,150vh);",
//  [startEnd] :"transform:translate(0,0vh);",
// 'triggerin': [startEnd],
// [finish] :"transform:translate(0,0vh);",
// 'triggerout' : [finish], 
// [finishEnd] :"transform:translate(0,-150vh);",
// 'color':"black"};
// slideAttr.push(slide1Attr);
// scrollCount = scrollCount + 1400;
// 
// // ------ SETUP SLIDE 2-------
// var start = scrollCount;
// var startEnd = (400 + scrollCount);
// var finish = (1000 + scrollCount);
// var finishEnd = (1400 + scrollCount);
// var slide3Attr = {
// [start] :"transform:translate(0,150vh);",
//  [startEnd] :"transform:translate(0,0vh);",
// 'triggerin': [startEnd],
// [finish] :"transform:translate(0,0vh);",
// 'triggerout' : [finish], 
// [finishEnd] :"transform:translate(0,-150vh);",
// 'color':"black"};
// slideAttr.push(slide3Attr);
// scrollCount = scrollCount + 1400;
// // ------ SETUP SLIDE 3-------
// var start = scrollCount;
// var startEnd = (400 + scrollCount);
// var finish = (1000 + scrollCount);
// var finishEnd = (1400 + scrollCount);
// var slide2Attr = {
// [start] :"transform:translate(0,150vh);",
//  [startEnd] :"transform:translate(0,0vh);",
// 'triggerin': [startEnd],
// [finish] :"transform:translate(0,0vh);",
// 'triggerout' : [finish], 
// [finishEnd] :"transform:translate(0,-150vh);",
// 'color':"black"};
// slideAttr.push(slide2Attr);
// scrollCount = scrollCount + 1400;
// // ------ SETUP SLIDE 4-------
// var slide4Attr = {
// 
// '0':"transform:translate(0,100vh);",
// '1900':"transform:translate(0,100vh);",
// '2100':"transform:translate(0,0vh);",
// 
// '2500':"transform:translate(0,0vh);",
// '2700':"transform:translate(0,-170vh);",
// 
// 'triggerin':"2100",
// 'triggerout':"2500",
// 'color':"black"};
// slideAttr.push(slide4Attr);
// 
// 
// // ------ SETUP SLIDE 5-------
// var slide5Attr = {
// '0':"transform:translate(0,110vh);",
// '2500':"transform:translate(0,110vh);",
// '2700':"transform:translate(0,0vh);",
// 
// '3100':"transform:translate(0,0vh);",
// '3300':"transform:translate(0,-110vh);",
// 'triggerin':"2700",
// 'triggerout':"3100",
// 'color':"black"};
// slideAttr.push(slide5Attr);
// 
// 
// // ------ SETUP SLIDE 6-------
// var slide6Attr = {
// 
// '3100':"transform:translate(0,110vh);",
// '3300':"transform:translate(0,0vh);",
// '3700':"transform:translate(0,0vh);",
// '3900':"transform:translate(0,-120vh);",
// 'triggerin':"3300",
// 'triggerout':"3700",
// 'color':"black"};
// slideAttr.push(slide6Attr);
// // ------ SETUP SLIDE 7-------
// var slide7Attr = {
// 
// '3700':"transform:translate(0,100vh);",
// '3900':"transform:translate(0,0vh);", 
// '4300':"transform:translate(0,0vh);", 
// '4500':"transform:translate(0,-110vh);",
// 
// 'triggerin':"3900",
// 'triggerout':"4300",
// 'color':"black"};
// slideAttr.push(slide7Attr);
// // ------ SETUP SLIDE 8-------
// var slide8Attr = {
// 
// '4300':"transform:translate(0,150vh);", 
// '4500':"transform:translate(0,0vh);", 
// '4900':"transform:translate(0,0vh);",
// '5100':"transform:translate(0,-110vh);",
// 'triggerin':"4500",
// 'triggerout':"4900",
// 'color':"black"};
// slideAttr.push(slide8Attr);
// // ------ SETUP SLIDE 9-------
// var slide9Attr = {
// 
// '4900':"transform:translate(0,110vh);", 
// '5100':"transform:translate(0,0vh);", 
// '5500':"transform:translate(0,0vh);",
// 
// 'triggerin':"5100",
// 'triggerout':"5500",
// 'color':"white"};
// slideAttr.push(slide9Attr);
// // ------ SETUP SLIDE 10-------
// var slide10Attr = {
// 
// '0':"transform:translate(0,110vh);", 
// '3299':"transform:translate(0,110vh);", 
// '3300':"transform:translate(0,0vh);", 
// '3700':"transform:translate(0,0vh);",
// '4000':"transform:translate(0,0vh);",
// '4100':"transform:translate(0,0vh);",
// '4101':"transform:translate(0,-110vh);",
// 'triggerin':"3400",
// 'triggerout':"3700",
// 'color':"black"};
// slideAttr.push(slide10Attr);
// // ------ SETUP SLIDE 11-------
// var slide11Attr = {
// 
// '0':"transform:translate(0,110vh);", 
// '3700':"transform:translate(0,110vh);", 
// '3800':"transform:translate(0,0vh);", 
// 
// '4100':"transform:translate(0,0vh);",
// '4200':"transform:translate(0,-110vh);",
// 'triggerin':"3800",
// 'triggerout':"4100",
// 'color':"black"};
// slideAttr.push(slide11Attr);
// // ------ SETUP SLIDE 12-------
// var slide12Attr = {
// 
// '0':"transform:translate(0,110vh);", 
// '4099':"transform:translate(0,110vh);", 
// '4100':"transform:translate(0,0vh);", 
// 
// '4500':"transform:translate(0,0vh);",
// 'triggerin':"4200",
// 'triggerout':"4500",
// 'color':"black"};
// slideAttr.push(slide12Attr);
// // ------ SETUP SLIDE 13-------
// var slide13Attr = {
// 
// '0':"transform:translate(0,110vh);",
// '4400':"transform:translate(0,110vh);",  
// '4500':"transform:translate(0,0vh);", 
// '4800':"transform:translate(0,0vh);", 
// 
// '5000':"transform:translate(0,0vh);",
// 'triggerin':"4500",
// 'triggerout':"4800",
// 'color':"white"};
// slideAttr.push(slide13Attr);
// ------ APPLY MOTION-------
  
    
// ------------------------ SETUP SLIDES CONTENT DOMINO DELAY  -----------------------------
var delay = 80;
jQuery('slide').each( function(index) {
// console.log('slidecount'+(index+1));
i = 0;
 		inTrigin = 0;
		 outTrigin = 0;
		 inTrigout = 0;
		 outTrigout = 0;
		 inTrig = parseInt(jQuery('slide').eq(index).attr('data-triggerin'));
		 outTrig = parseInt(jQuery('slide').eq(index).attr('data-triggerout'));
		inTrigin =  inTrig + (delay*i) - 200;
       outTrigin =  inTrig + (delay*i);
       	inTrigout = outTrig + (delay*i) +1;
       outTrigout = outTrig + (delay*i) + 200;
       // ------------------------ SETUP parent dependent in and out animation  -----------------------------
		 jQuery(this).find('.animate').each( function(count) {
		jQuery(this).attr('animecount','slidecount'+(index+1)+'animate count'+count);
 		typeOfAnimIn = jQuery(this).attr('animatein');
 		typeOfAnimOut = jQuery(this).attr('animateout');
 		
      if(typeOfAnimIn == 'top'){
      transIn = 'transform:translate(0vw,-50vh)';
      } else if (typeOfAnimIn == 'bot'){
       transIn = 'transform:translate(0vw,50vh)';
      }  else if (typeOfAnimIn == 'left'){
       transIn = 'transform:translate(-50vw,0vh)';
      } else if (typeOfAnimIn == 'right'){
       transIn = 'transform:translate(50vw,0vh)';
      } else {
       transIn = 'transform:translate(0vw,0vh)';
      }
        if(typeOfAnimOut == 'top'){
      transOut = 'transform:translate(0vw,-50vh)';
      } else if (typeOfAnimOut == 'bot'){
       transOut = 'transform:translate(0vw,50vh)';
      }  else if (typeOfAnimOut == 'left'){
       transOut = 'transform:translate(-50vw,0vh)';
      } else if (typeOfAnimOut == 'right'){
       transOut = 'transform:translate(50vw,0vh)';
      } else {
       transOut = 'transform:translate(0vw,0vh)';
      }
     
      
       jQuery('slide').eq(index).children('.animate').eq(i).attr('data-'+inTrigin, transIn).attr('data-'+outTrigin, 'transform:translate(0vw,0vh)');
   	 jQuery('slide').eq(index).children('.animate').eq(i).attr('data-'+inTrigout, 'transform:translate(0vw,0vh)').attr('data-'+outTrigout, transOut).attr('animatecount',index+1);
	
   		i++;
   		});

   	       // ------------------------ SETUP parent dependent zooming elements in and out -----------------------------

 	
		
   		});
jQuery('slide').each( function(index) {

i = 0;
 		inTrigin = 0;
		 outTrigin = 0;
		 inTrigout = 0;
		 outTrigout = 0;
		 inTrig = parseInt(jQuery(this).attr('data-triggerin'));
		 outTrig = parseInt(jQuery(this).attr('data-triggerout'));
		inTrigin =  inTrig + (delay*i) - 200;
       outTrigin =  inTrig + (delay*i);
       	inTrigout = outTrig + (delay*i) +1;
       outTrigout = outTrig + (delay*i) + 200;
     
       // ------------------------ SETUP parent dependent running elements while slide is locked in  -----------------------------


		jQuery(this).find('.running').each( function(count) {
		
			
			 runTrig = parseInt(inTrig);
			Trigrun = parseInt(outTrig) + 1;
			initTrans = 'transform:translate(0vw,0vh)';
			runningDir = jQuery(this).attr('running');
			    if(runningDir == 'top'){
     			 run = 'transform:translate(0vw,-50vh)';
     			 } else if (runningDir == 'bot'){
     			  run = 'transform:translate(0vw,50vh)';
     			 }  else if (runningDir == 'left'){
     			  run = 'transform:translate(-50vw,0vh)';
     			 } else if (runningDir == 'right'){
     			  run = 'transform:translate(50vw,0vh)';
     			  } else if (runningDir == 'topfast'){
     			  run = 'transform:translate(0vw,-100vh)';
     			  } else if (runningDir == 'toptiny'){
     			  run = 'transform:translate(0vw,-5vh)';
     			  } else if (runningDir == 'tinyzoom'){
     			  initTrans = 'transform:scale(1,1)';
     			  run = 'transform:scale(1.1,1.1)';
     			 } else if (runningDir == 'margin-top'){
     			 maxoffset =  parseInt(jQuery(this).height() - jQuery(this).parent('.text').height()) * 1.3;
     			 // console.log('text-scroll offset >'+ maxoffset +'holder'+jQuery(this).height()+'textslide'+jQuery(this).parent('.text').height());
     			  run = 'margin-top: -'+ maxoffset +'px;';
     			  initTrans = 'margin-top: 0px';
     			  runTrig = runTrig + 100;
     			 }
     			 else {
     			  run = 'transform:translate(0vw,0vh)';
     			 }
		 	
    		   	 jQuery('slide').eq(index).find('.running').eq(count).attr('data-'+runTrig, initTrans).attr('data-'+Trigrun, run).attr('runcount',count+1).attr('data-0',"transform:translate(0,0);").attr('running', 'slidecount'+(index+1)+'count'+(count+1)+'values> data-'+runTrig+'data-'+Trigrun);
				run = '';
				runTrig = 0;
				Trigrun = 0;
				
			});
   	       // ------------------------ SETUP parent dependent zooming elements in and out -----------------------------

 	
		
   		});

	
// ------------------------MANUAL SETUP SLIDES CONTENT  -----------------------------
// var contentAttr = [];
// var content1Attr = {
// '0':"transform:translate(0,200vh);",
// '200':"transform:translate(0,0vh);"};
// contentAttr.push(content1Attr);
// var content2Attr = {
// '0':"transform:translate(0,100vh);",
// '420':"transform:translate(-100%,0);",
// '500':"transform:translate(0,0);",
// 
// 
// };
// contentAttr.push(content2Attr);
// var content3Attr = {
// '0':"transform:translate(0,100vh);",
// '450':"transform:translate(-100%,0);",
// '550':"transform:translate(0,0);",
// };
// contentAttr.push(content3Attr);
//   var content4Attr = {
// '750':"transform:translate(-100%,0vh);",
// '850':"transform:translate(0,0vh);"
// };
// contentAttr.push(content4Attr);
//   var content4_1Attr = {
// '1050':"transform:translate(-100%,0vh);",
// '1150':"transform:translate(0,0vh);"
// };
// contentAttr.push(content4_1Attr);
// var content5Attr = {
// '1450':"transform:translate(-100%,0vh);",
// '1550':"transform:translate(0,0vh);"
// };
// contentAttr.push(content5Attr);
//     jQuery.each(contentAttr, function(index, object) {
//        jQuery.each(object,function(attribute, value){
//         jQuery('.animate').eq(index).attr('data-'+attribute, value).attr('animatecount',index+1);
//    		})
// 	});
// 	
// ------------------------ SETUP SLIDES BACKGROUND-----------------------------
var backAttr = [];

var back1Attr = {
'0':"transform:translate(0,0vh);",
'200':"transform:translate(0,0vh);",
'450':"transform:scale(1.2,1.2);"};
backAttr.push(back1Attr);

    jQuery.each(backAttr, function(index, object) {
       jQuery.each(object,function(attribute, value){

        jQuery('#ORIGINS_OF_WHEAT').children('.background').attr('data-'+attribute, value);
  		 })
	});
	
// ------------------------ SETUP SVG LINES-----------------------------
var svgAttr = [];

var svg1Attr = {
'3750':"stroke-dashoffset:1000;stroke-dasharray:1000,1000;",
'3900':"stroke-dashoffset:0; stroke-dasharray: 4, 7;"
};
svgAttr.push(svg1Attr);

    jQuery.each(svgAttr, function(index, object) {
       jQuery.each(object,function(attribute, value){

        jQuery('svg').find('path').attr('data-'+attribute, value);
  		 })
	});	
// ------------------------ SETUP INSTRUCTIONS-----------------------------

// -----
}