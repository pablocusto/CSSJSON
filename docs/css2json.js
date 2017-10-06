/**
 * CSS-JSON Converter for JavaScript
 * Converts CSS to JSON and back.
 * Version 1.0
 *
 * Released under the MIT license.
 *
 * Copyright (c) 2013 Aram Kocharyan, http://aramk.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions
 of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

var CSS2JSON = new function () {

    var base = this;

    base.init = function () {
        // String functions
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };

        String.prototype.repeat = function (n) {
            return new Array(1 + n).join(this);
        };
    };
    base.init();

    var selX = /([^\s\;\{\}][^\;\{\}]*)\{/g;
    var endX = /\}/g;
    var lineX = /([^\;\{\}]*)\;/g;
    var commentX = /\/\*[\s\S]*?\*\//g;
    var lineAttrX = /([^\:]+):([^\;]*);/;

    // This is used, a concatenation of all above. We use alternation to
    // capture.
    var altX = /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gmi;

    // Capture groups
    var capComment = 1;
    var capSelector = 2;
    var capEnd = 3;
    var capAttr = 4;

    var isEmpty = function (x) {
        return typeof x == 'undefined' || x.length == 0 || x == null;
    };

    var isCssJson = function (node) {
        return !isEmpty(node) ? (node.cssjson) : false;
    }

    /**
     * Input is css string and current pos, returns JSON object
     *
     * @param cssString
     *            The CSS string.
     * @param args
     *            An optional argument object. ordered: Whether order of
     *            comments and other nodes should be kept in the output. This
     *            will return an object where all the keys are numbers and the
     *            values are objects containing "name" and "value" keys for each
     *            node. comments: Whether to capture comments. split: Whether to
     *            split each comma separated list of selectors.
     */
    base.toJSON = function (cssString, args) {
        var cssjson = {
        };
        var match = null;
        var count = 0;

        if (typeof args == 'undefined') {
            var args = {
                comments: false,
                stripComments: false,
                split: false
            };
        }
        if (args.stripComments) {
            args.comments = false;
            cssString = cssString.replace(commentX, '');
        }

        while ((match = altX.exec(cssString)) != null) {
            if (!isEmpty(match[capComment]) && args.comments) {
                // Comment
                var add = match[capComment].trim();
                cssjson[count++] = add;
            } else if (!isEmpty(match[capSelector])) {
                // New node, we recurse
                var name = match[capSelector].trim();
                // This will return when we encounter a closing brace
                var newNode = base.toJSON(cssString, args);

				if (args.split) {
					var bits = name.split(',');
				} else {
					var bits = [name];
				}
				for (i in bits) {
					var sel = bits[i].trim();
					if (sel in cssjson) {
						for (var att in newNode.attributes) {
							cssjson[sel][att] = newNode.attributes[att];
						}
					} else {
						cssjson[sel] = newNode;
					}
				}
            } else if (!isEmpty(match[capEnd])) {
                // Node has finished
                return cssjson;
            } else if (!isEmpty(match[capAttr])) {
                var line = match[capAttr].trim();
                var attr = lineAttrX.exec(line);
                if (attr) {
                    // Attribute
                    var name = attr[1].trim();
                    var value = attr[2].trim();
                    if (args.ordered) {
                        var obj = {};
                        obj['name'] = name;
                        obj['value'] = value;
                        obj['type'] = 'attr';
                        node[count++] = obj;
                    } else {
                        if (name in cssjson) {
                            var currVal = cssjson[name];
                            if (!(currVal instanceof Array)) {
                                cssjson[name] = [currVal];
                            }
                            cssjson[name].push(value);
                        } else {
                            cssjson[name] = value;
                        }
                    }
                } else {
                    // Semicolon terminated line
                    cssjson[count++] = line;
                }
            }
        }

        return {cssjson};
    };

    /**
     * @param node
     *            A JSON node.
     * @param depth
     *            The depth of the current node; used for indentation and
     *            optional.
     * @param breaks
     *            Whether to add line breaks in the output.
     */
    base.toCSS = function (node, depth, breaks, name) {
        var cssString = '';
        if (typeof depth == 'undefined') {
            depth = 0;
        }
        if (typeof breaks == 'undefined') {
            breaks = false;
        }
		if( node.cssjson ){
			node = node.cssjson;
		}
	
        if (typeof node === 'object' && !(node instanceof Array) ) {
            var first = true;
            for (name in node) {
                if (breaks && !first) {
                    cssString += '\n';
                } else {
                    first = false;
                }
				if (typeof node[name] === 'object' ) {
					cssString += '\t'.repeat(depth) + name + ' {\n';
					cssString += base.toCSS(node[name], depth + 1, breaks, name);
					cssString += '\t'.repeat(depth) + '}\n';
				} else {
					cssString += '\t'.repeat(depth) + name + ': ' + node[name] + ';\n';
				}
            }
        } else if (node instanceof Array) {
			for (var i = 0; i < node.length; i++) {
				cssString += '\t'.repeat(depth) + name + ': ' + node[i] + ';\n';
			}
        } else {
			cssString += '\t'.repeat(depth) + name + ': ' + node + ';\n';
		}
        return cssString;
    };

    /**
     * @param data
     *            You can pass css string or the CSSJS.toJSON return value.
     * @param id (Optional)
     *            To identify and easy removable of the style element
     * @param replace (Optional. defaults to TRUE)
     *            Whether to remove or simply do nothing
     * @return HTMLLinkElement
     */
    base.toHEAD = function (data, id, replace) {
        var head = document.getElementsByTagName('head')[0];
        var xnode = document.getElementById(id);
        var _xnodeTest = (xnode !== null && xnode instanceof HTMLStyleElement);

        if (isEmpty(data) || !(head instanceof HTMLHeadElement)) return;
        if (_xnodeTest) {
            if (replace === true || isEmpty(replace)) {
                xnode.removeAttribute('id');
            } else return;
        }
        if (isCssJson(data)) {
            data = base.toCSS(data);
        }

        var node = document.createElement('style');
        node.type = 'text/css';

        if (!isEmpty(id)) {
            node.id = id;
        } else {
            node.id = 'cssjson_' + timestamp();
        }
        if (node.styleSheet) {
            node.styleSheet.cssText = data;
        } else {
            node.appendChild(document.createTextNode(data));
        }

        head.appendChild(node);

        if (isValidStyleNode(node)) {
            if (_xnodeTest) {
                xnode.parentNode.removeChild(xnode);
            }
        } else {
            node.parentNode.removeChild(node);
            if (_xnodeTest) {
                xnode.setAttribute('id', id);
                node = xnode;
            } else return;
        }

        return node;
    };

    // Alias

    if (typeof window != 'undefined') {
		window.createCSS = base.toHEAD;
    }

    // Helpers

    var isValidStyleNode = function (node) {
        return (node instanceof HTMLStyleElement) && node.sheet.cssRules.length > 0;
    }

    var timestamp = function () {
        return Date.now() || +new Date();
    };

};
