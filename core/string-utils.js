/**
 * Replaces the character(s) at the given index
 * @param {Number} index index to start replacement
 * @param {string} replacement the string to replace
 * @returns {string} string with replaced values
 */
String.prototype.replaceAt = function (index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

/**
 * Gets a list (string) of unique common letters from two strings (helper function)
 * @param {string} stringA
 * @param {string} stringB
 * @returns {string} a string of unique common letters from two strings
 */
function _intersect(stringA, stringB) {
	// For store in map for unique values
	const map = new Map();
	for (let a of stringA) {
		for (let b of stringB) {
			if (a == b) {
				map.set(a);
			}
		}
	}
	return Array.from(map.keys()).join('');
};

/**
 * @param {string} others the strings to intersect with this string
 * @returns {string} a string of unique characters shared between this string and others
 */
String.prototype.intersect = function (...others) {
	let out = this;
	for (let string of others) {
		out = _intersect(out, string);
		if (out.length == 0) {
			break;
		}
	}
	return out;
};

/**
 * @param {string} others the strings to combine with this string
 * @returns {string} a string of unique characters from this combined with other strings
 */
String.prototype.union = function (...others) {
	// For store in map for unique values
	const map = new Map();
	for (let c of this) {
		map.set(c);
	}
	for (let string of others) {
		for (let c of string) {
			map.set(c);
		}
	}
	return Array.from(map.keys()).join('');
};

/**
 * @param {string} others the strings to subtract from this string
 * @returns {string} a string of unique characters in this string that are not in the others
 */
String.prototype.subtract = function (...others) {
	// For store in map for unique values
	const map = new Map();
	for (let c of this) {
		map.set(c);
	}
	for (let string of others) {
		for (let c of string) {
			map.delete(c);
		}
	}
	return Array.from(map.keys()).join('');
};

/**
 * @param {string} other the strings to find the difference of
 * @returns {string} a string of unique characters that are not shared between the strings
 */
String.prototype.difference = function (other) {
	const union = this.union(other);
	const intersection = this.intersect(other);
	return union.subtract(intersection);
};

/**
 * @returns {string} a string of unique characters in this string
 */
String.prototype.unique = function () {
	const map = new Map();
	for (let c of this) {
		map.set(c);
	}
	return Array.from(map.keys()).join('');
};
