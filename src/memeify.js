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
    for(i = 0; i < words.length; i++) {
      var currentWord = words[i];
      width = this.context.getTextWidth(line + " " + currentWord);
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

  Memeify.prototype._fitText = function (canvas, text, maxWidth) {

    options = {
      'minFontSize': 16,
      'initialFontSize': 48,
      'maxWidth': maxWidth
    };
    var fontSize = this.calculateFontSize(text, options);
    this.context.setFont(fontSize, 'sans-serif');

    var split = this.splitLines(text, maxWidth);
    for (i = 0; i < split.length; i++) {
      var currentRow = split[i];
      if (i == 0) {
        _renderText(canvas, this.context, currentRow, fontSize);
      } else {
        _renderText(canvas, this.context, currentRow, fontSize + fontSize);
      }
    };
  };

  var _renderText = function (canvas, context, line, y) {
      var center = ((canvas.width - context.getTextWidth(line)) / 2);
      context.drawText(line, center, y);
  };

  return Memeify;
})();
