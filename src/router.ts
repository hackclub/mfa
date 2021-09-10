import express, { Router, Request, Response } from 'express';
import twilio from 'twilio';
import { receiver as slackReceiver } from './utils/slack';
import { handleTwilioMessage } from './helpers/mfa';

const TWILIO_NO_REPLY = '<Response></Response>';

const router: Router = express.Router();

// Slack Bolt.js (mount before body-parser)
router.use('/slack/events', slackReceiver.router);

// Express body-parser. These middleware MUST be before Slack Bolt. (Bolt only takes raw requests)
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ping Pong (test endpoint)
router.get('/ping', (req: Request, res: Response) => {
	res.send('pong! 🏓');
});

// Receive incoming SMS from Twilio
// https://www.twilio.com/docs/messaging/guides/webhook-request
router.post(
	'/twilio/messaging',
	twilio.webhook(process.env.TWILIO_AUTH_TOKEN, {}), // This middleware verifies that the request is from Twilio
	(req: Request, res: Response) => {
		// Don't reply to incoming sms message
		res.send(TWILIO_NO_REPLY);

		console.log(req.body);
		handleTwilioMessage(req.body);
	}
);

export default router;
