function formatLink(link){
	var index = link.indexOf("contests") ;
	if(index == -1){
		alert("Invalid Link") ;
		return "" ;
	}
	var prefix = link.substring(0,index) ;
	var suffix = link.substring(index-1,link.length) ;
	var link = prefix + "rest" + suffix + "?offset=0&limit=500" ;
	return link ;
}

function getData(){
	
	var link = document.getElementById("leaderboardLink").value ;
	link = formatLink(link) ;
	if(link !=  ""){
		document.getElementById("loading").removeAttribute("hidden") ;
		document.getElementById("success").setAttribute("hidden","true") ;
		makeRequest(link) ;
	}
}

function makeRequest(link){
	var index = link.indexOf("http") ;
	if(index != -1){
		link = link.substring(8,link.length) ;
	}
	link = "https://cors-anywhere.herokuapp.com/" + link ;
	console.log("Fetching") ;
	fetch(link)
		.then(function (response){
			return response.json();
		}).then(function (json){
			//console.log(json) ;
			parseJSONData(json) ;
		}).catch(function (err){
			alert("Error " + err) ;
		})
}

function parseJSONData(jsonData){
	console.log(jsonData) ;
	var json = jsonData.models
	var fields = Object.keys(json[0])
	var replacer = function(key, value) { return value === null ? '' : value } 
	var csv = json.map(function(row){
  		return fields.map(function(fieldName){
    		return JSON.stringify(row[fieldName], replacer)
  		}).join(',')
	})
	csv.unshift(fields.join(','))
 	csv = csv.join('\r\n');
	console.log(csv)

	download("report.csv",csv) ;
	document.getElementById("loading").setAttribute("hidden","true") ;
	document.getElementById("success").removeAttribute("hidden") ;

}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
