/*
If you are reading this because you are creating a FreeCodeCamp wikipedia project and can't figure out Wikipedia's API,
you are in luck.  The Wiki API documentation is the worst thing, especially for something simple like "Get the first sentence
of a random article."  The best documentation for the subject has been stackoverflow pages from 2011, despite the fact that
the API has aparrently undergone many poorly documented changes.

tl;dr - go down to the big URLS for an explanation of the API calls.

*/

$(document).ready(function() {
    init();
});

function init() {
    $("#query").keyup(function(event) {
        if (event.which == 13) { //if entery key pressed
            userSearch();
        }
    });

    $("#submit").click(function() {
        userSearch();
    });

    $("#random").click(function() {
        var randomURL = "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exintro&explaintext&exsentences=1&formatversion=2&redirects=return&format=json";
            /*This is the terrible one
            action = query - because we arent searching

            generator = random - At one point these were called lists instead of generators, I think.  Theres a bunch of other keys you can use with 'random' that give...
            ...results that you arent working for

            grnnamespace=0 - 0 is the namespace for actual articles, so you dont randomly queue a talk page or user page

            prop = extracts - It looks like extracts is some custom thing added on to the wikimedia api, which seems to be a  a base API that many projects use, some...
            ...not containing extracts.  This one is, according to the page buried deep in the API, used by many projects.

            exintro - if you see a flag without a '=' its boolean, either its in the API request or not, no value to assign.  exintro returns the top part of the...
            ... wikipage before getting to other sections.  It returns it with HTML and all, so we have to use

            explaintxt - this isnt explain-text it is ex[tracts]-plain-text.  This will return our data without formatting

            exsentences = 1 - The summary returned in the opensearch action is usually 1-3 sentences, weighted towards the beginning.  The length is determined...
            ...by article it seems.  This delimiter is not available with the random generator, atleast not that I can find in the API.  So we force the...
            ...call to only return the first sentence.  Probably redundant with exintro.  I dont care.  

            formatversion = 2 - WHY IS THIS NOT THE FIRST SENTENCE OF THE API!?  If you don't set this to '2' your return will be optimzed for XML.  This means...
            ...that your query page will be data.query.#### where #### is the page ID number.  You cant really parse this unless you for-looped through the...
            ...Object.keys and I'm not even sure if that would be guaranteed to work.  Setting it to 2 returns a result designed for JSON like use.

            redirects = return - resolve any redirect issue of "Did you mean ..." and just return what we probably meant

            format = json - kinda a big deal when trying to parse this crap with javascript.  You would think this would imply formatversion = 2...
            ...You would be wrong.
            */
        $.ajax({
            url: randomURL,
            dataType: "jsonp",
            type: "POST",
            headers: { "FCC": "FreeCodeCampWikiViewer" },
            success: function(data) {
                $(".output").html(""); //clear any existing data
                $(".output").append("<a href='https://en.wikipedia.org/?curid=" + data.query.pages[0].pageid + "'><div class='title'>" + data.query.pages[0].title + "</div><div class='summary'>" + data.query.pages[0].extract + "</div></a>");
            }
        });
    });
}

function userSearch() {
    var input = $("#query").val();
    var apiEnd = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + input + "&limit=10&redirects=return&format=json";
	/*
	action=opensearch  - the primary means of querying via search w/ the API
	
	+input is the string of what search box
	
	limit = 10 -  return top 10 results of this search
	
	redirects = return - resolve any redirect issue of "Did you mean ..." and just return what we probably meant
	
	format = json - kinda a big deal when trying to parse this crap with javascript
	*/
    $.ajax({
        url: apiEnd,
        dataType: "jsonp",
        type: "POST",
        headers: { "Api-User-Agent": "FCCWikiViewer" }, //Not sure if the API says 'use headers' because it REQUIRES it, or just would like it.  Lets appease it
        success: function(data) {
            $(".output").html(""); //clear any existind data
            for (var i = 0; i < data[1].length; i++) {
                $(".output").append("<a href='" + data[3][i] + "'><div class='title'>" + data[1][i] + "</div><div class='summary'>" + data[2][i] + "</div></a>");
            }
        }
    });
}
