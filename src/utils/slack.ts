import { App, ExpressReceiver } from '@slack/bolt';

const receiver = new ExpressReceiver({
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	endpoints: '/', // This flattens the Bolt js router so that I can mount it anywhere
});

const slack = new App({
	token: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
	receiver,
});

export { slack, receiver };
