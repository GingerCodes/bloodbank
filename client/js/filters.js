

/**
 * @method Object ID to Date
 * @param  {String} objectID The Object ID as String
 * @return {Date}   Creation Date of ObjectId
 */
app.filter("objectIDtoDate", function () {
    return function (objectID) {
        return new Date(parseInt(("" + objectID).substr(0, 8), 16) * 1000);
    };
});