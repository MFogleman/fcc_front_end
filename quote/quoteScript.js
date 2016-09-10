var quotes = [
	["I'm not a great programmer, I'm just a good programmer with great habits.", " - Kent Beck"],
	["Give a man a program, frustrate him for a day. Teach a man to program, frustrate him for a lifetime.", " - Waseem Latif"],
	["The most disastrous thing that you can ever learn is your first programming language.", " - Alan Kay"],
	["That's the thing about people who think they hate computers, What they really hate is lousy programmers.", " - Larry Niven"],
	["Talk is cheap. Show me the code.", " - Linus Torvalds"]
];

function quoteGen() {
    var pickedQuote = quotes[Math.floor(Math.random() * quotes.length)];  
    var uriQuote = encodeURI(pickedQuote[0]);
    var uriAuthor = encodeURI(pickedQuote[1]);

    $("#quoteBox").html(pickedQuote[0] + "<br><br>");
    $("#quoteBox").append(pickedQuote[1]);
    $(".twitter-share-button").attr("href",
         "https://twitter.com/intent/tweet?text=" + uriQuote + uriAuthor);
}

$(document).ready(function() {
    quoteGen();
    $("#theButton").click(quoteGen);
});
