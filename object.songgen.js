/* global L */

L.pipe.songGenerator =
{
    songArray: [],
    noteLength: 0.5,
    makePlayFunction: function(letter)
    {
	var letters = L.pipe.letters;
	var buttonArray = L.pipe.buttonArray;
	if (letter.toLowerCase() === "h")
	{
	    var thisButton = buttonArray[0];
	    return (thisButton.playHighComp).bind(thisButton);
	}
	else
	{
	    var thisButton = buttonArray[letters.indexOf(letter.toLowerCase())];
	    return (thisButton.playComp).bind(thisButton);
	}
    },
    getNote: function(index)
    {
	return songArray[index];
    },
    makeSong: function(length, tempo) {
	this.noteLength = 60 / tempo || 1;
	var letters = L.pipe.letters;
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
    checkNote: function(index, letter)
    {
	var targetLetter = this.songArray[index][0];
	return (letter === targetLetter || (letter === "c" && targetLetter === "h"));
    },
    makeSongFromLetters: function(lettersArray)
    {
	this.songArray = [];
	var length = lettersArray.length;
	for (var i = 0; i < length; i++)
	{
	    this.songArray.push([lettersArray[i], 1]);
	}

    },
    moveToTimeline: function(timeline)
    {
	var songLength = this.songArray.length;
	var noteOn = 0;
	for (var i = 0; i < songLength; i++)
	{

	    var currentNote = this.songArray[i][0];
	    timeline.addEvent(noteOn, this.makePlayFunction(currentNote));

	    noteOn = noteOn + this.noteLength * this.songArray[i][1];
	}
	timeline.stopAfterEvent = 0;
	return timeline;
    }
};