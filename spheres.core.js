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

    var gameBoard = new L.objects.Scene("testScene");
    gameBoard.bgFill = "#000000";
    var rippleLayer = gameBoard.addLayer("ripples");
    rippleLayer.isClickable = false;
    var buttonLayer = gameBoard.addLayer("buttons");
    var glowLayer = gameBoard.addLayer("glows");
    glowLayer.isClickable = false;
    var buttonArray = [];
    var hypotneuse = 210;
    var letters = ["c", "d", "e", "f", "g", "a", "b", "h"];
    L.pipe.colors = ["#fe00d4", "#ff0000", "#ff8000", "#ffff00", "#26ff00", "#00a7ff", "#8b00ff"];
    var modes = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];

    for (var i = 0; i < 7; i++)
    {
	var currentButton = new L.pipe.MusicButton(i, letters, hypotneuse, modes);
	buttonLayer.addObject(currentButton);
	glowLayer.addObject(currentButton.glow);
	rippleLayer.addObject(currentButton.ripple);
	buttonArray.push(currentButton);
    }
    //var life = new L.objects.Sprite("lifeNote");
    //testScene.layers.background.addObject(life);

    var playNote = {
	c: function() {
	    buttonArray[0].play(false);
	},
	d: function() {
	    buttonArray[1].play(false);
	},
	e: function() {
	    buttonArray[2].play(false);
	},
	f: function() {
	    buttonArray[3].play(false);
	},
	g: function() {
	    buttonArray[4].play(false);
	},
	a: function() {
	    buttonArray[5].play(false);
	},
	b: function() {
	    buttonArray[6].play(false);
	},
	h: function() {
	    buttonArray[0].playHigh(false);
	}
    };
    var playNoteWithGlow = {
	c: function() {
	    buttonArray[0].play(true);
	},
	d: function() {
	    buttonArray[1].play(true);
	},
	e: function() {
	    buttonArray[2].play(true);
	},
	f: function() {
	    buttonArray[3].play(true);
	},
	g: function() {
	    buttonArray[4].play(true);
	},
	a: function() {
	    buttonArray[5].play(true);
	},
	b: function() {
	    buttonArray[6].play(true);
	},
	h: function() {
	    buttonArray[0].playHigh(true);
	}
    };


    L.pipe.songGenerator =
    {
	songArray: [],
	noteLength: 0.5,
	getNote: function(index)
	{
	    return songArray[index];
	},
	makeSong: function(length) {
	    this.songArray = [];
	    for (var i = 0; i < length; i++)
	    {
		if (i < 2)
		{
		    this.songArray.push([letters.getRandomElement(), 1]);
		} else
		{
		    var potentialNote = letters.getRandomElement();
		    var minusOne = this.songArray[i - 1][0];
		    var minusTwo = this.songArray[i - 2][0];
		    while (minusOne === minusTwo && potentialNote === minusOne)
		    {
			potentialNote = letters.getRandomElement();
		    }
		    this.songArray.push([potentialNote, 1]);
		}
	    }
	},
	moveToTimeline: function(timeline)
	{
	    var songLength = this.songArray.length;
	    var noteOn = 0;
	    for (var i = 0; i < songLength; i++)
	    {

		timeline.addEvent(noteOn, playNoteWithGlow[this.songArray[i][0]]);
		noteOn = noteOn + this.noteLength * this.songArray[i][1];
	    }
	    return timeline;
	}
    };

    L.pipe.songGenerator.makeSong(320);
    var songPlayer = L.pipe.songGenerator.moveToTimeline(new L.objects.Timeline());
    gameBoard.layers.background.addObject(songPlayer);
    songPlayer.play();

    var playerState = function()
    {
	this.name = "Pal";
	for (var modeNumber = 0; modeNumber < 7; modeNumber++)
	{

	    var currentMode = modes[modeNumber];
	    this[currentMode] = [];
	    for (var levelNumber = 0; levelNumber < 7; levelNumber++)
	    {
		this[currentMode][levelNumber] = 0;
	    }
	}

    };

    playerState.prototype.updateScore = function()
    {
	var mode = levelState.mode;
	var levelNumber = levelState.levelNumber;
	var newScore = levelState.score;
	if (newScore > this[mode][levelNumber])
	{
	    this[mode][levelNumber] = newScore;
	}
	localStorage.setItem('player', JSON.stringify(this));
    };

    var levelState = {};
    levelState.mode = "Ionian";
    levelState.setMode = function(mode)
    {
	this.mode = mode;
	buttonArray.mapQuick(function(button) {
	    button.currentMode = mode;
	});
    };
    levelState.score = 10;
    levelState.levelNumber = 0;

    var playerProfile = new playerState();

    if (localStorage.getItem('player') !== undefined)
    {
	var JSONprofile = JSON.parse(localStorage.getItem('player'));

	for (var i = 0; i < 7; i++)
	{
	    playerProfile[modes[i]] = JSONprofile[modes[i]];
	}
    }


   
    var keyControl = new L.input.Keymap();

    for (var i = 0; i < 7; i++)
    {
	keyControl.bindKey((i + 1).toString(), "keydown",
	(function(x) {
	    return function() {
		buttonArray[x].play(true);
	    };
	})(i));
    }

    keyControl.bindKey("8", "keydown", function() {
	buttonArray["0"].playHigh(true);
    });

    for (var i = 0; i < 7; i++)
    {
	keyControl.bindKey(letters[i], "keydown",
	(function(x) {
	    return function() {
		levelState.setMode(modes[x]);
	    };
	})(i));
    }


    gameBoard.keymap = keyControl;
    gameBoard.setScene();
};
