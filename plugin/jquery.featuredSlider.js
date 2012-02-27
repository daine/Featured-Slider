(function( $ ){

	  var featuredSlider = function(element, options) {
		  
		  var elem = $(element);
		  var obj = this;
		  var settings = {
				  'startingItem'	: 1,
				  'dropdown'		: false,
				  'featuredWidth'	: 400,
				  'featuredHeight'	: 400,
				  'smallWidth'		: 300,
				  'smallHeight'		: 300,
				  'initialScroll'	: 'left',
				  'movedToCenter'	: $.noop,
				  'goForward'		: $.noop,
				  'elements'		: null
		  }
		  if (options) { 
		        $.extend( settings, options );
		  }
		  
		  
		  thisClass = elem.attr('class');
		  thisName = elem.attr('name');
		  thisID = elem.attr('ID');
		  base = elem;
		  var elements;
		  var i=1;
		  var totalWidth = 0;
		  var biggestHeight = 0;
		  var featuredWidth = 0;
		  var smallWidth = 0;
		  var currentItem = settings['startingItem'];
		  var selectedOuterWidth = 0;
		  
		  var minWidth = 980;
		  
		  if(elements == null){
			  elements = elem.children();
		  }
		  
		  var initialCount = elements.length;
		  
		  obj.init = function(){
			  base.parent().off("click", ".cleft");
			  base.parent().off("click", ".cright");
			  //Add wrap to this element
			  if(!base.parent().hasClass('carousel-container')){
				  base.wrap('<div class="carousel-container">');
				  base.parent().prepend('<div class="carouselScroll cright"></div>');
				  base.parent().prepend('<div class="carouselScroll cleft"></div>');
			  }
			  //Add left and right buttons
			  obj.initBoxes(currentItem);
			  
			  // Push boxes to the right or left side before centering the image
			  var width = 0 - base.width();
			  if(settings['initialScroll'] == 'left'){
				  width = $(window).width();
			  }
			  if(width < minWidth) {
				  width = minWidth;
			  }			  
			  base.css('margin-left', width);
			  obj.centerImage();
			  
			  base.parent().on("click", ".cleft", function(){
//				  console.log('clicked left');
				  obj.goBackward();
			  });
			  base.parent().on("click", ".cright", function(){
//				  console.log('clicked right');
				  obj.goForward();
			  })
			  
			  // if window is resized, re-center (throttle for responsiveness)
			  var resizeTimer;
			  $(window).unbind('resize');
			  $(window).resize(function() {
			      clearTimeout(resizeTimer);
			      resizeTimer = setTimeout(function() {
					  
			    	  // reset window width
					  var width = $(window).width();
					  if(width < minWidth) {
						  width = minWidth;
					  }			
					  base.parent().width(width);		
					  
			    	  // center the image
					  marginLeft = (width / 2) - (selectedOuterWidth / 2) - ((smallWidth) * (currentItem -1));					  
					  base.animate({ 'margin-left': marginLeft });	    	  
			      }, 100);
			  });
		  }
		  
		  obj.initBoxes = function (featuredItemIndex){
			  //If there's a totalWidth set already, let's add it up
			  totalWidth+=totalWidth;
			  elements.each(function(index){
				  outerbox = $(this);
				  outerbox.wrap('<div class="outer_box"><div class="carousel-box">');
				  
				  //Place image in a container
				  outerbox.find('img').wrap('<div class="image_container">');
				  //Set image height and width
				  outerbox.find('img').load(function(){
					  img = $(this);
					  //Which one is bigger? Height or width?
					  if(img.height() > img.width()){
						  image_orientation = 'portrait';
					  }else if(img.height() < img.width()){
						  image_orientation = 'landscape';
					  }else{
						  image_orientation = 'square';
					  }
					  //Store original width and height data for this image
					  img.parent().append('<span class="imgwidth">'+img.width()+'</span>');
					  img.parent().append('<span class="imgheight">'+img.height()+'</span>');
					  if(index+1 == featuredItemIndex){
						  //Bigger image
						  //Fill up the box
						  if(image_orientation == 'portrait'){
							  img.width(settings['featuredWidth']);
							  margintop = 0 - (img.height() - settings['featuredHeight']) / 2;
							  img.css('margin-top', margintop);
						  }else if(image_orientation == 'landscape'){
							  img.height(settings['featuredHeight']);
							  marginleft = 0 - (img.width() - settings['featuredWidth']) / 2;
							  img.css('margin-left', marginleft);
						  }else{
							  img.height(settings['featuredHeight']);
						  }
					  }else{
						  //Fill up the box
						  if(image_orientation == 'portrait'){
							  img.width(settings['smallWidth']);
							  margintop = 0 - (img.height() - settings['smallHeight']) / 2;
							  img.css('margin-top', margintop);
						  }else if(image_orientation == 'landscape'){
							  img.height(settings['smallHeight']);
							  marginleft = 0 - (img.width() - settings['smallWidth']) / 2;
							  img.css('margin-left', marginleft);
						  }else{
							  img.height(settings['smallHeight']);
						  }
					  }

					  //We can only know the actual height of the box once the images have loaded...or can we?
					  if(img.parent().parent().parent().height() > biggestHeight){
						  biggestHeight = img.parent().parent().parent().parent().outerHeight(true);
					  }
					  img.parent().parent().parent().parent().height(biggestHeight);
				  });
				  
				  
				  //Set containing boxes
				  if(index+1 == featuredItemIndex){
					  if(settings['featuredHeight'] <= 1){					  
						  newheight = outerbox.find('img').height() * settings['featuredHeight'];
						  outerbox.find('.image_container').height(newheight);
						  
					  }else{
						  outerbox.find('.image_container').height(settings['featuredHeight']);
					  }
					  if(settings['featuredWidth'] <=1 ){
						  newwidth = outerbox.find('img').width() * settings['featuredWidth'];
						  outerbox.find('.image_container').width(newwidth);
					  }else{
						  outerbox.find('.image_container').width(settings['featuredWidth']);
					  }
					  //Set carousel box width
					  outerbox.parent().width(settings['featuredWidth']);					  
					  outerbox.parent().addClass('selected');
				  }else{
					  if(settings['smallHeight'] <= 1){
						  newheight = settings['smallHeight'] * outerbox.find('img').height();
						  outerbox.find('.image_container').height(newheight);
					  }else{
						  outerbox.find('.image_container').height(settings['smallHeight']);
					  }
					  
					  if(settings['smallWidth'] <= 1){
						  newwidth =  outerbox.find('img').width() * settings['smallWidth'];
						  outerbox.find('.image_container').height(newwidth);
					  }else{
						  outerbox.find('.image_container').width(settings['smallWidth']);
				  	  }
					  //Set carousel box width
					  outerbox.parent().width(settings['smallWidth']);
					  smallWidth = outerbox.parent().outerWidth(true);
				  }
				  
				  i++;
				  
				  totalWidth += outerbox.parent().parent().width();
			  }); //end children nodes
			  selectedOuterWidth = base.find('.selected').outerWidth(true);
			  base.height = base.find('.selected').outerHeight(true);

			  //Set carousel width
			  base.width(totalWidth);
			  
			  //Set window width
			  var width = $(window).width();
			  if(width < minWidth) {
				  width = minWidth;
			  }			
			  base.parent().width(width);
			  base.parent().css('overflow', 'hidden');
			  
			  obj.setTrackOptions();
			  obj.bindEvents();
		  }
		  
		  obj.centerImage = function(){
			  options.movedToCenter(base.find('.carousel-box.selected:first'));
			  var windowWidth = $(window).width();
			  if(windowWidth < minWidth) {
				  windowWidth = minWidth;
			  }						  
			  marginLeft = (windowWidth / 2) - (selectedOuterWidth / 2) - ((smallWidth) * (currentItem -1));

			  if(base.children().length > initialCount){
				  initialCount = base.children().length;
				  elements = base.children().not('.outer_box');
				  obj.initBoxes(currentItem);
			  }
			  
			  base.animate({
				  'margin-left': marginLeft
			  });			  
		  }
		  
		  obj.changeFeatured = function(el){
			  //Smaller image
			  //Changes to the previously featured box
			  //Set smaller image carousel box
			  el.parent().parent().find('.selected').animate({width: settings['smallWidth']}, 0, function(){
				 $(this).parent().animate({width: $(this).outerWidth(true)});
			  });
			  el.parent().parent().find('.selected').find('.image_container').animate({width: settings['smallWidth'], height: settings['smallHeight']}, 0);
			  
			  //Which one is bigger? Height or width?
			  if(el.parent().parent().find('.selected .imgheight').html() > el.parent().parent().find('.selected .imgwidth').html()){
				  image_orientation = 'portrait';
			  }else if(el.parent().parent().find('.selected .imgheight').html() < el.parent().parent().find('.selected .imgwidth').html()){
				  image_orientation = 'landscape';
			  }else{
				  image_orientation = 'square';
			  }
			  
			  //Fill up the box
			  if(image_orientation == 'portrait'){				  
				  
				  el.parent().parent().find('.selected img').animate({width: settings['smallWidth']}, 0, function(){
					  margintop = 0 - ($(this).height() - settings['smallHeight']) / 2;
					  $(this).animate({'margin-top': margintop});
				  });
			  }else if(image_orientation == 'landscape'){
				  el.parent().parent().find('.selected img').animate({height: settings['smallHeight']}, 0,  function(){
					  marginleft = 0 - ( $(this).width() - settings['smallWidth']) / 2;
				  	  $(this).animate({'margin-left': marginleft});
				  });
			  }else{
				  el.parent().parent().find('.selected img').animate({height: settings['smallHeight'], width: settings['smallWidth']}, 0,  function(){
					  marginleft = 0;
				  	  $(this).animate({'margin-left': marginleft});
				  });
			  }
			  el.parent().parent().find('.selected').removeClass('selected');
			  
			  //Changes to the new featured box
			  el.addClass('selected');
			  el.find('.image_container').animate({
				  'width':settings['featuredWidth'],
				  'height':settings['featuredHeight']
			  }, 0);
			  
			  
			  //Which one is bigger? Height or width?
			  if(el.find('img').height() > el.find('img').width()){
				  image_orientation = 'portrait';
			  }else if(el.find('img').height() < el.find('img').width()){
				  image_orientation = 'landscape';
			  }else{
				  image_orientation = 'square';
			  }
		  	
			  //Bigger image
			  //Fill up the box	
			  if(image_orientation == 'portrait'){
				  
				  el.find('img').animate({width: settings['featuredWidth']}, 0, function(){
					  margintop = 0 - ($(this).height() - settings['featuredHeight']) / 2;
					  $(this).animate({'margin-top': margintop});
				  });
				  
			  }else if(image_orientation == 'landscape'){
				  el.find('img').animate({height: settings['featuredHeight']},0, function(){
					  marginleft = 0 - ($(this).width() - settings['featuredWidth']) / 2;
					  $(this).animate({'margin-left': marginleft});
				  });
				  
			  }else{
				  el.find('img').width(settings['featuredWidth']);
				  el.find('img').height(settings['featuredHeight']);
			  }
			  
			  
			  el.animate({
				  width: settings['featuredWidth']
			  },0,  function(){
				  //Set outer_box and carousel boxes
				  el.parent().parent().parent().animate({
					  height: el.outerHeight(true)
					  },0);
				  el.parent().animate({
				  	  width: el.outerWidth(true)
			  		},0);
			  });					
			  
			  obj.setTrackOptions();
			  obj.centerImage();
			  
		  }
		  
		  obj.bindEvents = function(){			
			  base.find('.track_options').click( function(){
				  if(currentItem != ($(this).parent().parent().parent().prevAll().length + 1)){
					  currentItem = $(this).parent().parent().parent().prevAll().length + 1;
					  obj.changeFeatured($(this).parent().parent());
				  }
			  });
			  
		  }
		  
		  /*
		   * Track Options contain the big play button, and actions available for that track (ie love, hate, share, download) 
		   */
		  obj.setTrackOptions = function(){
			  base.find('.track_options').css('position', 'relative');
			  
			  base.find('.track_options').height(settings['smallHeight']);
			  base.find('.track_options').width(settings['smallWidth']);
			  base.find('.track_options').css('margin-top', 0 - settings['smallHeight']);
			  base.find('.track_options').css('padding-top', ((settings['smallWidth'] - base.find('.track_options .playpausebutton').outerHeight())/2));

			  base.find('.track_options').height(settings['smallHeight'] - ((settings['smallHeight'] - base.find('.track_options .playpausebutton').outerHeight())/2));
			  
			  base.find('.selected .track_options').height(settings['featuredHeight']);
			  base.find('.selected .track_options').width(settings['featuredWidth']);
			  base.find('.selected .track_options').css('margin-top', 0 - settings['featuredWidth']);
			  base.find('.selected .track_options').css('padding-top', ((settings['featuredWidth'] - base.find('.selected .track_options .playpausebutton').outerHeight())/2));
			  base.find('.selected .track_options').height(settings['featuredHeight'] - ((settings['featuredWidth'] - base.find('.selected .track_options .playpausebutton').outerHeight())/2));
			  base.find('.selected .track_options .t_controls_outer').css('margin-top', settings['featuredHeight'] - ((settings['featuredWidth'] + base.find('.selected .track_options .playpausebutton').outerHeight())/2) - base.find('.selected .track_options .t_controls').outerHeight());
		  }
		  
		  obj.goForward = function(){
			  if(currentItem < base.find('.outer_box').length){
				  obj.setFeatured(currentItem + 1);
			  }
		  }
		  
		  obj.goBackward = function(){
			  if(currentItem > 1){
				  obj.setFeatured(currentItem - 1);
			  }
		  }
		  
		  obj.setFeatured = function(featuredIndex){
			  if(currentItem != featuredIndex) {
				  currentItem = featuredIndex;
				  obj.changeFeatured(base.find('.carousel-box:eq('+(featuredIndex-1)+')')); // change 1-based to 0-based				  
			  }
		  }
		  
		  obj.getFeaturedIndex = function(){
			  return currentItem;
		  }
		  
		  obj.init();
		  
		  //Allow chainability ???
		  return this;
	  };
	  
	  $.fn.featuredSlider = function(options){
		  return this.each(function(){
			  var element = $(this);
			  
			  var featuredslider = new featuredSlider(this, options);
			  element.data('featuredslider', featuredslider);
		  });
	  };
	  
	  $.fn.getSlider = function(){
		  
			  return this.data('featuredslider');
		
	  };
})( jQuery );
