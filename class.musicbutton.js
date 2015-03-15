var L;
(function(){

L.pipe.MusicButton = function(buttonNumber, letters, hypotneuse,modes)
    {
	var letter = this.letter = letters[buttonNumber];
	L.objects.Sprite.call(this, letter + "NoteButton");
	this.hypotneuse = hypotneuse;
	this.posAngle = -Math.PI * 2 / 7 * buttonNumber + Math.PI / 2;
	this.sin = Math.sin(this.posAngle);
	this.cos = Math.cos(this.posAngle);



	this.centerHandle();
	this.noteRatio = Math.pow(2,(buttonNumber/7));
	this.wobbleSpeed = 0.3;
	this.clock = Math.random();
	this.glow = new L.pipe.MusicButtonGlow(letter, this);
this.setHypotneuse(hypotneuse);
//this.offset.x=50;

	this.ripple = new L.pipe.Ripple(buttonNumber);
	this.sounds = {};
	for (var k = 0; k < 7; k++)
	{
	    var currentMode = modes[k];
	    this.sounds[currentMode] = new L.objects.soundFX(currentMode + "-" + letter);
	}
	if (this.letter === "c")
	{
	    this.sounds2 = {};
	    for (var k = 0; k < 7; k++)
	    {
		var currentMode = modes[k];
		this.sounds2[currentMode] = new L.objects.soundFX(currentMode + "-h");
	    }
	    this.onClick = function(x)
	    {
		if (x >= this.getX())
		{
		    this.play(true);
		} else {
		    this.playHigh(true);
		}
	    };
	}
	else
	{
	    this.onClick = function()
	    {
		this.play(true);
	    };
	}
	this.currentMode = "Ionian";

    };

    L.pipe.MusicButton.prototype = new L.objects.Sprite;
    L.pipe.MusicButton.constructor = L.pipe.MusicButton;

    L.pipe.MusicButton.prototype.addRipple = function(x,y)
    {
	this.ripple.rippleArray.push([1,x,y,49*this.scale.x]);
    };
    L.pipe.MusicButton.prototype.play = function(glow)
    {
	this.sounds[this.currentMode].play(1);
	if (glow)
	{
	    this.glow.alpha = 1;
	   this.addRipple(this.getX(),this.getY());
	}
    };
     L.pipe.MusicButton.prototype.playComp = function(glow)
      {
	this.sounds[this.currentMode].play(1);
	if (L.pipe.levelState.difficulty < 1)
	{
	    this.glow.alpha = 1;
	   this.addRipple(this.getX(),this.getY());
	}
    };
    L.pipe.MusicButton.prototype.playHigh = function(glow)
    {
	if (this.letter === 'c')
	{
	    this.sounds2[this.currentMode].play(1);
	    if (glow)
	    {
		this.glow.alpha = 1;
		this.addRipple(this.getX(),this.getY());
	    }
	}
    };

    L.pipe.MusicButton.prototype.playHighComp = function(glow)
    {
	if (this.letter === 'c')
	{
	    this.sounds2[this.currentMode].play(1);
	    if (L.pipe.levelState.difficulty < 1)
	    {
		this.glow.alpha = 1;
		this.addRipple(this.getX(),this.getY());
	    }
	}
    };
    L.pipe.MusicButton.prototype.update = function(dt)
    {
	this.clock += dt;
	var freq = Math.PI*2*this.noteRatio*this.clock * this.wobbleSpeed;
	this.offset.x = Math.sin(freq)*5;
	this.offset.y = Math.cos(0.8*freq)*5;
	this.glow.x = this.getX();
	this.glow.y = this.getY();
	if (Math.jordanCurve(L.mouse.x, L.mouse.y, this.getVertices()) && this.isClickedPrecise(L.mouse.x,L.mouse.y))
	{
	    if (this.scale.x < 1.1)
	    {
		this.setScale(this.scale.x+(dt));
	    }
	    (this.scale.x > 1.1)?this.setScale(1.1):0;


	}
	else
	{
	    if (this.scale.x > 1)
	    {
		this.setScale(this.scale.x-(dt));
	    }
	    (this.scale.x < 1)?this.setScale(1):0;

	}
    };
    })();

     L.pipe.MusicButton.prototype.setHypotneuse = function(distance)
     {
	this.hypotneuse = distance;

	var xCoord = this.cos * this.hypotneuse;
	var yCoord = -this.sin * this.hypotneuse;
	this.x = this.glow.x = xCoord + L.system.width / 2;
	this.y = this.glow.y = yCoord + L.system.height / 2;
     };