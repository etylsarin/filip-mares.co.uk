/**
 * @fileoverview fastUX zebra script
 * @version 1.5.0 (06-APR-2013)
 * @author Filip Mareš
 * @requires jQuery 1.9+
 * @requires fastUX.module
*/

/*jslint eqeqeq: true, undef: true */
/*global $, jQuery */
(function (window) {
	var Zebra = function Zebra(node, customOptions) {
			var self = this,
				$node = $(node),
				options = $.extend({}, self.options, customOptions);
			
			self.originalNode = node;
			self.zebraParent = $node.clone(true, false)[0];
			self.$zebraNodes = $(self.zebraParent).children();
			self.options = options;
			self.init();
		};
	
	Zebra.prototype = {
		options: {
			oddClass: 'odd',
			evenClass: 'even',
			tableSectioningNames: ['THEAD', 'TBODY', 'TFOOT']
		},
		/* IE8 colspan & rowspan bug detection */
		isAllTableSpanned: (function () {
			var $td = $('<td />');
			return !!$td.filter('[colspan]').length;
		}()),
		init: function init() {
			var self = this,
				options = self.options,
				zebraParent = self.zebraParent,
				$zebraNodes = self.$zebraNodes,
				$oddNodes, $evenNodes,
				sectionsArray = [],
				rowspanArray = [],
				i, j, len, section, totalSections, colspan, rowspan, isCellOdd, currentNode,
				getNode = function getNode(node, method) {
					var realNode = node[method];
					while (realNode !== null && realNode.nodeType !== 1) {
						realNode = realNode.nextSibling;
					}
					return realNode;
				};
			switch (zebraParent.nodeName) {
			case 'TABLE':
				currentNode = getNode(zebraParent, 'firstChild');
				if (currentNode.nodeName === 'TR') {
					sectionsArray.push(zebraParent.getElementsByTagName('tr'));
				} else {
					while (currentNode) {
						if ($.inArray(currentNode.nodeName, options.tableSectioningNames) > -1) {
							sectionsArray.push(currentNode.getElementsByTagName('tr'));
						}
						currentNode = getNode(currentNode, 'nextSibling');
					}
				}
				totalSections = sectionsArray.length;
				while (totalSections) {
					section = sectionsArray[0];
					len = section.length;
					for (i = 0; i < len; i += 1) {
						section[i].className += section[i].className ? ' ' : '';
						section[i].className += i % 2 ? options.evenClass : options.oddClass;
						j = 0;
						isCellOdd = true;
						currentNode = getNode(section[i], 'firstChild');
						while (currentNode) {
							while (rowspanArray[j]) {
								rowspanArray[j] = rowspanArray[j] - 1;
								j += 1;
								isCellOdd = !isCellOdd;
							}
							currentNode.className += currentNode.className ? ' ' : '';
							currentNode.className += isCellOdd ? options.oddClass : options.evenClass;
							colspan = parseInt(currentNode.getAttribute('colspan'), 10) - 1;
							rowspan = parseInt(currentNode.getAttribute('rowspan'), 10) - 1;
							if (colspan > 0 && colspan % 2) {
								isCellOdd = !isCellOdd;
							}
							rowspanArray[j] = rowspan > 0 ? rowspan : 0;
							currentNode = getNode(currentNode, 'nextSibling');
							isCellOdd = !isCellOdd;
							j += 1;
						}
					}
					sectionsArray.shift();
					totalSections -= 1;
				}
				break;
			case 'DL':
				$oddNodes = $zebraNodes.filter(':nth-child(4n + 1), :nth-child(4n + 2)');
				$evenNodes = $zebraNodes.filter(':nth-child(4n), :nth-child(4n + 3)');
				break;
			default:
				$oddNodes = $zebraNodes.filter(':nth-child(odd)');
				$evenNodes = $zebraNodes.filter(':nth-child(even)');
			}
			if ($oddNodes && $oddNodes.length) {
				$oddNodes.addClass(options.oddClass);
			}
			if ($evenNodes && $evenNodes.length) {
				$evenNodes.addClass(options.evenClass);
			}
			self.originalNode.parentNode.replaceChild(zebraParent, self.originalNode);
		}
	};
	// register the module Constructor
	window.fastUX.module.register('zebra', Zebra);
}(this));