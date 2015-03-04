var L;
(function(){

L.pipe.MusicButton = function(buttonNumber, letters, hypotneuse,modes)
    {
	var letter = this.letter = letters[buttonNumber];
	var angle = -Math.PI * 2 / 7 * buttonNumber + Math.PI / 2;
	var sin = Math.sin(angle);
	var cos = Math.cos(angle);
	var xCoord = cos * hypotneuse;
	var yCoord = -sin * hypotneuse;
	L.objects.Sprite.call(this, letter + "NoteButton");
	this.centerHandle();
	this.clock = 0;
	this.glow = new L.pipe.MusicButtonGlow(letter, this);

//this.offset.x=50;
	this.x = this.glow.x = xCoord + L.system.width / 2;
	this.y = this.glow.y = yCoord + L.system.height / 2;
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
	this.ripple.rippleArray.push([1,x,y]);
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
    L.pipe.MusicButton.prototype.update = function(dt)
    {
	var pi2 = Math.PI*2;
	this.clock += dt;
	this.offset.x = Math.sin(pi2*this.clock/4)*10;
	this.offset.y = Math.cos(pi2*this.clock/4)*10;
	this.glow.x = this.getX();
	this.glow.y = this.getY();
    };
    })();