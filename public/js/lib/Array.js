/**
 * Checks if item is in array
 * @param obj
 * @return {Boolean}
 */
Array.prototype.contains = function(obj) {
    var result = false;
    for (var i=0; i< this.length; i++) {
        if (this[i] == obj) {
            result = true;
            break;
        }
    }
    return result;
};
