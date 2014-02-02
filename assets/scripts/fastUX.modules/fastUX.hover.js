/**
 * @fileoverview fastUX hover script
 * @version 1.0.0 (06-APR-2012)
 * @author Filip Mareš
 * @requires jQuery 1.9+
 * @requires fastUX.module
*/

/*jslint eqeqeq: true, undef: true */
/*global $, jQuery */
(function (window) {
	var Hover = function Hover(node, customOptions) {
			var self = this,
				options = $.extend({}, self.options, customOptions);
			
			self.$node = $(node);
			self.options = options;
			self.init();
		};
	
	Hover.prototype = {
		options: {
			hoverClass: 'hover'
		},
		init: function init() {
			var self = this;
			self.$node.bind('mouseenter# mouseleave#'.replace(/#/g, '.hover'), function (e) {
				$(e.currentTarget).toggleClass(self.options.hoverClass, e.type === 'mouseenter');
			});
		},
		destroy: function destroy() {
			var self = this;
			self.$node.unbind('.hover');
		}
	};
	// register the module Constructor
	window.fastUX.module.register('hover', Hover);
}(this));