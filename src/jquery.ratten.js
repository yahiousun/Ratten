/*!
 *	jQuery Ratten v0.1 - 2013-05-01
 *	(c) 2013 yahiousun
 *	Released under the MIT license
 *	MIT-LICENSE.txt
 */

(function($) {
	// Default settings
	var defaults = {
		container: 'ul',
		element: 'li',
		prev: '.ratten-prev',
		next: '.ratten-next',
		tween: 500,
		interval: 3500,
		step: 1,
		spacing: 70,
		autoplay: true,
		pause: true,
		//responsive: true,
		//orientation: 'horizontal',
		//style: 'ratten',
		delay: 3500
	};
	// Debug
	function debug(msg){
		if (window.console&&window.console.log){
			window.console.log('Ratten: '+msg);
		}
	};
	$.fn.ratten = function(options){
		var opts;
		if(options&&typeof(options)===object){
			opts = $.extend(defaults, options);
			}
			else{
				opts = defaults;
				};
		return this.each(function(){
			var self = $(this);
			var container = self.find(opts.container);
			var elements = container.find(opts.element);
			var next = self.find(opts.next);
			var prev = self.find(opts.prev);
			var timer;
			var status; // running status
			
			// Methods
			var methods = {
				init: function(){
					// Events
					elements.on('click', methods.goto);
					prev.on('click', methods.prev);
					next.on('click', methods.next);
					if(opts.pause===true){
						self.on({
							'mouseenter': methods.pause,
							'mouseleave': methods.start
						});
					}
					methods.position();
					methods.monitor('init');
					// Autoplay
					if(opts.autoplay===true){
						methods.monitor('run');
						timer = setTimeout(function(){
							methods.move(opts.step);
						}, opts.delay);
					}
				},
				position: function(){
					elements.each(function(){
						var index = $(this).index();
						$(this).css({
							'z-index': (9999-index),
							'left': opts.spacing*index
						});
						elements = container.find(opts.element); // Reset elements
					});
				},
				move: function(step){
					if(step>0){ // move forward
						// move container
						container.stop().animate({
							'left': -opts.spacing*step
						}, opts.tween, function(){
							for(i=0;i<elements.eq(step).prevAll(opts.element).length;i++){
								elements.eq(0).appendTo(container);
								methods.position();
							};
							container.css('left',0);
						});
						// move prevAll elements
						elements.eq(step).prevAll(opts.element).stop().animate({
							'opacity': 0
						}, opts.tween, function(){
							elements.each(function(){
								$(this).css({
									'opacity': 1
								});
							});
							if(opts.autoplay===true){
								methods.timer();
							};
						});
						debug('timer('+timer+')');
					}else if(step<0){ // move back
						container.stop().animate({
							'left': opts.spacing*step
						}, 0, function(){
							elements.eq(step-1).nextAll(opts.element).css('opacity', 0);
							for(i=0;i<elements.eq(step-1).nextAll(opts.element).length;i++){
								elements.eq(-1).prependTo(container);
								methods.position();
								elements.eq(0).animate({
									'opacity': 1
								}, opts.tween);
							};
						});
						container.stop().animate({
							'left': 0
						}, opts.tween, function(){
							if(opts.autoplay===true){
								methods.timer();
							};
						});
					}
				},
				prev: function(){
					methods.monitor('prev', function(){
						methods.move(-opts.step);
					})
					return false;
				},
				next: function(){
					methods.monitor('next', function(){
						methods.move(opts.step);
					})
					return false;
				},
				goto: function(){
					var step = $(this).index();
					methods.monitor('goto', function(){
						methods.move(step);
					});
					return false;
				},
				timer: function(){
					if(status==='run'){
						methods.clear(function(){
							timer = setTimeout(function(){
								methods.move(opts.step);
							}, opts.interval);
						})
					}
				},
				clear: function(callback){
					clearTimeout(timer);
					if(callback){
						callback();
					}
					debug('clear');
				},
				pause: function(){
					methods.monitor('pause', methods.clear);
				},
				start: function(){
					methods.clear(function(){
						methods.monitor('run', methods.timer);
						debug('start');
					})
				},
				monitor: function(value, callback){
					// Log status
					self.data('status', value);
					status = self.data('status');
					debug('status '+status)
					if(callback){
						callback();
					}
				}
			}
			// init
			methods.init();
		});
	};
})(jQuery);