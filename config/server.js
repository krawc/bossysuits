// config used by server side only
const dbHost = process.env.DB_HOST || 'ds139934.mlab.com';
const dbPort = process.env.DB_PORT || 39934;
const dbName = process.env.DB_NAME || 'bossysuits';
const dbUser = process.env.DB_USER || 'krawc';
const dbPass = process.env.DB_PASS || 'JEByfAUqhc7fnbs';
const dbCred =
	dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : '';
const dbUrl =
process.env.DB_URL || `mongodb://root:keepwalking@cluster0-shard-00-00.fkgtd.mongodb.net:27017,cluster0-shard-00-01.fkgtd.mongodb.net:27017,cluster0-shard-00-02.fkgtd.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-46ia68-shard-0&authSource=admin&retryWrites=false&w=majority`;

module.exports = {
	// used by Store (server side)
	apiBaseUrl: `http://localhost:3001/api/v1`,

	// used by Store (server and client side)
	ajaxBaseUrl: `http://localhost:3001/ajax`,

	// Access-Control-Allow-Origin
	storeBaseUrl: `http://localhost:3000`,

	// used by API
	adminLoginUrl: '/admin/login',

	apiListenPort: 3001,
	storeListenPort: 3000,

	// used by API
	mongodbServerUrl: dbUrl,

	smtpServer: {
		host: '',
		port: 0,
		secure: true,
		user: '',
		pass: '',
		fromName: '',
		fromAddress: ''
	},

	// key to sign tokens
	jwtSecretKey: '-',

	// key to sign store cookies
	cookieSecretKey: '-',

	// path to uploads
	categoriesUploadPath: 'public/content/images/categories',
	productsUploadPath: 'public/content/images/products',
	filesUploadPath: 'public/content',
	themeAssetsUploadPath: 'theme/assets/images',

	// url to uploads
	categoriesUploadUrl: '/images/categories',
	productsUploadUrl: '/images/products',
	filesUploadUrl: '',
	themeAssetsUploadUrl: '/assets/images',

	// store UI language
	language: 'en',

	// used by API
	orderStartNumber: 1000,

	developerMode: true
};
