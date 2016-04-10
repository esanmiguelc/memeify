'use strict';
var Memeify;

Memeify = (function() {

  var context;

  function Memeify(context) {
    this.context = context;
  }

  Memeify.prototype.createMeme = function(image, canvas, topText, bottomText) {
    var maxWidth = (canvas.width * 0.90);
    this.context.setFont(48, 'sans-serif');
    this.context.drawImage(image, 0, 0);

    this._fitText(canvas, topText, maxWidth);
  }

  Memeify.prototype._fitText = function (canvas, text, maxWidth) {
    var options = {
      'minFontSize': 16,
      'initialFontSize': 48,
      'maxWidth': maxWidth
    };
    var fontSize = this.calculateFontSize(text, options);
    this.context.setFont(fontSize, 'sans-serif');

    var split = this.splitLines(text, maxWidth);

    this.placeText(split, fontSize, canvas.width);
  };

  Memeify.prototype.calculateFontSize = function(text, options) {
    var initialSize = options.initialFontSize;
    while (this.context.getTextWidth(text) > options.maxWidth) {
      if (initialSize == options.minFontSize) {
        break;
      }
      initialSize -= 2;
      this.context.setFont(initialSize, "sans-serif");
    }
    return initialSize;
  };

  Memeify.prototype.splitLines = function(text, maxWidth) {
    var result = [];
    var words = text.split(' ');
    var line = '';
    for(var i = 0; i < words.length; i++) {
      var currentWord = words[i];
      var width = this.context.getTextWidth(line + " " + currentWord);
      if (width < maxWidth) {
        line += currentWord +  " ";
      } else {
        this._pushSplitLine(result,line);
        line = currentWord;
      }
    }
    this._pushSplitLine(result, line);
    return result;
  };

  Memeify.prototype._pushSplitLine = function(result, line) {
    if (line != "") {
      result.push(line.trim());
    }
  };

  Memeify.prototype.placeText = function(rows, fontSize, width) {
    for (var i = 0; i < rows.length; i++) {
      var currentRow = rows[i];
      var center = ((width - this.context.getTextWidth(currentRow)) / 2);
      if (i == 0) {
        this.context.drawText(currentRow, center, fontSize);
      } else {
        this.context.drawText(currentRow, center, (fontSize * (i + 1)));
      }
    }
  };

  Memeify.prototype.placeBottomText = function(rows, fontSize, width, height) {
    var count = 0;
    for(var i = rows.length; i > 0; i--) {
      var currentRow = rows[i - 1];
      var center = ((width - this.context.getTextWidth(currentRow)) / 2);
      if (count == 0) {
        this.context.drawText(currentRow, center, height - fontSize);
      } else {
        this.context.drawText(currentRow, center, height - (fontSize * count));
      }
      count += 1;
    }
  };

  return Memeify;
})();
