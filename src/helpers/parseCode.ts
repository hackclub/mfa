import { TwilioMessage } from './mfa';

export default function parseCode(message: TwilioMessage): string | null {
	// Add case-insenstitive (`i`) modifier to regex. (we can't lowercase the message body before matching incase some codes are alpha case-sensitive)
	// Make sure the code is in capture group 1
	const regex = [
		// Bill.com + PayPal
		/code: (\d+)/i,
		// Bill.com + SVB
		/code is (\d+)/i,
		// Bill Pay (payee activation)
		/activation code for.*is (\d+)/,
		// Twilio + BitClout + Clubhouse
		/code is: (\d+)/i,
		// SendGrid
		/code for SendGrid: (\d+)/i,
		// Stripe
		/code is: (\d{3}-\d{3})/i,
		// Namecheap
		/code - (\d+)/i,
		// Google
		/(G-\d+) is your Google/i,
		// TikTok
		/\[TikTok\] (\d+) is your verification/i,
		// generic — from '443-98' short code
		/(\d+) is your verification code/i,
		// Authy
		/manually enter: (\d+)/i,

		// last ditch resorts
		/code:? ?(\d+)/i,
		/(\d+) is your/i,
		/(\d{4,8})/,
		/(\d+)/,
	];

	let code: string;

	regex.forEach((regex) => {
		if (code) return; // skip if a code has already been found

		const output = message.Body.match(regex);
		if (output && output[1]) {
			code = output[1]; // first capture group
		}
	});

	return code ? code : null;
}
