var db = require("../models")
module.exports = function(app) {
    app.get("/", function(req, res) {
        var headlineObject = {}
        headlineObject["articles"] = []

        db.Headline.find({$query: {saved: false} }).sort( { date: -1 })
        .then(function(found) {
            if (found.length > 0) {
                for (var i = 0; i < found.length; i ++ ) {
                    newObject = {
                        id: found[i]._id,
                        headline: found[i].headline,
                        summary: found[i].summary,
                        link: found[i].link,
                        photo: found[i].photo,
                        saved: found[i].saved,
                        notes: found[i].notes
                    }

                    headlineObject.articles.push(newObject);
                    if (i == (found.length - 1)) {

                        res.render("home", headlineObject)
                    }
                }
            }

            else {
                res.render("home")
            }

        });

    });

    app.get("/saved", function(req, res) {
        var headlineObject = {}

        headlineObject["articles"] = []

        db.Headline.find({saved: true}).sort({date: -1})
        .then( function(found) {

            if (found.length > 0) {
                for (var i = 0; i < found.length; i ++ ) {

                    console.log(found[i]);

                    newObject = {
                        id: found[i]._id,
                        headline: found[i].headline,
                        summary: found[i].summary,
                        link: found[i].link,
                        photo: found[i].photo,
                        saved: found[i].saved,
                        notes: found[i].notes
                    }

                    headlineObject.articles.push(newObject);

                    if (i == (found.length - 1)) {
                        res.render("saved", headlineObject)
                    }
                }
            }

            else {
                res.render("saved")
            }
        });
    });
}




