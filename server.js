const app = require(__dirname + '/app/main');
const db = require(__dirname + '/app/models/db');
const config = require(__dirname + '/app/config/' + (process.env.NODE_ENV || 'development'));

start();

async function start(){
	var port = normalizePort(process.env.PORT || config.port);
	try {
		await db.init();
		console.log('Соединение установлено успешно');
		app.listen(port);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
return val;
}

	if (port >= 0) {
return port;
}

	return false;
}

module.exports = app;
