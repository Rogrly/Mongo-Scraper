var cheerio = require("cheerio");
var request = require("request");
var db = require("../models")

module.exports = function (app) {

    app.get("/api/all", function (req, res) {

        db.Headline.find({ $query: { saved: false } }).sort({ date: -1 })
            .then(function (response) {
                res.json(response.length)
                // res.json(response)
            })

    });

    app.get("/api/notes/all", function (req, res) {

        db.Note.find({})
            .then(function (response) {
                res.json(response)
                // res.json(response)
            })
    });

    // Post request to scrape from NPR News
    app.post("/api/scrape", function (req, res) {

        request("http://www.npr.org/sections/news/", function (error, response, html) {

            var $ = cheerio.load(html);

            console.log($("article.item").length)

            $("article.item").each(function (i, element) {


                var headline = $(element).find('.item-info').find('.title').find('a').text();
                var summary = $(element).find('.item-info').find('.teaser').find('a').text();
                var link = $(element).find('.item-info').find('.title').children().attr("href");
                var photo = $(element).find('.item-image').find('.imagewrap').find('a').find('img').attr("src");
                var date = $(element).find('.item-info').find('.teaser').find('a').find('time').attr("datetime");

                var headlineObject = {
                    headline: headline,
                    summary: summary,
                    link: link,
                    photo: photo,
                    date: date
                }

                db.Headline.create(headlineObject, function (error) {
                    if (error) console.log("Article already exists: " + headlineObject.headline)
                    else {
                        console.log("New article: " + headlineObject.headline);
                    }

                    if (i == ($("article.item").length - 1)) {
                        res.json("scrape complete")
                    }
                })

            });

        })
    });

    // Delete route for Saved articles 
    app.delete("/api/reduce", function (req, res) {

        db.Headline.find({ $query: { saved: false } }).sort({ date: -1 })
            .then(function (found) {

                console.log(found.length);
                var countLength = found.length;
                var overflow = countLength - 25;
                console.log(overflow)
                var overflowArray = [];

                for (var i = 0; i < (overflow); i++) {
                    overflowArray.push(found[25 + i]._id);
                    console.log(overflowArray)
                }

                db.Headline.remove({ _id: { $in: overflowArray } }, function (error, result) {

                    result["length"] = countLength;
                    console.log(result)
                    res.json(result)

                })

            });

    })

    app.put("/api/save/article/:id", function (req, res) {
        var articleId = req.params.id;

        db.Headline.findOneAndUpdate(
            { _id: articleId },
            {
                $set: { saved: true }
            }
        ).then(function (result) {
            res.json(result)
        })
    });


    app.put("/api/delete/article/:id", function (req, res) {
        var articleId = req.params.id;

        db.Headline.findOneAndUpdate(
            { _id: articleId },
            {
                $set: { saved: false }
            }
        ).then(function (result) {
            res.json(result)
        })
    });

    app.get("/api/notes/:id", function (req, res) {
        var articleId = req.params.id;

        db.Headline.findOne(
            { _id: articleId }
        )
            .populate("note")
            .then(function (result) {
                res.json(result)
            })
    });

    app.post("/api/create/notes/:id", function (req, res) {
        console.log(req.body);

        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            });

    });

    // Delete headline
    app.get("/api/clear", function (req, res) {

        db.Headline.remove()
            .then(function () {
                res.json("Removed from Headline")
            })

    });

    // Delete route for notes
    app.delete("/api/delete/notes/:id", function (req, res) {

        db.Note.remove(
            { _id: req.params.id }
        )
            .then(function (result) {
                res.json(result)
            })

    });


}



