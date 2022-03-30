// config used by server side only
const dbHost = process.env.DB_HOST || 'cluster0-shard-00-00.fkgtd.mongodb.net';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'Cluster0';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || 'keepwalking';
const dbCred =
	dbUser.length > 0 || dbPass.length > 0 ? `${dbUser}:${dbPass}@` : '';

const dbUrl =
	process.env.DB_URL || `mongodb://root:keepwalking@cluster0-shard-00-00.fkgtd.mongodb.net:27017,cluster0-shard-00-01.fkgtd.mongodb.net:27017,cluster0-shard-00-02.fkgtd.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-46ia68-shard-0&authSource=admin&retryWrites=true&w=majority`;

module.exports = {
	// used by Store (server side)
	apiBaseUrl: `https://bossysuits.herokuapp.com/api/v1`,

	// used by Store (server and client side)
	ajaxBaseUrl: `https://bossysuits.herokuapp.com/ajax`,

	// Access-Control-Allow-Origin
	storeBaseUrl: '*',

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
	jwtSecretKey: 'SP69kXFR3znRi7kL8Max2GTB24wOtEQj',

	// key to sign store cookies
	cookieSecretKey: '8669X9P5yI1DAEthy1chc3M9EncyS7SM',

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
	orderStartNumber: 1000
};
