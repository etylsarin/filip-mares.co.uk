/**
 * @fileOverview fastUX parser script
 * @version 1.9.0 (28-FEB-2013)
 * @author Filip Mareš
 * @requires jQuery 1.9+
 * @requires fastUX.module
*/

/*jslint eqeqeq: true, undef: true */
/*global $, jQuery */
(function (window) {
	var Parser = function Parser() {};

	Parser.prototype = {
        /**
        * Basic camelize function.
        *
        * @param {string} str The string to be camelized.
        * @return {string} The camelized string.
        */
		camelize: function camelize(str) {
			var strRegEx = /\-([a-z])/ig;
			return str.replace(strRegEx, function (match, chr) {
				return chr ? chr.toUpperCase() : '';
			});
		},
        /**
        * Basic trim function.
        *
        * @param {string} str The string to be trimmed.
        * @return {string} The trimmed string.
        */
        trim: function trim(str) {
            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        },
        /**
        * Basic whitespace removal function.
        *
        * @param {string} str The string to be processed.
        * @return {string} The new string containing no whitespace.
        */
        removeWhiteSpace: function removeWhiteSpace(str) {
            return str.replace(/\s\s*/g, '');
        },
       /**
        * optimized URL parser, based on http://blog.stevenlevithan.com/archives/parseuri
        *
        * @param {string} url The string to be parsed and split.
        * @param {object} options The object with initial settings to define what url parts should be retrieved.
        * @return {object} The object containing parsed parts of the url.
        */
        url: function parseUrl(url, options) {
            var defaultOptions = {
                breakDownAuthority: false,
                breakDownRelative: false,
                breakDownQuery: false
            },
                returnObj = {
                    source: url
                },
                // function 
                split = function (str, splitter, keys, obj) {
                    var temp = str.split(splitter),
                        i = keys ? keys.length : temp.length,
                        key, val;
                    while (i) {
                        i -= 1;
                        if (keys) {
                            key = keys[i];
                            val = temp[i];
                        } else {
                            key = temp[i].split('=');
                            val = key[1];
                            key = key[0];
                        }
                        if (key > '') {
                            val = val || '';
                            obj[key] = val;
                        }
                    }
                },
                // private function to split a string into parts based on input regural expression.
                parse = function (str, key, regexp) {
                    var i = key.length,
						temp = regexp.exec(str) || [];
                    while (i) {
                        i -= 1;
                        returnObj[key[i]] = temp[i + 1] || '';
                    }
                },
                re;

            if (typeof url === 'string') {
                options = $.extend({}, defaultOptions, options);
                url = this.trim(url);
                if (url > '') {
                    // parse protocol, authority, relative
                    re = /^(?:(https?:)\/\/([\w\d\.\$\*\(\)\-!'%:@]+))?([\w\/\.\$\*\(\)\#\+\-\'\?!%=&,:|]+)?$/;
                    parse(url, ['protocol', 'authority', 'relative'], re);
                    if (options.breakDownAuthority && returnObj.authority > '') {
                        // parse userInfo, host, port
                        re = /^(?:([^@]+)@)?(([^:]+)(?::([\d]+))?)$/;
                        parse(returnObj.authority, ['credentials', 'host', 'hostname', 'port'], re);
                        // parse user, password
                        split(returnObj.credentials, ':', ['user', 'password'], returnObj);
                    }
                    if ((options.breakDownRelative || options.breakDownQuery) && returnObj.relative > '') {
                        //parse path, query, anchor
                        re = /^([^\?\#]*)(\?[^\#]*)?(\#\S*)?$/;
                        parse(returnObj.relative, ['pathname', 'search', 'hash'], re);
                        if (options.breakDownRelative && returnObj.pathname > '') {
                            // parse directory, file
                            re = /^((?:[^#\/]*\/)*)([\S]*)$/;
                            parse(returnObj.pathname, ['directory', 'file'], re);
                        }
                        if (options.breakDownQuery && returnObj.search > '') {
                            // parse query
                            returnObj.query = {};
                            split(returnObj.search.replace(/^\?/, ''), '&', null, returnObj.query);
                        }
                    }
                }
            }
            return returnObj;
        },
		/**
		 * https://github.com/cho45/micro-template.js
		 * (c) cho45 http://cho45.github.com/mit-license
		 */
		template: function template(str, data) {
			var Const = function (str, data) {
				var self = this;
				if (!self.cache[str]) {
					self.cache[str] = (function () {
						var isID = /^[\w\-]+$/.test(str),
							name = isID ? str : 'template(string)',
							string = isID ? self.get(str) : str,
							line = 1,
							func = new Function(
								("try { " +
									"var data = this.stash;" + // name "data" used for the template data model
										"this.ret += '"  +
										string
											.replace(/<#/g, '\x11') // if you want other tag prefix, just edit this line
											.replace(/#>/g, '\x13') // if you want other tag sufix, just edit this line
											.replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27')
											.replace(/^\s*|\s*$/g, '')
											.replace(/\n/g, function () {
												return "';\nthis.line = " + (++line) + "; this.ret += '\\n";
											})
											.replace(/\x11=raw(.+?)\x13/g, "' + ($1) + '")
											.replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '")
											.replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") +
									"'; return this.ret;" +
								"} catch (e) { " +
									"console.error(e + ' (" + name + "' + ' line ' + this.line + ')', this);" +
								"} //@ sourceURL=" + name + "\n") // source map
								.replace(/this\.ret \+= '';/g, '')
							),
							map = { '&' : '&amp;', '<' : '&lt;', '>' : '&gt;', '\x22' : '&#x22;', '\x27' : '&#x27;' },
							escapeHTML = function (string) {
								return ('' + string).replace(/[&<>\'\"]/g, function (character) {
									return map[character];
								});
							};
						return function (stash) {
							self.context = {
								escapeHTML: escapeHTML,
								line: 1,
								ret : '',
								stash: stash
							};
							return func.call(self.context);
						};
					}());
				}
				return data ? self.cache[str](data) : self.cache[str];
			};
			Const.prototype = {
				cache: {},
				get: function (id) {
					return window.document.getElementById(id).innerHTML;
				}
			};
			return new Const(str, data);
		}
	/*
		// Micro-Templating system
		// Values are determined by <# and #>
		template: function template(templateId, data) {
			var document = window.document,
				tmpl = document.getElementById(templateId).innerHTML;
			return tmpl.replace(/(?:<#([^#]+)#>)/ig, function (match, p1) {
				var substitute = data[p1];
				if (!substitute) {
					substitute = match;
				}
				return substitute;
			});
		}
	*/
	};
	// register the module Constructor
	window.fastUX.module.register('parse', Parser);
}(this));