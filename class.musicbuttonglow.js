 var L;
 (function(){
 L.pipe.MusicButtonGlow = function(letter, parent)
    {
	L.objects.Sprite.call(this, letter + "Glow");
	this.centerHandle();
	this.alpha = 0;
	this.parent = parent;
    };

    L.pipe.MusicButtonGlow.prototype = new L.objects.Sprite;
    L.pipe.MusicButtonGlow.constructor = L.pipe.MusicButtonGlow;

    L.pipe.MusicButtonGlow.prototype.update = function(dt)
    {
	this.setScale((1-this.alpha)/8+1);
	if (this.alpha > 0)
	{


	    this.alpha -= 0.8 * dt;
	    if (this.alpha < 0)
	    {
		this.alpha = 0;
	    }
	}
    };
})();