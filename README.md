# Css2Json Lite Converter for JavaScript 

Css2Json Lite Converter for JavaScript  
Converts CSS to JSON and back.  
Version 1.0

Based on: CSSJSON v2.1 of Aram Kocharyan https://github.com/aramk/CSSJSON 

Released under the MIT license.

## Live Demo

See https://pablocusto.github.io/Css2Json-Lite/

## Usage

### JavaScript
```javascript
// To JSON
var json = CSS2JSON.toJSON(cssString);

// To CSS
var css = CSS2JSON.toCSS(jsonObject);

// Appending to DOM (HTMLHeadElement)
// alias (global): createCSS(css);
// CSS2JSON.toHead(json);
CSS2JSON.toHead(css); // returns HTMLStyleElement
```

### JSON

```json
{
  "cssjson": {
    "body": {
      "font-family": "arial, sans-serif",
      "font-size": "18px"
    },
    "label": {
      "display": "inline-block",
      "font-size": "22px"
    },
    ".title": {
      "color": "pink",
      "font-size": "38px"
    },
    ".title .num": {
      "font-size": "46px"
    },
    ".title .version": {
      "font-size": "26px",
      "margin-left": "10px"
    },
    ".sub-title": {
      "display": "inline-block",
      "position": "absolute",
      "color": "grey",
      "font-size": "34px",
      "margin-top": "40px",
      "margin-left": "-70px",
      "-webkit-transform": "rotate(-8deg)",
      "/* Chrome, Safari, Opera */\n\t transform": "rotate(-8deg)"
    },
    ".editor": {
      "width": "-webkit-fill-available",
      "min-height": "400px",
      "max-height": "600px",
      "outline": "1px solid rgb(128,128,128)"
    },
    ".editor:hover": {
      "outline": "1px solid rgb(100,100,250)"
    },
    ".editor:focus": {
      "outline": "2px solid rgb(250,128,250) !important"
    },
    ".btn": {
      "display": "inline-block",
      "min-width": "170px",
      "margin-bottom": "10px",
      "float": "right"
    }
  }
}
```

### CSS

```css
body {
	font-family: arial, sans-serif;
	font-size: 18px;
}
label {
	display: inline-block;
	font-size: 22px;
}
.title{
	color: pink;
	font-size: 38px;
}
.title .num {
	font-size: 46px;
}
.title .version {
	font-size: 26px;
	margin-left: 10px;
}
.sub-title{
	display: inline-block;
	position:absolute;
	color: grey;
	font-size: 34px;
	margin-top: 40px;
	margin-left: -70px;
	 -webkit-transform: rotate(-8deg); /* Chrome, Safari, Opera */
	 transform: rotate(-8deg);
}
.editor {
	width: -webkit-fill-available;
	min-height: 400px;
	max-height: 600px;
	outline: 1px solid rgb(128,128,128);
}
.editor:hover {
	outline: 1px solid rgb(100,100,250);
}
.editor:focus {
	outline: 2px solid rgb(250,128,250) !important;
}
.btn {
	display: inline-block;
	min-width: 170px;
	margin-bottom: 10px;
	float:right;
}
```
