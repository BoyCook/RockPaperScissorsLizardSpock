
function Move(name) {
	this.name = name;
	this.beats = {};
	this.loses = {};	
}

Move.prototype.animate = function() {
	//TODO: implement
};

Move.prototype.attack = function(other) {
	if (this.name == other.name) { 
		return 'tie';
	}
};

