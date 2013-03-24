
function isUndefined(val) {
    return typeof val === "undefined";
}

function isDefined(val) {
    return !isUndefined(val);
}

function isNotEmpty(val) {
    return (isDefined(val) && val.length > 0);
}

function isEmpty(val) {
    return !isNotEmpty(val);
}

exports.isDefined = isDefined;

exports.isUndefined = isUndefined;

exports.isNotEmpty = isNotEmpty;

exports.isEmpty = isEmpty;

exports.getDateString = function() {
    var date = Date.now();
    return date.getFullYear() + '-' +
        date.getMonth() + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes();
};
