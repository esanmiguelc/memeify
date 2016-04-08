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

  it("sets the font size and style", function() {
    Memeify.createMeme(image, canvas, "", "");

    expect(context.font).toBe("48px sans-serif");
  });

  it("resizes the font if text is too big", function() {
    Memeify.createMeme(image, canvas, "hellii", "");

    expect(context.font).toBe("44px sans-serif")
  });

  it("only resizes up to 16px", function() {
    Memeify.createMeme(image, canvas, "super long text", "");

    expect(context.font).toBe("16px sans-serif")
  });

  it("calls fill text for the top text with some padding", function() {
    spyOn(context, 'fillText');
    var topText = "text"
    Memeify.createMeme(image, canvas, topText, "");

    expect(context.fillText)
      .toHaveBeenCalledWith(topText, jasmine.any(Number), 58);
  });

  it("centers the text", function() {
    spyOn(context, 'fillText');
    var fakeMeasure = jasmine.createSpy("context");
    spyOn(context, 'measureText').and.returnValue(fakeMeasure);
    fakeMeasure.width = 50;
    var topText = "text"

    Memeify.createMeme(image, canvas, topText, "");

    expect(context.fillText)
      .toHaveBeenCalledWith(topText, 25, jasmine.any(Number));
  });

  it("splits into multiple lines", function() {
    spyOn(context, 'fillText');
    Memeify.createMeme(image, canvas, "super long text", "");

    expect(context.fillText).toHaveBeenCalledTimes(2);
    expect(context.fillText.calls.argsFor(0)).toEqual(["super long ", 10.41796875, 10]);
  });

  it("sets the image", function() {
    spyOn(context, 'drawImage');

    Memeify.createMeme(image, canvas, "", "");

    expect(context.drawImage).toHaveBeenCalledWith(jasmine.any(Image), 0, 0);
  });

  describe(".calculateFontSize", function() {
    it("maintains the font size when it fits", function() {
      var context = new FakeContext();
      var text = 'test';
      var options = {
        'minFontSize':  16,
        'initialFontSize': 48,
        'maxWidth': 100
      };
      var fontSize = Memeify.calculateFontSize(context, text, options);

      expect(fontSize).toBe(48);
    });

    it("reduces the font size when it is too big", function() {
      var context = new FakeContext();
      context.setTextWidthResults([101, 100]);
      var text = 'hello';
      var options = {
        'minFontSize':  16,
        'initialFontSize': 48,
        'maxWidth': 100
      };

      var fontSize = Memeify.calculateFontSize(context, text, options);

      expect(fontSize).toBe(46);
    });

    it("reduces the font size multiple times until it reaches lowest size", function() {
      var context = new FakeContext();
      context.setTextWidthResults([102, 101]);
      var text = 'hello';
      var options = {
        'minFontSize':  16,
        'initialFontSize': 20,
        'maxWidth': 100
      };

      var fontSize = Memeify.calculateFontSize(context, text, options);

      expect(fontSize).toBe(options.minFontSize);
    });
  });
});
