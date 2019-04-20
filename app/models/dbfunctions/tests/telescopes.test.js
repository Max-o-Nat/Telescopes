//i added jenkins??
//maybe now??
process.env.NODE_ENV = 'test' 
//интеграционные тесты
const db = require(__dirname + '/../../db.js').db
const telescopes = require(__dirname + '/../telescopes.js')
const fs = require('fs')

const chai = require('chai')
const should = chai.should()
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

describe('dbfunctions/telescopes', () => {
	beforeEach((done) => {
		rebootdb(done)
	})

	it ('telescopes() should throw if db is bad', 
		(done) => {
			dropfunction('telescopes')
			.then(() => {
				telescopes.telescopes()
				.then(() => {
					done(new Error('it should throw error'))
				})
				.catch((err) => {
					should.exist(err)
					done()
				})
			})
			.catch((err) => done(err))
		})

	it ('telescopes() should return [] if telescopes table is empty', 
		(done) => {
			telescopes.telescopes()
			.then((data) => {
				should.exist(data)
				data.should.be.an('array')
				data.should.have.lengthOf(0)
				done()
			})
			.catch((err) => done(err))
		})


	it ('telescopes() should return array of telescopes in telescopes table',
		(done) => {
			var addthreetel = []
			for (var i = 2; i >= 0; i--) {
				addthreetel.push(addonetelescope())
			}
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.telescopes()
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(tels.length)
					for (var i = tels.length - 1; i >= 0; i--) {
						data.should.deep.include(tels[i])
					}
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('sortTelescopes(sorttype) should throw if db is bad', 
		(done) => {
			dropfunction('SortTelescopes')
			.then(() => {
				telescopes.sortTelescopes('')
				.then(() => {
					done(new Error('it should throw error'))
				})
				.catch((err) => {
					should.exist(err)
					done()
				})
			})
			.catch((err) => done(err))
		})

	it ('sortTelescopes(sorttype) should throw if sorttype is undefined or not in {Город, Тип телескопа, Страна}', 
		(done) => {
			telescopes.sortTelescopes()
			.then(() => {
				done(new Error('it should throw error'))
			})
			.catch((err) => {
				should.exist(err)
				done()
			})
		})

	it ('sortTelescopes(sorttype) should return [] if telescopes table is empty', 
		(done) => {
			telescopes.sortTelescopes('Тип телескопа')
			.then((data) => {
				should.exist(data)
				data.should.be.an('array')
				data.should.have.lengthOf(0)
				done()
			})
			.catch((err) => done(err))
		})


	it ('sortTelescopes(sorttype) should return array of telescopes in telescopes table is sorted by type',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.sortTelescopes('Тип телескопа')
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(tels.length)
					data[0].should.have.property('type', 'катадиоптрический')
					data[1].should.have.property('type', 'рефлектор')
					data[2].should.have.property('type', 'рефрактор')
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('sortTelescopes(sorttype) should return array of telescopes in telescopes table is sorted by city',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический','Москва'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', 'Санкт-Петербург'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор','Париж'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.sortTelescopes('Город')
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(tels.length)
					data[0].should.have.property('city', 'Москва')
					data[1].should.have.property('city', 'Париж')
					data[2].should.have.property('city', 'Санкт-Петербург')
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('sortTelescopes(sorttype) should return array of telescopes in telescopes table is sorted by country',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический', undefined, 'Россия'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', undefined, 'Франция'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор', undefined, 'Китай'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.sortTelescopes('Страна')
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(tels.length)
					data[0].should.have.property('country', 'Китай')
					data[1].should.have.property('country', 'Россия')
					data[2].should.have.property('country', 'Франция')
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('searchTelescopes(searchtype, searchtext) should throw if db is bad', 
		(done) => {
			dropfunction('SearchTelescopes')
			.then(() => {
				telescopes.searchTelescopes('Город','l')
				.then(() => {
					done(new Error('it should throw error'))
				})
				.catch((err) => {
					should.exist(err)
					done()
				})
			})
			.catch((err) => done(err))
		})

	it ('searchTelescopes(searchtype, searchtext) should throw if searchtype is undefined or not in {Город, Страна}', 
		(done) => {
			telescopes.searchTelescopes(undefined, 'l')
			.then(() => {
				done(new Error('it should throw error'))
			})
			.catch((err) => {
				should.exist(err)
				done()
			})
		})

	it ('searchTelescopes(searchtype, searchtext) should throw if searchtext is undefined or is not string', 
		(done) => {
			telescopes.searchTelescopes('Город', undefined)
			.then(() => {
				done(new Error('it should throw error'))
			})
			.catch((err) => {
				should.exist(err)
				done()
			})
		})

	it ('searchTelescopes(searchtype, searchtext) should return [] if telescopes table is empty', 
		(done) => {
			telescopes.searchTelescopes('Город', 'l')
			.then((data) => {
				should.exist(data)
				data.should.be.an('array')
				data.should.have.lengthOf(0)
				done()
			})
			.catch((err) => done(err))
		})

	it ('searchTelescopes(searchtype, searchtext) should return [] if there are no telescopes with <searchtext> city',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический','Москва'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', 'Санкт-Петербург'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор','Париж'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.searchTelescopes('Город', 'Волгоград')
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(0)
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('searchTelescopes(searchtype, searchtext) should return [] if there are no telescopes with <searchtext> country',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический', undefined, 'Россия'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', undefined, 'Франция'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор', undefined, 'Китай'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.searchTelescopes('Страна', 'Япония')
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(0)
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('searchTelescopes(searchtype, searchtext) should return array of telescopes in telescopes table with city = Москва',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический','Москва'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', 'Санкт-Петербург'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор','Париж'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.searchTelescopes('Город', 'Москва')
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(1)
					data[0].should.have.property('city', 'Москва')
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('searchTelescopes(searchtype, searchtext) should return array of telescopes in telescopes table with country = Россия',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический', undefined, 'Россия'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', undefined, 'Франция'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор', undefined, 'Китай'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.searchTelescopes('Страна', 'Россия')
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(1)
					data[0].should.have.property('country', 'Россия')
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('telescopeByID(id) should throw if db is bad', 
		(done) => {
			dropfunction('telescopeByID')
			.then(() => {
				telescopes.telescopeByID(1)
				.then(() => {
					done(new Error('it should throw error'))
				})
				.catch((err) => {
					should.exist(err)
					done()
				})
			})
			.catch((err) => done(err))
		})

	it ('telescopeByID(id) should throw if id is undefined or is not number', 
		(done) => {
			telescopes.telescopeByID(undefined)
			.then(() => {
				done(new Error('it should throw error'))
			})
			.catch((err) => {
				should.exist(err)
				done()
			})
		})

	it ('telescopeByID(id) should return [] if telescopes table is empty', 
		(done) => {
			telescopes.telescopeByID(1)
			.then((data) => {
				should.exist(data)
				data.should.be.an('array')
				data.should.have.lengthOf(0)
				done()
			})
			.catch((err) => done(err))
		})

	it ('telescopeByID(id) should return [] if there are no telescopes with <id> id',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический','Москва'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', 'Санкт-Петербург'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор','Париж'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.telescopeByID(4)
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(0)
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})

	it ('telescopeByID(id) should return array of telescopes in telescopes table with id = 2',
		(done) => {
			var addthreetel = []
			addthreetel.push(addonetelescope(undefined, 'катадиоптрический','Москва'))
			addthreetel.push(addonetelescope(undefined, 'рефрактор', 'Санкт-Петербург'))
			addthreetel.push(addonetelescope(undefined, 'рефлектор','Париж'))
			Promise.all(addthreetel)
			.then((tels) => {
				telescopes.telescopeByID(2)
				.then((data) => {
					should.exist(data)
					data.should.be.an('array')
					data.should.have.lengthOf(1)
					data[0].should.have.property('id', 2)
					done()
				})
				.catch((err) => done(err))
			})
			.catch((err) => {
				console.log(err)
				done()
			})
		})
})

function rebootdb(done) {
	fs.readFile(__dirname + '/reboot.sql', 
		{'encoding' : 'utf8'}, 
		(err, data) => {
			if (err)  done(err)
			 db.any(data)
			.then(() => done())
			.catch((err) => done(err))
		})
}

function dropfunction(name) {
	return db.none('DROP FUNCTION IF EXISTS ' + name + ';')
    .catch((err) => console.log(err))
}

function addonetelescope(name, type, city, country) {
	var telescope = createTelescope(name, type, city, country)
	return db.one('INSERT INTO telescopes(telescopename, telescopetype, city, country) \
		VALUES(${name}, ${type}, ${city}, ${country}) RETURNING telescopeid', telescope)
    .then((data) => {
    	telescope.id = data.telescopeid
    	return telescope
    })
    .catch((err) => console.log(err))
}

function createTelescope(name, type, city, country) {
	var types = ['рефлектор',
	'рефрактор', 
	'катадиоптрический'];
	return {
		name : name ? name : generateword(10), 
		type :	type ? type : types[randomInt(0,3)],
		city : city ? city : generateword(5),
		country : country? country : generateword(5)
	}
}

function generateword(len) {
	var az = 'abcdefghijklmnopqrstuvwxyz';
	var s = '';
	for (var i = len - 1; i >= 0; i--) {
		s += az[randomInt(0,26)];
	}
	return s;
}

function randomInt (low, high) {
    return Math.floor(random(low, high));
}

function random(low, high) {
    return Math.random() * (high - low) + low;
}

