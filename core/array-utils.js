const crypto = require('crypto');

/**
 * Shuffles an array using Fisher-Yates Shuffle
 */
Array.prototype.shuffle = function() {
	var currentIndex = this.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = crypto.randomInt(currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = this[currentIndex];
		this[currentIndex] = this[randomIndex];
		this[randomIndex] = temporaryValue;
	}
	return this;
};