import { slack } from '../utils/slack';

export default function sendMfaMessage(
	channel: string,
	messageSid: string,
	from: string,
	to: string,
	message: string,
	code: string,
	country?: string,
	state?: string,
	city?: string,
	zip?: string
) {
	slack.client.chat.postMessage({
		channel,
		text: `[${code}] ${message}`,
		blocks: [
			code !== null
				? {
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: `*\`${code}\`*`, // Bold and `code`
						},
				  }
				: undefined,
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: quote(message),
				},
			},
			{
				type: 'context',
				elements: generateMeta({
					messageSid,
					from,
					to,
					country,
					state,
					city,
					zip,
				}),
			},
		].filter((block) => block), // remove the possible 'undefined' block
	});
}

function generateMeta({
	messageSid,
	to,
	from,
	country,
	state,
	city,
	zip,
}: {
	messageSid: string;
	from: string;
	to: string;
	country?: string;
	state?: string;
	city?: string;
	zip?: string;
}) {
	const meta = [
		singleMeta('From', from),
		singleMeta('To', to),
		singleMeta('Country', country),
		singleMeta('State', state),
		singleMeta('City', city),
		singleMeta('Zip', zip),
		singleMeta('Twilio MessageSid', messageSid),
	];

	return meta.filter((v) => v !== null); // Return non-null values

	function singleMeta(title: string, value: string) {
		// If the value is undefined or empty, return null
		if (value === undefined || !value.trim()) return null;

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
