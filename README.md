> _⚠️ GitHub & Heroku have turned off their integration while investigating a [breach](https://github.blog/2022-04-15-security-alert-stolen-oauth-user-tokens/), so changes will not automatically deploy after pushing to `main`. If you have access to do so, please [push your changes to the `main` branch of the Heroku git remote](https://devcenter.heroku.com/articles/git) once your PR is merged. Otherwise, please mention it in the PR and assign [@exu3](https://github.com/exu3) or [@garyhtou](https://github.com/garyhtou) for review._

# MFA

Hack Club's solution for sharing [multi-factor authentication (MFA)](https://en.wikipedia.org/wiki/Multi-factor_authentication) codes for teams accounts. Often times, shared accounts that require MFA use our personal phone numbers — which are not accessible to other members of the team. This solution provides a shared phone number which is accessible to the entire team.

## How does it work?

We have a Twilio number which sends a webhook to this Express (Node) server when a SMS is received. That message is then parsed for the MFA code which is sent by a Slack bot to a Slack channel.

## Contribute

```sh
# clone the repo
git clone https://github.com/hackclub/mfa

# enter the directory
cd mfa

# install dependencies
yarn

# run the server
yarn run dev

# the server will refresh on any saved changes
```

Add additional MFA code parsing regex in [`/src/helpers/parseCode.ts`](/src/helpers/parseCode.ts).
The order of the regexes is important. Regexes in the array will attempted, in order, until one is successful. For more accurate results, order more specific regexes first.
