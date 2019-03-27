$(function() {
    $('#scrapeArticlesButton').on("click", function(event) {
        event.preventDefault();
        $('.articlesScrapedBody').empty();
        $.ajax("/api/all", {
            type: "GET"
        }).then(function(response) {
            var resp = response;
            console.log(resp);

            $.ajax("/api/scrape", {
                type: "POST"
            }).then(function(response) {

                $.ajax("/api/reduce", {
                    type: "DELETE"
                }).then(function(response) {

                    var text = $("<div>");
                    var newResp = response.length;

                    console.log(newResp);

                    var number = parseInt(newResp) - parseInt(resp);

                    if (number == 0) {
                        text.text("Updated News!")
                        $('.articlesScrapedBody').append(text)
                        $('#scrapeArticlesModal').modal('show');
                    }

                    else {
                        text.text(number + " News Headlines Scraped")
                        $('.articlesScrapedBody').append(text)
                        $('#scrapeArticlesModal').modal('show');
                    }

                })

            })
        })

    });

    $("#closeScrapeButton").on("click", function(event) {
        event.preventDefault();

        $.ajax("/", {
            type: "GET"
        }).then(function() {
            location.reload();
        })
    });

    $('.saveArticleButton').on("click", function(event) {
        event.preventDefault();

        $('.articleSavedBody').empty();

       var articleId = $(this).data("id");

        $.ajax("/api/save/article/" + articleId, {
            type: "PUT"
        }).then(function() {
            var text = $('<div>');
            text.text("Headline Article Saved");
            $('.articleSavedBody').append(text);
            $('#articleSavedModal').modal('show');
        })
    });

    $('#closeArticleButton').on('click', function(event) {
        event.preventDefault();

        $.ajax("/", {
            type: "GET"
        }).then(function() {
            location.reload();
        })
    });


})