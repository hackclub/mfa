import express, { Router, Request, Response } from 'express';
import twilio from 'twilio';
import { receiver as slackReceiver } from './utils/slack';
import { handleTwilioMessage } from './helpers/mfa';
import sourceCommit from './helpers/sourceCommit';
import prisma from './utils/prisma';

const TWILIO_NO_REPLY = '<Response></Response>';

const router: Router = express.Router();

// Slack Bolt.js (mount before body-parser)
router.use('/slack/events', slackReceiver.router);

// Express body-parser. These parser middlewares MUST be after Slack Bolt.
// (Bolt only takes raw requests)
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Home page
router.get('/', (req: Request, res: Response) => {
	res.redirect('https://github.com/hackclub/mfa');
});

// Health check endpoint. `/ping` is kept as an alias for backwards compat.
const healthCheck = async (req: Request, res: Response) => {
	let body = 'healthy!';

	const hash = await sourceCommit();
	if (hash) {
		body += `\n\nBuild ${hash.slice(0, 7)}`;
	}

	// Verify the application can reach the database. A lightweight `SELECT 1`
	// confirms both connectivity and that we can execute queries.
	try {
		await prisma.$queryRaw`SELECT 1`;
	} catch (err) {
		console.error('Healthcheck failed: unable to reach the database', err);
		res
			.status(500)
			.send(`${body}\n\nUnhealthy: unable to connect to the database`);
		return;
	}

	res.send(body);
};

router.get('/up', healthCheck);
router.get('/ping', healthCheck);

// Receive incoming SMS from Twilio
// https://www.twilio.com/docs/messaging/guides/webhook-request
router.post(
	'/twilio/messaging',
	// twilio.webhook(process.env.TWILIO_AUTH_TOKEN, {
	// 	// This middleware verifies that the request is from Twilio
	// 	url: 'https://mfa.hackclub.com',
	// }),
	async (req: Request, res: Response) => {
		// Don't reply to incoming sms message
		res.send(TWILIO_NO_REPLY);

		await handleTwilioMessage(req.body);
	}
);

export default router;
