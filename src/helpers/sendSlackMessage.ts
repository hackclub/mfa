import { Prisma } from '@prisma/client';
import { slack } from '../utils/slack';
import prisma from '../utils/prisma';

type PasscodeWithTwilioMessage = Prisma.PasscodeGetPayload<{
	include: { twilioMessage: true };
}>;

export default async function sendSlackMessage(
	passcode: PasscodeWithTwilioMessage
) {
	const response = await slack.client.chat.postMessage(
		buildSlackMessage({ channel: process.env.SLACK_MFA_CHANNEL_ID, passcode })
	);
	console.log(response);

	const slackMessage = await prisma.slackMessage.create({
		data: {
			channel: response.channel,
			ts: response.ts,
			passcodeId: passcode.id,
		},
	});
	console.log(slackMessage);
}

function buildSlackMessage({
	channel,
	passcode,
}: {
	channel: string;
	passcode: PasscodeWithTwilioMessage;
}) {
	const blocks = [];

	// Easy-to-copy parsed code (if found)
	if (passcode.code) {
		blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*\`${passcode.code}\`*`, // Bold and `code`
			},
		});
	}

	// Twilio message body
	blocks.push({
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: quote(passcode.twilioMessage.body),
		},
	});

	// Context footer
	blocks.push({
		type: 'context',
		elements: buildMeta({
			messageSid: passcode.twilioMessage.messageSid,
			from: passcode.twilioMessage.from,
			to: passcode.twilioMessage.to,
		}),
	});

	let text = passcode.twilioMessage.body;
	if (passcode.code) {
		// Prefix with code (if found)
		text = `[${passcode.code}] ` + text;
	}

	return { channel, text, blocks };
}

function buildMeta({
	messageSid,
	to,
	from,
}: {
	messageSid: string;
	from: string;
	to: string;
}) {
	const meta = [
		singleMeta('From', from),
		singleMeta('To', to),
		singleMeta('Twilio MessageSid', messageSid),
	];

	return meta.filter((v) => v !== null); // Return non-null values

	function singleMeta(title: string, value: string) {
		// If the value is undefined or empty, return null
		if (value === undefined || !value?.trim()) return null;

		return {
			type: 'mrkdwn',
			text: `*${title}:* ${value}`,
		};
	}
}

const QUOTE_PREFIX = '> ';
function quote(text: string) {
	return QUOTE_PREFIX + text.split('\n').join(`\n${QUOTE_PREFIX}`);
}
