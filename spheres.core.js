var L; //Do not remove this line or overwrite global variable L


L.game.settings = function() {


//This is where to adjust engine settings
    L.system.width = 900;
    L.system.height = 600;
//L.system.canvasLocation = document.getElementById("YOURDIV");
    L.system.fullscreen = true;
    L.system.orientation = "landscape";
    L.system.resourcePath = "games/spheres/resources/";
};
L.game.resources = function() {
//This is where you load resources such as textures and audio
//Textures are stored in L.texture[x], where x is the texture's name
//Sounds and music are similarly stored in L.sound[x] and
//L.music[x]

//eg. L.load.texture("littleDude.png", "little-dude");
    var load = L.load.texture;
    L.system.audioType = ".wav";
    var letters = ["c", "d", "e", "f", "g", "a", "b", "h"];
    var soundNames = ["", "dor", "phr", "lyd", "mix", "aeo", "loc"];
    var musicalModes = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
    for (var i = 0, letter = "c"; i < 8; i++, letter = letters[i])
    {
	if (letter !== "h")
	{
	    load(letter + "noteButton.png", letter + "NoteButton");
	    load(letter + "glow.png", letter + "Glow");
	}
	for (var j = 0; j < 7; j++)
	{
	    var soundName = soundNames[j];
	    var musicalMode = musicalModes[j];
	    L.load.audio(soundName + letter, musicalMode + "-" + letter);
	}
    }
    load("note.png", "lifeNote");
};
L.game.main = function() {
//This is where to build game logic such as scenes, sprites,
//behaviours, and input handling
//Scenes are stores in L.scene[x], where x is the name of the scene

//eg. mainScene = new L.objects.Scene("mainScene");
//    mainScene.addLayer("background");
//    mainScene.layers["background"].addObject(someExistingObject);
//    mainScene.setScene();

    var testScene = new L.objects.Scene("testScene");
    testScene.bgFill = "#000000";
    var rippleLayer = testScene.addLayer("ripples");
    var buttonLayer = testScene.addLayer("buttons");
    var glowLayer = testScene.addLayer("glows");
    glowLayer.isClickable = false;
    var buttonArray = [];
    var hypotneuse = 200;
    var letters = ["c", "d", "e", "f", "g", "a", "b"];
    L.pipe.colors = ["#fe00d4", "#ff0000", "#ff8000", "#ffff00", "#26ff00", "#00a7ff", "#8b00ff"];
    var modes = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
    for (var i = 0; i < 7; i++)
    {
	var letter = letters[i];
	var angle = -Math.PI * 2 / 7 * i + Math.PI / 2;
	var sin = Math.sin(angle);
	var cos = Math.cos(angle);
	var xCoord = cos * hypotneuse;
	var yCoord = -sin * hypotneuse;
	var button = new L.objects.Sprite(letter + "NoteButton");
	var buttonGlow = new L.objects.Sprite(letter + "Glow");
	buttonGlow.centerHandle();
	buttonGlow.alpha = 0;
	button.glow = buttonGlow;
	buttonGlow.parent = button;
	button.centerHandle();
	button.x = buttonGlow.x = xCoord + L.system.width / 2;
	button.y = buttonGlow.y = yCoord + L.system.height / 2;


	button.ripple = new L.pipe.Ripple(i);
	button.sounds = {};
	button.addRipple = function()
	{
	    this.ripple.rippleArray.push(1);
	};
	button.currentMode = "Aeolian";
	for (var k = 0; k < 7; k++)
	{
	    var currentMode = modes[k];
	    button.sounds[currentMode] = new L.objects.soundFX(currentMode + "-" + letter);
	}
	button.play = function(glow)
	{
	    this.sounds[this.currentMode].play(1);
	    if (glow)
	    {
		this.glow.alpha = 1;
		this.addRipple();
	    }
	};
	if (letter === "c")
	{
	    button.sounds2 = {};
	    button.playHigh = function(glow)
	    {
		this.sounds2[this.currentMode].play(1);
		if (glow)
		{
		    this.glow.alpha = 1;
		    this.addRipple();
		}
	    };
	    for (var k = 0; k < 7; k++)
	    {
		var currentMode = modes[k];
		button.sounds2[currentMode] = new L.objects.soundFX(currentMode + "-h");
	    }
	    button.onClick = function(x)
	    {
		if (x >= this.x)
		{
		    this.play(true);
		} else {
		    this.playHigh(true);
		}
	    };
	} else {
	    button.onClick = function()
	    {
		this.play(true);
	    };
	}
	button.update = function()
	{
	    this.ripple.x = this.x;
	    this.ripple.y = this.y;
	};
	buttonGlow.update = function(dt)
	{
	    this.x = this.parent.x;
	    this.y = this.parent.y;
	    if (this.alpha > 0)
	    {
		this.alpha -= 0.8 * dt;
		if (this.alpha < 0)
		{
		    this.alpha = 0;
		}
	    }
	};
	buttonLayer.addObject(button);
	glowLayer.addObject(buttonGlow);
	rippleLayer.addObject(button.ripple);
	buttonArray.push(button);
    }
    var life = new L.objects.Sprite("lifeNote");
    testScene.layers.background.addObject(life);


    var levelState = {};
    levelState.mode = "Ionian";
    levelState.setMode = function(mode)
    {
	this.mode = mode;
	buttonArray.mapQuick(function(button) {
	    button.currentMode = mode;
	});
    };


    var keyControl = new L.input.Keymap();
    var getClickFunc = function(x)
    {
	var func = function() {
	    buttonArray[x].play(true);
	};
	return func;
    };
    for (var i = 0; i < 7; i++)
    {
	keyControl.bindKey((i + 1).toString(), "keydown", getClickFunc(i)
	);
    }
    keyControl.bindKey("8", "keydown", function() {
	buttonArray["0"].playHigh(true);
    });
    keyControl.bindKey("c", "keydown", function() {
	levelState.setMode("Ionian");
    });
    keyControl.bindKey("d", "keydown", function() {
	levelState.setMode("Dorian");
    });
    keyControl.bindKey("e", "keydown", function() {
	levelState.setMode("Phrygian");
    });
    keyControl.bindKey("f", "keydown", function() {
	levelState.setMode("Lydian");
    });
    keyControl.bindKey("g", "keydown", function() {
	levelState.setMode("Mixolydian");
    });
    keyControl.bindKey("a", "keydown", function() {
	levelState.setMode("Aeolian");
    });
    keyControl.bindKey("b", "keydown", function() {
	levelState.setMode("Locrian");
    });

    testScene.keymap = keyControl;
    testScene.setScene();
};
