//What we need
var prompt 		= require('prompt-sync')(),
		request 	= require('request'),
		cheerio 	= require('cheerio'),
		fs 				= require('fs'),
		htmlToPdf = require('html-to-pdf');

//get the login information from the user
var username = prompt('Enter username: ');
var password = prompt.hide('Enter password: ');
//
//ADP home
//var requestUrl = 'https://portal.adp.com/public/index.htm';
//
//make a cookie jar
//var cookieJar = request.jar();
//var request = request.defaults({ jar : cookieJar }); //makes the session default cookie jar for every request
//
//feed in the user credentials
//request.get('https://agateway.adp.com/siteminderagent/nocert/1466706941/smgetcred.scc?TYPE=16777217&REALM=-SM-Portal%20Access%20[14%3a35%3a41%3a2522]&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-YsrrBH1YhG0x0eaoLpTdPstzX%2fgwSz3miV3bv%2fo%2bnM26fZf%2b6PJVemqAut4PRQuE&TARGET=-SM-https%3a%2f%2fportal%2eadp%2ecom%2fwps%2femployee%2femployee%2ejsp').auth(username, password, false);
//request.get('https://portal.adp.com/wps/myportal/sitemap/Employee/PayTax/PayStatements/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOItDc2MPCzcDbwNfN0cDRxNnZzNDV18DZx9jYAKIoEKDHAARwNC-gtyQxUBEjyuKg!!/dl5/d5/L2dJQSEvUUt3QS80SmlFL1o2XzkxNjJIOEcwSzBNRkEwQTVCQzcxRE0wMlYz/').auth(username, password, false).on('error', function(err) {
//	console.log("Error logging in.");
//});

//scrape the page with the pay info
request('https://' + username + ':' + password +  '@portal.adp.com/wps/myportal/sitemap/Employee/PayTax/PayStatements/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOItDc2MPCzcDbwN3LycDBxdLIy9DIPdDZx9jYAKIoEKDHAARwNC-gtyQxUBdrC_lg!!/dl5/d5/L2dJQSEvUUt3QS80SmlFL1o2XzkxNjJIOEcwSzBGSkIwQUQ4M0oxU0cwMlYz/', function (error, response, body) {
	if (error) {
    	console.log('Error happened when scraping the pay statement : \n' + error);
 	}
 	var $ = cheerio.load(body),
 	tableDiv = $('div #ac6a8277-df45-4ba9-9edc-0dc52bf94e48');

 	//write to temporary html file
 	fs.closeSync(fs.openSync("./tmp.html", "w"));
	fs.appendFile("./tmp.html", "<html><head><meta charset='UTF-8'> </meta>\n");
 	fs.appendFile("./tmp.html", "</head><body><table>");
	$(tableDiv).find('tr').each(function(tr_text, tr) {
    var tr_text = $(this).find('tr');
		fs.appendFile('./tmp.html', '<tr>' + tr_text + '</tr>');
		$(tr_text).find('td').each(function(td_text, td) {
			var td_text = $(this).find('td');
			fs.appendFile('./tmp.html', '<td>' + td_text + '</td>');
		});
	});
	fs.appendFile("./tmp.html", "</table></body>");

    //make a pdf of the pay stub for the user
	htmlToPdf.convertHTMLFile('./tmp.html', './payStub.pdf',
    	function (error, success) {
       		if (error) {
            	console.log('Error creating PDF of paystub:\n');
            	console.log(error);
        	}
        	else {
            	console.log('PDF successfully created in home directory.');
        	}
    	}
	);
	//TODO: delete tmp.html after you don't need it anymore
});
