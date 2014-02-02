/**
 * @fileoverview fastUX carousel script
 * @version 1.0.0 (12-SEP-2013)
 * @author Filip Mareš
 * @requires jQuery 1.9+
 * @requires fastUX.module, fastUX.parse
*/

/* jshint	curly=true, eqeqeq=true, funcscope=true, immed=true, latedef=true,
			newcap=true, noarg=true, nonew=true, nonstandard=true, onevar=true,
			undef=true*/
/*global $, jQuery, fastUX*/

(function (window) {
	var Carousel = function Carousel(node, customOptions) {
			var self = this,
				options = $.extend({}, self.options, customOptions),
				isVertical = options.direction === 'vertical',
				parse = new window.fastUX.fn.parse();
			self.$carousel = $(node);
			self.$panels = self.$carousel.children();
			self.$activePanel = null;
			self.length = self.$panels.length;
			self.template = parse.template(options.templateID);
			self.totalSize = 0;
			self.dimension = isVertical ? 'Height' : 'Width';
			self.offset = isVertical ? 'top' : 'left';
			self.options = options;
			self.isPlaying = false;
			self.carouselTimeout = null;
			self.activePosition = 0;
			self.counter = 0;
			self.init();
		};
	
	Carousel.prototype = {
		options: {
			templateID: 'carousel-template',
			panelsWrapperClass: 'panels-slider',
			controlsWrapperClass: 'controls-wrapper',
			activeClass: 'active',
			direction: 'horizontal', // horizontal or vertical
			transitionType: 'fade', // move or fade
			autoPlay: false,
			loop: true,
			laps: -1, // -1 is for infinity
			timeout: 3000, //ms (1000 stands for 1s)
			speed: 600 //animation speed
		},
		localization: fastUX.options.localization, // get localizations
		sortPanels: function sortPanels(newPosition) {
			var self = this,
				len = self.length,
				panelIndex = isNaN(newPosition) ? 0 : newPosition,
				totalSize = 0,
				i, size, currentPanel;

			for (i = 0; i < len; i += 1) {
				currentPanel = self.$panels[(panelIndex + i) % len];
				size = $.data(currentPanel, 'size');
				if (!size) {
					size = $(currentPanel)['outer' + self.dimension](true);
					$.data(currentPanel, 'size', size);
				}
				$.data(currentPanel, 'offset', totalSize);
				$.data(currentPanel, 'index', i);
				currentPanel.style[self.offset] = totalSize + 'px';
				totalSize += size;
			}
			return totalSize;
		},
		animatePanels: function animatePanels(newPosition, reverse) {
			var self = this,
				options = self.options,
				$activePanel = self.$activePanel,
				$targetPanel = self.$panels.eq(newPosition),
				activeData = $activePanel.data(),
				targetData = $targetPanel.data(),
				animationSettings = {},
				offset;

			if (options.transitionType === 'move') {
				if (!reverse) {
					offset = targetData.offset - activeData.offset;
					animationSettings[self.offset] = -offset + 'px';
					self.$slider.animate(animationSettings, options.speed, function () {
						self.sortPanels(newPosition);
						self.$slider.css(self.offset, '0px');
						self.activePosition = newPosition;
						self.$activePanel = $targetPanel;
                        if (self.isPlaying) {
                            self.isPlaying = false;
							window.clearTimeout(self.carouselTimeout);
                            self.play();
                        }
					});
				} else {
					self.sortPanels(newPosition);
					offset = activeData.offset;
					self.$slider.css(self.offset, -offset);
					animationSettings[self.offset] = '0px';
					self.$slider.animate(animationSettings, options.speed, function () {
						self.activePosition = newPosition;
						self.$activePanel = $targetPanel;
                        if (self.isPlaying) {
                            self.isPlaying = false;
							window.clearTimeout(self.carouselTimeout);
                            self.play();
                        }
					});
				}
			} else {
				$targetPanel
					.css({'z-index': 2})
					.fadeIn(options.speed, function () {
						self.$activePanel.css({'display': 'none'});
						self.activePosition = newPosition;
						self.$activePanel = $(this);
						self.$activePanel.css({'z-index': 1});
                        if (self.isPlaying) {
                            self.isPlaying = false;
							window.clearTimeout(self.carouselTimeout);
                            self.play();
                        }
					});
			}
		},
		gotoPosition: function gotoPosition(newPosition) {
			var self = this,
				reverse = false;
			if ({prev: 1, next: 1}[newPosition]) {
				if (newPosition === 'prev') {
					newPosition = self.activePosition - 1;
				} else {
					newPosition = self.activePosition + 1;
				}
			} else {
				newPosition = parseInt(newPosition, 10);
			}
			if (newPosition < self.activePosition) {
				reverse = true;
			}
			if (!isNaN(newPosition) && newPosition !== self.activePosition) {
				if (newPosition < 0) {
					newPosition = self.length - 1;
				}
				if (newPosition >= self.length) {
					newPosition = 0;
				}
				self.animatePanels(newPosition, reverse);
			}
		},
		play: function play() {
			var self = this,
				options = self.options,
				laps = options.laps;
			if (!self.isPlaying) {
				self.isPlaying = true;
				// set the animation interval
				self.carouselTimeout = window.setTimeout(function () {
					self.counter += 1;
					if (laps > -1 && self.counter >= (laps + 1) * self.length) {
						self.pause();
					}
					self.gotoPosition('next');
				}, options.timeout);
				// set play button active
				self.$play.addClass(options.activeClass);
				self.$pause.removeClass(options.activeClass);
			}
		},
		pause: function pause() {
			var self = this,
				options = self.options;
			// isPlaying is undefind at the very beginning
			if (self.isPlaying !== false) {
				self.isPlaying = false;
				if (self.carouselTimeout) {
					window.clearTimeout(self.carouselTimeout);
					self.carouselTimeout = null;
					self.counter = 0;
				} else {
					self.options.autoPlay = false;
				}
				self.$play.removeClass(options.activeClass);
				self.$pause.addClass(options.activeClass);
			}
		},
		init: function init() {
			var self = this,
				options = self.options,
				namespace = 'carousel',
				carouselSize = self.$carousel['outer' + self.dimension](),
				isActivatable = self.length > 1;

			if (options.transitionType === 'move') {
				self.totalSize = self.sortPanels();
				isActivatable = isActivatable && self.totalSize > carouselSize;
			}
			if (!isActivatable) {
				return false;
			}
			self.$panels.detach();
			self.$carousel
				.addClass(namespace + '-on')
				.append(self.template({length: self.length}));
			self.$slider = self.$carousel
				.find('.' + options.panelsWrapperClass);
			if (self.totalSize) {
				self.$slider.css('width', self.totalSize);
			}
			self.$slider.append(self.$panels);
			self.$activePanel = self.$panels.eq(self.activePosition);
			self.$controls = self.$carousel
				.find('.' + options.controlsWrapperClass);
			self.$play = self.$controls.find('[data-action="play"]');
			self.$pause = self.$controls.find('[data-action="pause"]');
			self.$controls.bind('click.' + namespace, function (e) {
					var $trigger = $(e.target),
						command;
					if ($trigger.is('a')) {
						e.preventDefault();
						e.stopPropagation();
						command = $trigger.attr('data-action');
						if ({play: 1, pause: 1}[command]) {
							self[command]();
						} else if (typeof command !== undefined) {
							self.pause();
							self.gotoPosition(command);
						}
					}
				});
			if (options.transitionType === 'fade') {
				self.$panels.not(self.$activePanel).hide();
			}
			if (options.autoPlay) {
				self.play();
			}
			return self;
		}
	};
	// register the module Constructor
	window.fastUX.module.register('carousel', Carousel);
}(this));