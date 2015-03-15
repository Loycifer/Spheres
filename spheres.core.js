/* global L */

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
    L.load.audio("ionianSweep", "ionianSweep");
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

    var titleScreen = new L.objects.Scene("titleScreen");
    titleScreen.bgFill = "#000000";
    var gameBoard = new L.objects.Scene("gameBoard");
    gameBoard.bgFill = "#000000";
    var rippleLayer = gameBoard.addLayer("ripples");
    rippleLayer.isClickable = false;
    var buttonLayer = gameBoard.addLayer("buttons");
    var glowLayer = gameBoard.addLayer("glows");
    glowLayer.isClickable = false;
    var buttonArray = L.pipe.buttonArray = [];
    var hypotneuse = 210;
    var letters = L.pipe.letters = ["c", "d", "e", "f", "g", "a", "b", "h"];
    L.pipe.colors = ["#fe00d4", "#ff0000", "#ff8000", "#ffff00", "#26ff00", "#00a7ff", "#8b00ff"];
    var modes = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];

    titleScreen.addLayerObject(rippleLayer);
    titleScreen.addLayerObject(buttonLayer);
    titleScreen.addLayerObject(glowLayer);
    var menuLayer = titleScreen.addLayer("menuLayer");


    var titleString = new L.objects.Textbox("Spheres");
    titleString.x = L.system.width / 2;
    titleString.y = L.system.height / 5;
    titleString.textFill = "white";
    titleString.textStrokeStyle = "black";
    titleString.textLineWidth = 8;
    titleString.alignment = 'center';
    titleString.fontSize = 60;
    titleString.autoSize();
    titleString.isClickable = false;

    L.pipe.menuString = function(text)
    {
	L.objects.Textbox.call(this, text);
	this.x = L.system.width / 2;
	this.textFill = "grey";
	this.textStrokeStyle = "black";
	this.textLineWidth = 8;
	this.alignment = 'center';
	this.fontSize = 50;
	this.maxScale = 1.2;
	this.centerY();
	this.autoSize();
	this.autoSize();

    };
    L.pipe.menuString.prototype = new L.objects.Textbox;
    L.pipe.menuString.constructor = L.pipe.menuString;

    L.pipe.menuString.prototype.update = function(dt)
    {

	if (Math.jordanCurve(L.mouse.x, L.mouse.y, this.getVertices()))
	{
	    var targetScale = this.maxScale;
	    if (this.scale < targetScale)
	    {
		this.textFill = "white";
		this.scale += 2 * dt;
		this.autoSize();
	    }
	    if (this.scale > targetScale)
	    {
		this.scale = targetScale;
	    }
	}
	else
	{
	    if (this.scale > 1)
	    {
		this.textFill = "grey";
		this.scale -= 4 * dt;
		this.autoSize();
	    }
	    if (this.scale < 1)
	    {
		this.scale = 1;
	    }
	}

    };

    var playString = new L.pipe.menuString('play');
    playString.y = L.system.height / 2;
    var goToGame = function()
    {
	gameBoard.setScene();
    };
    playString.onClick = goToGame;
    menuLayer.addObject(titleString);
    menuLayer.addObject(playString);



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





    L.pipe.songGenerator.makeSong(256);
    var songPlayer = L.pipe.songGenerator.moveToTimeline(new L.objects.Timeline());
    gameBoard.layers.background.addObject(songPlayer);
    songPlayer.play();

    L.pipe.songGenerator.makeSongFromLetters(["c", "d", "e", "f", "g", "a", "b", "h"]);
    var introSongPLayer = L.pipe.songGenerator.moveToTimeline(new L.objects.Timeline());
    titleScreen.layers.background.addObject(introSongPLayer);
    introSongPLayer.play();


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

    var levelState = L.pipe.levelState = {};
    levelState.mode = "Ionian";
    levelState.difficulty = 0;
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

    if (localStorage.getItem('player'))
    {
	var JSONprofile = JSON.parse(localStorage.getItem('player'));

	for (var i = 0; i < 7; i++)
	{
	    playerProfile[modes[i]] = JSONprofile[modes[i]];
	}
    }


    var ionianSweep = new L.objects.Music("ionianSweep");
    ionianSweep.play(.1);
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


    titleScreen.keymap = keyControl;
    titleScreen.setScene();
};
