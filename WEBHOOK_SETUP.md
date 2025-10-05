# GitHub Webhook Setup Guide

This guide explains how to set up GitHub webhooks for your PolkaHub projects.

## Prerequisites

- A GitHub repository
- Admin access to the repository
- Your PolkaHub project created

## Setup Steps

### 1. Get Your Webhook URL

Your webhook URL will be:
\`\`\`
https://your-domain.com/api/webhooks/github
\`\`\`

For local development:
\`\`\`
http://localhost:3000/api/webhooks/github
\`\`\`

Note: For local development, you'll need to use a tool like [ngrok](https://ngrok.com/) to expose your local server to the internet.

### 2. Configure GitHub Webhook

1. Go to your GitHub repository
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Configure the webhook:
   - **Payload URL**: Your webhook URL from step 1
   - **Content type**: `application/json`
   - **Secret**: Set a secure secret (save this for step 3)
   - **Events**: Select individual events:
     - ✅ Pull requests
     - ✅ Issues
   - **Active**: ✅ Checked

4. Click **Add webhook**

### 3. Add Webhook Secret to Environment Variables

Add the webhook secret to your Vercel project:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add a new variable:
   - **Name**: `GITHUB_WEBHOOK_SECRET`
   - **Value**: The secret you set in step 2

### 4. Test the Webhook

1. Create a test issue in your repository with a label like `reward: 5 DOT`
2. The webhook should automatically create a task in PolkaHub
3. Check your PolkaHub dashboard to verify

## Webhook Events

### Pull Request Events

When a PR is opened:
- Automatically creates a contribution record
- Links the PR to the task (based on issue reference in PR body)
- Sets status to "pending"

When a PR is merged:
- Approves the contribution
- Marks the task as completed
- Triggers payout (if escrow is set up)

When a PR is closed without merging:
- Rejects the contribution

### Issue Events

When an issue is opened with a `reward:` label:
- Automatically creates a task
- Parses the reward amount from the label
- Sets task status to "open"

When an issue is closed:
- Updates task status to "closed"

## Label Format

To automatically create tasks from issues, use labels in this format:

- `reward: 10 DOT` - Creates a task with 10 DOT reward
- `reward: 5.5 DOT` - Creates a task with 5.5 DOT reward

## PR Body Format

To link a PR to a task, reference the issue in the PR body:

\`\`\`markdown
Fixes #123
\`\`\`

Or:
\`\`\`markdown
Closes #456
Resolves #789
\`\`\`

## Troubleshooting

### Webhook not triggering

1. Check webhook delivery in GitHub (Settings → Webhooks → Recent Deliveries)
2. Verify the webhook URL is correct
3. Check server logs for errors

### Task not created automatically

1. Verify the issue has a `reward:` label with correct format
2. Check that the repository is registered in PolkaHub
3. Review webhook logs in your server

### Contribution not linked to task

1. Verify the PR body contains an issue reference (`Fixes #123`)
2. Check that the issue number matches a task in PolkaHub
3. Ensure the contributor has a PolkaHub profile with matching GitHub username

## Security Notes

- Always use HTTPS in production
- Keep your webhook secret secure
- Verify webhook signatures (automatically handled by the API route)
- Never commit secrets to your repository
