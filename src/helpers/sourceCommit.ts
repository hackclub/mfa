const { exec } = require('child_process');
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function sourceCommit(): Promise<string | null> {
	// 1. Check SOURCE_COMMIT environment variable set by Coolify
	let env_var = process.env.SOURCE_COMMIT;
	if (env_var) return env_var;

	// 2. Shell out to git
	try {
		const { stdout, stderr } = await execAsync(
			'git show --pretty=%H -q 2> /dev/null'
		);
		if (stdout) return stdout.trim();
	} catch {}

	return null;
}
