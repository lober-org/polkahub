# PolkaHub Deployment Guide

This guide walks you through deploying PolkaHub to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Polkadot wallet (for testnet/mainnet)

## Step 1: Database Setup

1. **Create Supabase Project:**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Wait for database to be provisioned

2. **Run Database Migrations:**
   - Go to SQL Editor in Supabase dashboard
   - Run the SQL scripts in order:
     - `scripts/01_create_tables.sql`
     - `scripts/02_create_rls_policies.sql`
     - `scripts/03_create_functions.sql`

3. **Enable Authentication:**
   - Go to Authentication settings
   - Enable Email provider
   - Configure email templates (optional)

## Step 2: GitHub Setup

1. **Create GitHub OAuth App:**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Set callback URL: `https://your-domain.com/auth/callback`
   - Save Client ID and Client Secret

2. **Generate GitHub Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` and `admin:repo_hook` scopes
   - Save the token

## Step 3: Vercel Deployment

1. **Connect Repository:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the repository

2. **Configure Environment Variables:**

   Add the following environment variables in Vercel project settings:

   \`\`\`env
   # Supabase (from Supabase dashboard)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # For development redirects
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   
   # GitHub
   GITHUB_TOKEN=your_github_token
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   
   # Polkadot (Testnet for development)
   POLKADOT_WS_ENDPOINT=wss://westend-rpc.polkadot.io
   POLKADOT_PLATFORM_ADDRESS=your_platform_address
   POLKADOT_PLATFORM_PRIVATE_KEY=your_private_key
   
   # Cron Jobs
   CRON_SECRET=generate_random_secret
   \`\`\`

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your deployment URL

## Step 4: GitHub Webhook Configuration

For each project repository:

1. Go to repository Settings → Webhooks
2. Add webhook:
   - Payload URL: `https://your-domain.com/api/webhooks/github`
   - Content type: `application/json`
   - Secret: Your `GITHUB_WEBHOOK_SECRET`
   - Events: Pull requests, Issues
   - Active: ✅

## Step 5: Polkadot Setup

### For Testnet (Development)

1. **Get Testnet Tokens:**
   - Go to [Westend Faucet](https://faucet.polkadot.io/)
   - Request test DOT tokens
   - Send to your platform address

2. **Test Transactions:**
   - Create a test task
   - Fund escrow
   - Verify transaction on [Westend Subscan](https://westend.subscan.io/)

### For Mainnet (Production)

1. **Create Platform Wallet:**
   - Use Polkadot.js extension or hardware wallet
   - Fund with sufficient DOT for operations
   - Secure private key in environment variables

2. **Update Environment:**
   \`\`\`env
   POLKADOT_WS_ENDPOINT=wss://rpc.polkadot.io
   \`\`\`

## Step 6: Verify Deployment

1. **Test Authentication:**
   - Visit your deployed site
   - Sign up with email
   - Verify email confirmation works

2. **Test Project Creation:**
   - Log in as maintainer
   - Create a test project
   - Verify it appears on projects page

3. **Test Task Creation:**
   - Create a task for your project
   - Fund the escrow
   - Verify escrow status updates

4. **Test Webhook:**
   - Create a test issue with `reward:` label
   - Verify task is auto-created
   - Open a PR referencing the issue
   - Verify contribution is created

5. **Test Cron Jobs:**
   - Wait for scheduled runs or trigger manually
   - Check Vercel logs for execution
   - Verify cron jobs complete successfully

## Step 7: Monitoring

1. **Vercel Logs:**
   - Monitor deployment logs
   - Check for errors in API routes
   - Review cron job execution

2. **Supabase Logs:**
   - Monitor database queries
   - Check for slow queries
   - Review authentication logs

3. **GitHub Webhook Logs:**
   - Check webhook delivery status
   - Review failed deliveries
   - Debug webhook issues

## Troubleshooting

### Deployment Fails

- Check build logs in Vercel
- Verify all environment variables are set
- Ensure database migrations ran successfully

### Webhooks Not Working

- Verify webhook secret matches
- Check webhook delivery logs in GitHub
- Review API route logs in Vercel

### Authentication Issues

- Verify Supabase URL and keys
- Check email provider configuration
- Review authentication logs

### Payout Failures

- Verify Polkadot endpoint is accessible
- Check platform wallet has sufficient balance
- Review transaction logs

## Security Checklist

- ✅ All secrets stored in environment variables
- ✅ Webhook signatures verified
- ✅ RLS policies enabled on Supabase
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ Cron endpoints protected with secret
- ✅ Private keys never committed to repository
- ✅ Service role key only used server-side

## Scaling Considerations

1. **Database:**
   - Monitor Supabase usage
   - Upgrade plan as needed
   - Add database indexes for performance

2. **API Rate Limits:**
   - Implement rate limiting
   - Cache frequently accessed data
   - Use CDN for static assets

3. **Polkadot Transactions:**
   - Batch payouts when possible
   - Monitor gas fees
   - Implement retry logic for failed transactions

## Support

For issues or questions:
- Check documentation in repository
- Review Vercel logs
- Contact support at support@polkahub.io
