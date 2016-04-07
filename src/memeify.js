var Memeify;

Memeify = (function() {

  function Memeify() {}

  Memeify.createMeme = function(image, canvas, topText, bottomText) {
    var context = canvas.getContext('2d');
    var fontSize = 48;
    context.font = fontSize + "px sans-serif";
    var topTextWidth = context.measureText(topText).width;
    var words = topText.split(' ');
    var line = '';
    var center = ((canvas.width - topTextWidth) / 2);
    var maxWidth = (canvas.width * 0.90);
    var y = 10;

    while (topTextWidth > maxWidth) {
      if (fontSize == 16) {
        break;
      }
      fontSize -= 2;
      context.font = fontSize + "px sans-serif";
      topTextWidth = context.measureText(topText).width;
    }

    if (topTextWidth < maxWidth) {
      context.fillText(topText, center, y + fontSize);
    } else {
      for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
          context.fillText(line, center, y);
          line = words[i] + ' ';
          y += (fontSize + 5);
        } else {
          line = testLine;
        }
      }
      context.fillText(line, center, y);
    }
  };

  return Memeify;
})();
