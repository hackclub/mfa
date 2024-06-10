import sendSlackMessage from './sendSlackMessage';
import parseCode from './parseCode';
import prisma from '../utils/prisma';

export async function handleTwilioMessage(message: TwilioMessage) {
	const twilioMessage = await prisma.twilioMessage.create({
		data: {
			raw: message,
			messageSid: message.MessageSid,
			to: message.To,
			from: message.From,
			body: message.Body,
		},
	});
	console.log(twilioMessage);

	const passcode = await prisma.passcode.create({
		data: {
			code: parseCode(message),
			twilioMessageId: twilioMessage.id,
		},
		include: {
			twilioMessage: true,
		},
	});
	console.log(passcode);

	await sendSlackMessage(passcode);
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
