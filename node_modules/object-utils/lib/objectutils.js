
function isUndefined(o) {
    return checkType(o, "undefined");
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

function isNotObject(o) {
	return !isObject(o);
}

function isObject(o) {
    return checkType(o, "object");
}

function isNumber(o) {
    return checkType(o, "number");
}

function isString(o) {
    return checkType(o, "string");
}

function checkType(o, type) {
    return typeof o === type;
}

exports.isDefined = isDefined;
exports.isUndefined = isUndefined;

exports.isEmpty = isEmpty;
exports.isNotEmpty = isNotEmpty;

exports.isObject = isObject;
exports.isNotObject = isNotObject;

exports.isNumber = isNumber;
exports.isString = isString;

exports.getDateString = function(date) {
    return date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes();
};
