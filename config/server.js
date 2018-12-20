// config used by server side only
const dbHost = process.env.DB_HOST || 'ds139934.mlab.com';
const dbPort = process.env.DB_PORT || 39934;
const dbName = process.env.DB_NAME || 'bossysuits';
const dbUser = process.env.DB_USER || 'krawc';
const dbPass = process.env.DB_PASS || 'JEByfAUqhc7fnbs';
const dbCred =
	dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : '';

const dbUrl =
	process.env.DB_URL || `mongodb://${dbCred}${dbHost}:${dbPort}/${dbName}`;

module.exports = {
	// used by Store (server side)
	apiBaseUrl: `https://bossysuits.herokuapp.com/api/v1`,

	// used by Store (server and client side)
	ajaxBaseUrl: `https://bossysuits.herokuapp.com/ajax`,

	// Access-Control-Allow-Origin
	storeBaseUrl: `https://bossysuits.herokuapp.com`,

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
