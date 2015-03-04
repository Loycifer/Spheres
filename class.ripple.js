var L;
L.pipe.Ripple = function(number)
{
    this.x = 0;
    this.y = 0;
    this.rippleArray = [];
    this.time = 4;
    this.distance = 250;
    this.color = L.pipe.colors[number];
    this.width = 6;
    this.Pi2 = Math.PI * 2;
};

L.pipe.Ripple.prototype.draw = function(layer)
{
    for (var i = 0, length = this.rippleArray.length; i < length; i++)
    {
	var Pi2 = this.Pi2;
	var currentRipple = this.rippleArray[i][0];
	var x = this.rippleArray[i][1];
	var y = this.rippleArray[i][2];
	layer.strokeStyle = this.color;
	var radius = 49 + (1 - currentRipple) * this.distance;
	layer.globalAlpha = currentRipple < 0.5 ? currentRipple * 2 : 1;
	layer.lineWidth = this.width * currentRipple;
	layer.beginPath();
	layer.arc(x, y, radius, 0, Pi2);
	layer.stroke();

	if (currentRipple >= 0.5)
	{
	    layer.globalAlpha = 2 * (currentRipple - 0.5);
	    layer.strokeStyle = "white";
	    layer.lineWidth /= 2;
	    layer.beginPath();
	    layer.arc(x, y, radius, 0, Pi2);
	    layer.stroke();
	}
    }
};

L.pipe.Ripple.prototype.update = function(dt)
{
    for (var i = 0, length = this.rippleArray.length; i < length; i++)
    {
	this.rippleArray[i][0] -= dt / this.time;
    }
    while (this.rippleArray[0] && this.rippleArray[0][0] <= 0)
    {
	this.rippleArray.shift();
    }
};