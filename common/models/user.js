module.exports = function (User) {

    User.countDonors = function (blood_group, location, cb) {

        var diff = 0.03

        var upper_lat = location.A + diff;
        var lower_lat = location.A - diff;
        var upper_lng = location.F + diff;
        var lower_lng = location.F - diff;

        User.count({
            "blood_group": blood_group,
            "location_details.geometry.location.G": {between: [lower_lat, upper_lat]},
            "location_details.geometry.location.K": {between: [lower_lng, upper_lng]}
        }, function (err, count) {
            if (err)
                throw err
            cb(null, count);
        });
    }

    User.remoteMethod(
            'countDonors',
            {
                accepts: [
                    {arg: 'blood_group', type: 'string', required: true},
                    {arg: 'location', type: 'object', required: true}
                ],
                returns: {arg: 'count', type: 'number'},
                description: "Returns the count of donors available for the given blood group in the provided location.",
            }
    );
};
