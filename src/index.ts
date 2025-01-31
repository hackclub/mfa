import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import express from 'express';
import helmet from 'helmet';
var morgan = require('morgan'); // must be required otherwise tsc complains

import router from './router';
import errorHandlers from './helpers/errorHandlers';

const PORT = process.env.PORT || 3000;

const app = express();

// Log all requests
router.use(morgan('short'));

// Secure app with HTTP headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Add paths
app.use(router);

// Handle errors
app.use(errorHandlers);

app.listen(PORT, () => {
	console.log(
		'\n=============================\n' +
			`Server listening on port ${PORT}` +
			'\n=============================\n'
	);
});
