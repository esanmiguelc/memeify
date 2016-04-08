var Memeify;

Memeify = (function() {

  function Memeify() {}

  Memeify.createMeme = function(image, canvas, topText, bottomText) {
    var context = canvas.getContext('2d');
    var maxWidth = (canvas.width * 0.90);
    context.drawImage(image, 0, 0);

    _fitText(canvas, context, topText, maxWidth);
  };

  Memeify.calculateFontSize = function(context, text, options) {
    var initialSize = options.initialFontSize;
    while (context.getTextWidth(text) > options.maxWidth) {
      if (initialSize == options.minFontSize) {
        break;
      }
      initialSize -= 2;
    }
    return initialSize;
  };

  var _fitText = function (canvas, context, text, maxWidth) {
    var fontSize = 48;
    context.font = fontSize + "px sans-serif";
    var words = text.split(' ');
    var line = '';
    var y = 10;

    var textWidth = context.measureText(text).width;
    while (textWidth > maxWidth) {
      if (fontSize == 16) {
        break;
      }
      fontSize -= 2;
      context.font = fontSize + "px sans-serif";
      textWidth = context.measureText(text).width;
    }

    if (textWidth < maxWidth) {
      _renderText(canvas, context, text, y + fontSize);
    } else {
      for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
          _renderText(canvas, context, line, y);
          line = words[i] + ' ';
          y += (fontSize + 5);
        } else {
          line = testLine;
        }
      }
      _renderText(canvas, context, line, y);
    }
  };

  var _renderText = function (canvas, context, line, y) {
      var center = ((canvas.width - context.measureText(line).width) / 2);
      context.fillText(line, center, y);
  };

  return Memeify;
})();
