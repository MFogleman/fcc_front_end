"use strict";

$(document).ready(function() {
    init();
});

function init() {
    $("#query").keyup(function(event) {
        if (event.which == 13) { //if enter key pressed
            userSearch();
        }
    });

    $("#submit").click(function() {
        userSearch();
    });

    $("#random").click(function() {
        var randomURL = "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exintro&explaintext&exsentences=1&formatversion=2&redirects=return&format=json";
            /*Explanation of the request:
            
            action = query - Because we arent searching

            generator = random - At one point these were called lists instead of
            generators, I think.  Theres a bunch of other keys you can use withB
            'random' that give results that you arent working for

            grnnamespace=0 - 0 is the namespace for actual articles, so you dont
            randomly queue a talk page or user page

            prop = extracts - It looks like extracts is some custom thing added 
            on to the wikimedia api, which seems to be a  a base API that many 
            projects use, some not containing extracts.  This one is, according 
            to the page buried deep in the API, used by many projects.

            exintro - If you see a flag without a '=' its boolean, either its in
            the API request or not, no value to assign.  exintro returns the top
            part of the wikipage before getting to other sections.  It returns 
            it with HTML and all, so we have to use explaintxt.

            explaintxt - This isnt "explain"-text.  It is ex[tract]-plain-text.  
            This will return our data without HTML / formatting.

            exsentences = 1 - The summary returned in the opensearch action is 
            usually 1-3 sentences, weighted towards the beginning.  The length 
            is determined by the article it seems.  The random generator we are
            using does not have the summary data, atleast not that I can find.  
            So we force the call to only return the first sentence.  This is 
            often redundant with exintro, but in the case of a long 'intro' it
            will be very helpful.

            formatversion = 2 - If you don't set this to '2' your return will be
            optimzed for XML.  This means that your query page will be 
            data.query.#### where #### is the page ID number.  You cant really 
            parse this unless you for-looped through the Object.keys and I'm 
            not even sure if that would be guaranteed to work.  Setting it to 2
            returns a result designed for JSON use.  Note this is only needed
            for the query action, not the opensearch

            redirects = return - Resolve any redirect that would cause a 
            "Did you mean ..." page, and just return what we probably meant

            format = json - You would think this would imply formatversion = 2.
            You would be wrong.
            */
        $.ajax({
            url: randomURL,
            dataType: "jsonp",
            type: "POST",
            headers: { "FCC": "FreeCodeCampWikiViewer" },
            success: function(data) {
                $(".output").html(""); //clear any existing data
                $(".output").append("<a href='https://en.wikipedia.org/?curid="
                + data.query.pages[0].pageid 
                + "'><div class='title'>" 
                + data.query.pages[0].title 
                + "</div><div class='summary'>" 
                + data.query.pages[0].extract 
                + "</div></a>");
            }
        });
    });
}

function userSearch() {
    var input = $("#query").val();
    var apiEnd = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&redirects=return&format=json";
    /*
	action=opensearch  - The primary means of using a search w/ the API
	input - The string typed in by the user.
	
    limit = 10 -  return top 10 results of this search
	
    redirects = return - Resolve any redirect that would cause a "Did you mean" 
    page, and just return what we probably meant
	
    format = json - Self-explanatory
	*/
    $.ajax({
        url: apiEnd,
        dataType: "jsonp",
        data: {"search": input},
        type: "POST",
        headers: { "Api-User-Agent": "FCCWikiViewer" }, 
        success: function(data) {
            /*
            data is a JSON of arrays with all the titles at data[1], all the
            summaries at data[2], and all the links at data[3].  data[0] is the
            string that was searched for.
            */
            $(".output").html(""); //clear any existing data before appending
            for (var i = 0; i < data[1].length; i++) {
                $(".output").append("<a href='" + data[3][i] 
                + "'><div class='title'>" 
                + data[1][i] 
                + "</div><div class='summary'>" 
                + data[2][i] 
                + "</div></a>");
            }
        }
    });
}
