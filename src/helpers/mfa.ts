import sendMfaMessage from './sendMfaMessage';
import parseCode from './parseCode';

export function handleTwilioMessage(message: TwilioMessage) {
	const code = parseCode(message);

	sendMfaMessage(
		process.env.SLACK_MFA_CHANNEL_ID,
		message.MessageSid,
		message.From,
		message.To,
		message.Body,
		code,
		message.FromCountry,
		message.FromState,
		message.FromCity,
		message.FromZip
	);
}

export type TwilioMessage = {
	ToCountry: string;
	ToState: string;
	SmsMessageSid: string;
	NumMedia: string;
	ToCity: string;
	FromZip: string;
	SmsSid: string;
	FromState: string;
	SmsStatus: string;
	FromCity: string;
	Body: string;
	FromCountry: string;
	To: string;
	ToZip: string;
	NumSegments: string;
	MessageSid: string;
	AccountSid: string;
	From: string;
	ApiVersion: string;
};
