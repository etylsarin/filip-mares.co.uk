/**
 * @fileOverview fastUX core script
 * @version 1.10.1 (10-JAN-2014)
 * @author Filip Mareš
*/

/*jslint eqeqeq: true, undef: true */
/*global console */
(function (window) {

	// PRIVATE
	var document = window.document,
        fastUX = window.fastUX || (window.fastUX = {}),

		// private methods

		// getElementsByClassName polyfill for IE8. Returns null for IE7-
		getElements = (function () {
			if (document.getElementsByClassName) {
				return function (className, contextId) {
					var node = contextId ? document.getElementById(contextId) : document;
					return node.getElementsByClassName(className);
				};
			} else if (document.querySelectorAll) {
				return function (className, contextId) {
					contextId = contextId ? ('#' + contextId) : '';
					return document.querySelectorAll(contextId + ' .' + className);
				};
			} else {
				return function () {
					return null;
				};
			}
		}()),
		
		// get data attributs from an element
		getData = function (element) {
			var dataset = element.dataset,
				dataRegEx, i, attr, match,
				camelize = function (str) {
					var strRegEx = /\-([a-z])/ig;
					return str.replace(strRegEx, function (match, chr) {
						return chr ? chr.toUpperCase() : '';
					});
				},
				isDatasetSupported = (function () {
					var node = document.createElement('b');
					node.setAttribute('data-a-b', 'c');
					return (node.dataset && node.dataset.aB === 'c');
				}());
			if (!isDatasetSupported) {
				dataset = {};
				dataRegEx = /^data-([a-z_\-\d]*)$/i;
				attr = element.attributes;
				i = attr.length;
				while (i) {
					i -= 1;
					match = attr[i].name.match(dataRegEx);
					if (match && match[1]) {
						dataset[camelize(match[1])] = attr[i].value;
					}
				}
			}
			return dataset;
		},

		// deep extend object method
		deepExtend = function (destination) {
			var args = arguments,
				argsLen = args.length,
				i, property, source,
				isObjectLiteral = function (obj) {
					return obj && obj.constructor && obj.constructor === Object;
				},
				proxyFunction = function (obj, property) {
					return function () {
						obj[property].apply(obj, arguments);
					};
				};
			if (typeof destination === 'object') {
				for (i = 1; i < argsLen; i += 1) {
					source = args[i];
					for (property in source) {
						if (isObjectLiteral(destination[property]) && isObjectLiteral(source[property])) {
							destination[property] = destination[property] || {};
							args.callee(destination[property], source[property]);
						} else if (typeof source[property] === 'function') {
							destination[property] = proxyFunction(source, property);
						} else {
							destination[property] = source[property];
						}
					}
				}
			}
			return destination;
		};

	// PUBLIC
	// function pool
	fastUX.fn = {};
	fastUX.options = {
		prefix: 'ux-',
		namespace: 'fastUX',
		localization: {}
	};
	fastUX.utils = {
		getElements: getElements,
		getData: getData,
		deepExtend: deepExtend
	};

	// public methods	
	
	// JavaScript debugging tools
	fastUX.debug = (function () {
		var console = {},
			names = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
					'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'],
			i = names.length,
			dummyFunction = function () {};
		while (i) {
			i -= 1;
			console[names[i]] = dummyFunction;
		}
		return {
			dummyConsole: console,
			console: deepExtend({}, console, window.console),
			setDebugMode: function setMode(debugMode) {
				debugMode = !!debugMode;
				if (debugMode) {
					window.console = this.console;
					this.console.info(fastUX.options.namespace + ': The debugMode has been enabled.');
				} else {
					window.console = this.dummyConsole;
				}
				this.debugMode = debugMode;
			}
		};
	}());
	// set debug mode to false by default
	fastUX.debug.setDebugMode(false);

	// Method to set custom options
	fastUX.setOptions = function setOptions(options) {
		var c = console,
			globalOptions = fastUX.options;
		if (typeof options === 'object') {
			deepExtend(globalOptions, options);
			c.info(globalOptions.namespace + ': Global settings have been updated.');
			c.log(globalOptions);
		} else {
			c.error(globalOptions.namespace + ': %s is not an object.', options);
		}
	};

	// module registration & initialization
	fastUX.module = (function () {
		var moduleInstances = {},
			uniqueId = (new Date()).getTime(),
			// module registering method
			registerModule = function (moduleName, Module) {
				var c = console,
					current = fastUX.fn,
					options = fastUX.options,
					propArr, i, len;
				if (!moduleName || typeof moduleName !== 'string') {
					c.error(options.namespace + ': %s is not a string.', moduleName);
					return this;
				}
				if (typeof Module !== 'function') {
					c.error(options.namespace + ': %s constructor is not a function.', Module);
					return this;
				}
				propArr = moduleName.split('.');
				len = propArr.length;
				for (i = 0; i < len; i += 1) {
					if (!current[propArr[i]]) {
						current[propArr[i]] = {};
					}
					if ((i + 1) === len) {
						current[propArr[i]] = Module;
					}
					current = current[propArr[i]];
				}
				c.info(options.namespace + ': Module %s has been registered.', moduleName);
				return this;
			},

			// module initialization method
			initModule = function () {
				var c = console,
					args = [],
					selector = arguments[0],
					options = fastUX.options,
					nodes, contextID, i, currentNode, currentData, currentOptions, moduleOptions,
					moduleInstance = function (currentNode, customOptions) {
						var Const = fastUX.fn[selector],
							module = new Const(currentNode, customOptions);
						if (!customOptions.fastux) {
							if (currentNode && currentNode.setAttribute) {
								currentNode.setAttribute('data-fastux', uniqueId);
							}
							moduleInstances['uid' + uniqueId] = {};
							customOptions.fastux = '' + uniqueId;
							uniqueId += 1;
						}
						moduleInstances['uid' + customOptions.fastux][selector] = module;
						return module;
					};
				
				// replicate agruments array
				Array.prototype.push.apply(args, arguments);
				// remove selector from the arguments pool
				args.shift();
				// error handling
				if (typeof fastUX.fn[selector] !== 'function') {
					c.error(options.namespace + ': Module %s can\'t be initialized.', selector);
					return this;
				}
				
				// get optional contextID from the arguments pool
				if (args[0] && typeof args[0] === 'string') {
					contextID = args.shift();
				}
				// get optional settings from the arguments pool
				currentOptions = args[0];
				nodes = getElements(options.prefix + selector, contextID);
				i = nodes ? nodes.length : 0;
				if (i) {
					c.groupCollapsed(options.namespace + ': Module initialization: %s', selector);
					while (i) {
						i -= 1;
						currentNode = nodes[i];
						currentData = getData(currentNode);
						moduleOptions = deepExtend({}, currentOptions, currentData);
						moduleInstance(currentNode, moduleOptions);
						c.info('Instance of %s initialized with parameters listed below:', selector);
						c.log(currentNode);
						c.log(moduleOptions);
					}
					c.groupEnd();
				}
				return this;
			},
			
			getModule = function (node) {
				var c = console,
					returnValue = false,
					id;
				if (node && node.getAttribute) {
					id = node.getAttribute('data-fastux');
				}
				if (id) {
					returnValue = moduleInstances['uid' + id];
				}
				c.groupCollapsed(fastUX.options.namespace + ': Module instances for: %s', node.nodeName);
				c.log(node);
				c.log(returnValue);
				c.groupEnd();
				return returnValue;
			};

		return {
			register: registerModule,
			init: initModule,
			get: getModule
		};
	}());

}(this));