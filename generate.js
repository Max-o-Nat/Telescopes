const fs = require('fs');

function random(low, high) {
	return Math.random() * (high - low) + low;
}

function randomInt (low, high) {
	return Math.floor(random(low, high));
}

function createUsers(number) {

	fs.writeFile('./dbscripts/Users.txt','Kazeshiro\tzhar97@yandex.ru\t123456789\n',
		(error) => {
				if (error) {
throw error;
}
			});
	for (var i = number - 1; i >= 0; i--) {
		fs.appendFile('./dbscripts/Users.txt',
			generateword(10) + '\t' + generateemail() + '\t' + generatepassword()+'\n',
		(error) => {
				if (error) {
 throw error;
}
			});
	}
}

function createTelescopes(number) {
	var telescopes = ['рефлектор',
	'рефрактор',
	'катадиоптрический'];
	fs.writeFile('./dbscripts/Telescopes.txt','',
		(error) => {
				if (error) {
throw error;
}
			});
	for (var i = number - 1; i >= 0; i--) {
		fs.appendFile('./dbscripts/Telescopes.txt',
			generateword(10) + '\t' + telescopes[randomInt(0,3)] + '\n',
		(error) => {
				if (error) {
throw error;
}
			});
	}
}

function createObjects(number) {
	fs.writeFile('./dbscripts/Objects.txt','',
		(error) => {
				if (error) {
 throw error;
}
			});
	for (var i = number - 1; i >= 0; i--) {
		fs.appendFile('./dbscripts/Objects.txt',
			generateword(3) + generatenumbers(3)+'\t'+random(-90,90)+'\t'+random(0, 360)+'\n',
		(error) => {
				if (error) {
 throw error;
}
			});
	}
}

function createVisibility(number) {
	fs.writeFile('./dbscripts/Visibility.txt','',
		(error) => {
				if (error) {
 throw error;
}
			});
	for (var i = number - 1; i >= 0; i--) {
		fs.appendFile('./dbscripts/Visibility.txt',
			randomInt(1,101) + '\t' + randomInt(1, 21) + '\n',
		(error) => {
				if (error) {
throw error;
}
			});
	}
}

function createAstrophotographies(number) {
	fs.writeFile('./dbscripts/Astrophotographies.txt','',
		(error) => {
				if (error) {
 throw error;
}
			});
	for (var i = number - 1; i > 0; i--) {
		fs.appendFile('./dbscripts/Astrophotographies.txt',
			'./public/images/astrophoto/' + i + '.jpg' + '\n',
		(error) => {
				if (error) {
 throw error;
}
			});
	}
}

function generateword(len){
	var az = 'abcdefghijklmnopqrstuvwxyz';
	var s = '';
	for (var i = len - 1; i >= 0; i--) {
		s += az[randomInt(0,26)];
	}
	return s;
}

function generatenumbers(len){
	var numbers  = '0123456789';
	var s = '';
	for (var i = len - 1; i >= 0; i--) {
		s += numbers[randomInt(0,10)];
	}
	return s;
}

function generateemail(){
	var mails = ['yandex.ru', 'mail.ru', 'bk.ru','gmail.com'];
	return generateword(10) + '@' + mails[randomInt(0, mails.length)];
}

function generatepassword(){
	return generateword(6) + generatenumbers(6);
}

//createUsers(1000);
//createAstrophotographies(21);
//createObjects(20);
//createVisibility(40);
