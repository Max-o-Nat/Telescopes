const db = require(__dirname + '/../db.js').db

async function telescopes() {
	var newdata = [{
			id : 1,
			name : "telescopename",
			type : "telescopetype",
			city : "city",
			country : "country"
	}]
	return newdata
}

async function sortTelescopes(sorttype) {
	var newdata = [{
			id : 1,
			name : "telescopename",
			type : "telescopetype",
			city : "city",
			country : "country"
	}]
	return newdata
}

async function searchTelescopes(searchtype, searchtext) {
	var newdata = [{
			id : 1,
			name : "telescopename",
			type : "telescopetype",
			city : "city",
			country : "country"
	}]
	return newdata
}

module.exports = {
	telescopes : telescopes,
	sortTelescopes : sortTelescopes,
	searchTelescopes : searchTelescopes
}