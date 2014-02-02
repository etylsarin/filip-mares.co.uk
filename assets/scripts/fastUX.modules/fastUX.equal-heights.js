/**
 * @fileoverview projectName hover script
 * @version 1.0.0 (06-APR-2012)
 * @author Filip Mareš
 * @requires jQuery 1.9+
 * @requires projectName.module
*/



/*jslint eqeqeq: true, undef: true */
/*global $, jQuery */
(function (window) {
	var document = window.document,
        projectName = window.projectName,
		EqualHeights = function EqualHeights(node, customOptions) {
			var self = this,
				options = $.extend({}, self.options, customOptions),
				$nodes;
			self.$parentNode = $node;
			self.options = options;
			if (options.deep) {
				$nodes = $node.find(options.selector);
			} else {
				$nodes = $node.children(options.selector);
			}
			self.$nodes = $nodes;
			self.nodesLength = $nodes.length;
			self.init();
		};
	EqualHeights.prototype = {
		options: {
			groupBy: 0, //0 stands for all
			deep: false,
			groups: false,
			selector: undefined
		},
		getGroups: function getGroups() {
			var self = this,
				names = [],
				anonymousItems = [],
				namedItems = {},
				$nodes = self.$nodes,
				i = self.nodesLength,
				$currentItem, groupName;
			while (i) {
				i -= 1;
				$currentItem = $nodes[i];
				groupName = $($currentItem).data('group');
				if (groupName) {
					if (!namedItems[groupName]) {
						namedItems[groupName] = [];
						names.push(groupName);
					}
					namedItems[groupName].push($currentItem);
				} else {
					anonymousItems.push($currentItem);
				}
			}
			return {
				names: names,
				namedItems: namedItems,
				anonymousItems: anonymousItems
			};
		},
		setHeights: function setHeights($nodes) {
			var self = this,
				groupBy = self.options.groupBy,
				nodesLength = $nodes.length,
				groups = 1,
				firstIteration = true,
				i = self.nodesLength,
				$currentNode, currentNode, currentHeight, maxHeight, groupNodes;

			if (groupBy) {
				groups = parseInt(i / groupBy, 10);
				groups += i % groupBy ? 1 : 0;
			}
			while (groups) {
				groups -= 1;
				if (firstIteration) {
					i = nodesLength - groups * groupBy;
					firstIteration = false;
				} else {
					i = groupBy;
				}
				groupNodes = [];
				maxHeight = 0;
				while (i) {
					i -= 1;
					currentNode = $nodes[groups * groupBy + i];
					$currentNode = $(currentNode);
					currentHeight = $currentNode.height();
					if (maxHeight < currentHeight) {
						maxHeight = currentHeight;
					}
					groupNodes[i] = currentNode;
				}
				$(groupNodes).css('min-height', maxHeight);
			}
		},
		
		init: function init() {
			var self = this,
				sortedNodes = {
					anonymousItems: self.$nodes
				},
				i;
			if (self.options.groups) {
				sortedNodes = self.getGroups();
				i = sortedNodes.names.length;
				while (i) {
					i -= 1;
					self.setHeights($(sortedNodes.namedItems[sortedNodes.names[i]]));
				}
			}
			self.setHeights($(sortedNodes.anonymousItems));
		}
	};
	// register the module Constructor
	projectName.module.register('equalHeights', EqualHeights);
}(this));



/*
$.fn.equalizeHeights = function() {
	var maxHeight = this.map(function(i,e) {
		return $(e).height();
	}).get();
	return this.height( Math.max.apply(this, maxHeight) );
};
$('input').click(function(){
	$('div').equalizeHeights();
});
*/

/*
$.fn.setAllToMaxHeight = function(){
return this.height( Math.max.apply(this, $.map( this , function(e){ return $(e).height() }) ) );
}

// usage: $(‘div.unevenheights’).setAllToMaxHeight()
*/