/**
 * @fileOverview core functions
 * @version 1.0 (14-AUG-2010)
 * @author Filip Mares - http:// www.filip-mares.co.uk/
 *
 * Dual licensed under the MIT and GPL licenses:
 * http:// www.opensource.org/licenses/mit-license.php
 * http:// www.gnu.org/licenses/gpl.html
*/

/*jslint eqeqeq: true, undef: true */
/*global $FM, window, document, XPathEvaluator */

var $FM = window.$FM || {};

$FM.prototypes = function () {
	// getElementsByClassName method is natively supported by IE9+, FF3+, Safari 3.1+, Chrome 1+, Opera 9.5+
	if (typeof document.getElementsByClassName === 'undefined') {
		document.getElementsByClassName = function (searchClass) {
			// IE8 - supports querySelectorAll
			if (typeof document.querySelectorAll !== 'undefined') {
				return function (searchClass) {
					var classNamesArr = [];
						node = document,
						tag = '*',
						responseArr = [];

					if (searchClass === undefined) {
						throw 'Not enough arguments';
					}
					searchClass = searchClass.replace(/^\s+/,'').replace(/\s+$/,'');
					if (searchClass > '') {
						classNamesArr = searchClass.split(/\s+/);
						console.log(classNamesArr, classNamesArr.length);
						responseArr = node.querySelectorAll(tag + '.' + classNamesArr.join('.'));
					}
					return responseArr;
				}
			// IE 4+ - uses DOM parsing
			} else if (typeof window.XPathEvaluator === 'undefined') {
				return function (searchClass) {
					var node = document,
						tag = '*',
						classNamesArr = [],
						responseArr = [],
						tempArr = null,
						i = 0, j = 0,
						iLen = 0,
						jLen = 0,
						match = false,
						currentElement = null,
						currentClassName = '';

					if (searchClass === undefined) {
						throw 'Not enough arguments';
					}
					searchClass = searchClass.replace(/^\s+/,'').replace(/\s+$/,'');
					if (searchClass > '') {
						classNamesArr = searchClass.split(/\s+/);
						console.log(classNamesArr, classNamesArr.length);
						jLen = classNamesArr.length;
						if ((typeof document.all !== 'undefined') && (tag === '*')) {
							tempArr = node.all;
						} else if (typeof document.getElementsByTagName !== 'undefined') {
							tempArr = node.getElementsByTagName(tag);
						}
						iLen = tempArr.length;
						for (i = iLen; i--;) {
							currentElement = tempArr[i];
							currentClassName = currentElement.className;
							if (currentClassName > '') {
								currentClassName = ' ' + currentClassName + ' ';
								match = true;
								for (j = jLen; j--;) {
									if (currentClassName.indexOf(' ' + classNamesArr[j] + ' ') === -1) {
										match = false;
										break;
									}
								}
								if (match) {
									responseArr.push(currentElement);
								}
							}
						}
					}
					return responseArr;
				}
			// FF 1.5+, Opera? - supports XPaths
			} else {
				return function (searchClass) {
					var node = document,
						tag = '*',
						classNamesArr = [],
						responseArr = [],
						tempArr = null,
						i = 0,
						iLen = 0,
						currentElement = null,
						evaluator = new XPathEvaluator(),
						xpath = './/' + tag,
						nsResolver = evaluator.createNSResolver(node.ownerDocument === null ? node.documentElement : node.ownerDocument.documentElement);

					if (searchClass === undefined) {
						throw 'Not enough arguments';
					}
					searchClass = searchClass.replace(/^\s+/,'').replace(/\s+$/,'');
					if (searchClass > '') {
						classNamesArr = searchClass.split(/\s+/);
						console.log(classNamesArr, classNamesArr.length);
						iLen = classNamesArr.length;
						for (i = iLen; i--;) {
							xpath = xpath + '[contains(concat(" ", @class, " "), " ' + classNamesArr[i] + ' ")]';
						}
						tempArr = evaluator.evaluate(xpath, node, nsResolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
						currentElement = tempArr.iterateNext();
						while (currentElement) {
							responseArr.push(currentElement);
							currentElement = tempArr.iterateNext();
						}
					}
					return responseArr;
				}
			}
		};
	}
}();

$FM.core = function () {
	// -- Private Variables --------------------------------------------------------

	// -- Private Methods ----------------------------------------------------------

	// -- Public Methods -----------------------------------------------------------

	return {
		/**
		 * Function that activates popup functionality for links
		 * @namespace Popup
		 * @member public
		 */
		activatePopups: function (actionTriggerClass) {
			var nodesArray = null,
				nodesArrayLen = 0,
				i = 0;

			nodesArray = document.getElementsByClassName(actionTriggerClass);
			nodesArrayLen = nodesArray.length;
			for (i = nodesArrayLen; i--;) {
				nodesArray[i].target = '_blank';
			}
		},

		/**
		 * Function that hide e-mails to evil robots by masking
		 * @namespace Spam Mask
		 * @member public
		 */
		activateSpamMask : function (actionTriggerClass, spamMaskString) {
			var nodesArray = null,
				nodesArrayLen = 0,
				i = 0,
				currentNode = null,
				cssString = 'direction:rtl;unicode-bidi:bidi-override;',
				reverseString = function (str) {
					return str.split('').reverse().join('');
				},
				removeMask = function (sourceMail, spamMaskString) {
					return sourceMail.split('mailto:')[1].split(spamMaskString).join('');
				};

			if (spamMaskString > '') {
				nodesArray = document.getElementsByClassName(actionTriggerClass);
				nodesArrayLen = nodesArray.length;
				for (i = nodesArrayLen; i--;) {
					currentNode = nodesArray[i];
					currentNode.innerHTML = (reverseString(removeMask(currentNode.href, spamMaskString)));
					currentNode.style.cssText = cssString + currentNode.style.cssText;
					currentNode.onfocus = currentNode.onmouseover = function () {
						var correctEmail = reverseString(this.innerHTML);
						this.innerHTML = (correctEmail);
						this.style.cssText = this.style.cssText.split(' ').join('').split(cssString).join('');
						this.href = 'mailto:' + correctEmail;
						this.onfocus = undefined;
						this.onmouseover = undefined;
					};
				}
			}
		},

		activateChangeClass : function (actionTriggerClass, toggleClassName) {
			var nodesArray = null,
				nodesArrayLen = 0,
				i = 0;

			nodesArray = document.getElementsByClassName(actionTriggerClass);
			nodesArrayLen = nodesArray.length;
			for (i = nodesArrayLen; i--;) {
				currentNode = nodesArray[i];
				currentNode.onmouseover = function () {
					var currentClassName = this.className;
					if (currentClassName.indexOf(toggleClassName) === -1) {
						currentClassName = currentClassName + ' ' + toggleClassName;
						this.className = currentClassName;
					}
				}
				currentNode.onmouseout = function () {
					var currentClassName = this.className;
					currentClassName = currentClassName + ' ';
					currentClassName = currentClassName.replace(' ' + toggleClassName + ' ', ' ');

					this.className = currentClassName;
				}
			}
		},

		/**
		 * Function that allows to download Google Analytics script
		 * @namespace Google Ananlytics
		 * @member public
		 */
		activateGoogleAnalytics : function (accountNumber) {
			var _gaq = _gaq || [],
				ga = document.createElement('script'),
				s = document.getElementsByTagName('script')[0];

			_gaq.push(['_setAccount', accountNumber]);
			_gaq.push(['_trackPageview']);
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			s.parentNode.insertBefore(ga, s);
		}
	};
}();
