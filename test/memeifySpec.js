'use strict';
describe("Memeify", function() {

  var canvas;
  var context;
  var image;

  beforeEach(function() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    image = new Image();
    canvas.width = 100;
    canvas.height = 100;
  });

  describe("#createMeme", function() {
    var memeify;
    var wrapper;

    beforeEach(function() {
      wrapper = new ContextWrapper(context);
      memeify = new Memeify(wrapper);
    });

    it("sets the font size and style", function() {
      memeify.createMeme(image, canvas, "", "");

      expect(wrapper.getFont()).toBe("48px sans-serif");
    });

    it("resizes the font if text is too big", function() {
      memeify.createMeme(image, canvas, "hellii", "");

      expect(wrapper.getFont()).toBe("44px sans-serif")
    });

    it("only resizes up to 16px", function() {
      memeify.createMeme(image, canvas, "super long text", "");

      expect(wrapper.getFont()).toBe("16px sans-serif")
    });

    it("calls fill text for the top text with some padding", function() {
      spyOn(wrapper, 'drawText');
      var topText = "text"
        memeify.createMeme(image, canvas, topText, "");

      expect(wrapper.drawText)
        .toHaveBeenCalledWith(topText, jasmine.any(Number), 48);
    });

    it("centers the text", function() {
      spyOn(context, 'fillText');
      var fakeMeasure = jasmine.createSpy("context");
      spyOn(context, 'measureText').and.returnValue(fakeMeasure);
      fakeMeasure.width = 50;
      var topText = "text";

      memeify.createMeme(image, canvas, topText, "");

      expect(context.fillText)
        .toHaveBeenCalledWith(topText, 25, jasmine.any(Number));
    });

    it("splits into multiple lines", function() {
      spyOn(context, 'fillText');
      memeify.createMeme(image, canvas, "super long text", "");

      expect(context.fillText).toHaveBeenCalledTimes(2);
    });

    it("sets the image", function() {
      spyOn(context, 'drawImage');

      memeify.createMeme(image, canvas, "", "");

      expect(context.drawImage).toHaveBeenCalledWith(jasmine.any(Image), 0, 0);
    });
  });

  describe("#splitLines", function() {

    it("keeps it in one line if it fits in one line", function() {
      var context = new FakeContext();
      var memeify = new Memeify(context);

      context.setTextWidthResults([50, 60]);
      var result = memeify.splitLines("long text", 100);

      expect(result).toEqual(["long text"]);
    });

    it("splits the line if its too long", function() {
      var context = new FakeContext();
      var memeify = new Memeify(context);

      context.setTextWidthResults([10, 15, 101]);
      var result = memeify.splitLines("super long text", 100);

      expect(result).toEqual(["super long", "text"]);
    });
  });

  describe("#placeText", function() {
    var context;
    var memeify;

    beforeEach(function() {
      context = new FakeContext();
      memeify = new Memeify(context);
    });

    it("places the first row in the correct position", function() {
      var rows = ['hello']
      var fontSize = 32;

      context.setTextWidthResults([50]);
      memeify.placeText(rows, fontSize, 100);

      var firstArguments = {
        'fontSize': fontSize,
        'center': 25,
        'line': rows[0]
      };

      expect(context.drawTextCalls[0]).toEqual(firstArguments);
    });

    it("places the second row directly below the first one", function() {
      var rows = ['hello', 'world']
      var fontSize = 32;

      context.setTextWidthResults([50, 50]);
      memeify.placeText(rows, fontSize, 100);

      var secondArguments = {
        'fontSize': fontSize + fontSize,
        'center': 25,
        'line': rows[1]
      };

      expect(context.drawTextCalls[1]).toEqual(secondArguments);
    });

    it("places the third row directly below the second one", function() {
      var rows = ['hello', 'world', 'third']
      var fontSize = 32;

      context.setTextWidthResults([50, 50, 50]);
      memeify.placeText(rows, fontSize, 100);

      var thirdArguments = {
        'fontSize': fontSize * 3,
        'center': 25,
        'line': rows[2]
      };

      expect(context.drawTextCalls[2]).toEqual(thirdArguments);
    });
  });

  describe("#calculateFontSize", function() {
    var context;
    var memeify;

    beforeEach(function() {
      context = new FakeContext();
      memeify = new Memeify(context);
    });

    it("maintains the font size when it fits", function() {
      var text = 'test';
      var options = {
        'minFontSize':  16,
        'initialFontSize': 48,
        'maxWidth': 100
      };
      var fontSize = memeify.calculateFontSize(text, options);

      expect(fontSize).toBe(48);
    });

    it("reduces the font size when it is too big", function() {
      context.setTextWidthResults([101, 100]);
      var text = 'hello';
      var options = {
        'minFontSize':  16,
        'initialFontSize': 48,
        'maxWidth': 100
      };

      var fontSize = memeify.calculateFontSize(text, options);

      expect(fontSize).toBe(46);
    });

    it("reduces the font size multiple times until it reaches lowest size", function() {
      context.setTextWidthResults([102, 101]);
      var text = 'hello';
      var options = {
        'minFontSize':  16,
        'initialFontSize': 20,
        'maxWidth': 100
      };

      var fontSize = memeify.calculateFontSize(text, options);

      expect(fontSize).toBe(options.minFontSize);
    });
  });
});
