# PolkaHub API Documentation

This document describes the available API endpoints for the PolkaHub platform.

## Base URL

\`\`\`
https://your-domain.com/api
\`\`\`

## Authentication

Most endpoints require authentication via Supabase session cookies. Public endpoints are marked as such.

## Endpoints

### Projects

#### GET /api/projects

List all active projects with pagination and search.

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `search` (optional): Search term for project name or description

**Response:**
\`\`\`json
{
  "projects": [
    {
      "id": "uuid",
      "github_repo_name": "polkadot-js/apps",
      "github_owner": "polkadot-js",
      "description": "Basic Polkadot/Substrate UI",
      "logo_url": "https://...",
      "tasks": [...]
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
\`\`\`

### Tasks

#### GET /api/tasks

List all open tasks with filtering options.

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `difficulty` (optional): Filter by difficulty (easy, medium, hard)
- `minReward` (optional): Minimum reward amount in DOT
- `maxReward` (optional): Maximum reward amount in DOT
- `tags` (optional): Comma-separated list of tags
- `projectId` (optional): Filter by project ID

**Response:**
\`\`\`json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Fix authentication bug",
      "description": "...",
      "reward_amount_dot": 10.5,
      "difficulty": "medium",
      "tags": ["bug", "frontend"],
      "projects": {...}
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
\`\`\`

#### POST /api/tasks/[id]/fund-escrow

Fund the escrow for a task (maintainer only).

**Authentication:** Required (maintainer)

**Response:**
\`\`\`json
{
  "message": "Escrow funded successfully"
}
\`\`\`

### Contributions

#### POST /api/contributions/[id]/approve

Approve a contribution and release escrow (maintainer only).

**Authentication:** Required (maintainer)

**Response:**
\`\`\`json
{
  "message": "Contribution approved successfully"
}
\`\`\`

#### POST /api/contributions/[id]/reject

Reject a contribution (maintainer only).

**Authentication:** Required (maintainer)

**Response:**
\`\`\`json
{
  "message": "Contribution rejected"
}
\`\`\`

### Statistics

#### GET /api/stats

Get platform-wide statistics.

**Public:** Yes

**Response:**
\`\`\`json
{
  "totalProjects": 150,
  "totalTasks": 300,
  "totalContributors": 500,
  "totalRewardsAvailable": 5000.50,
  "totalPaidOut": 10000.25,
  "recentContributions": 45
}
\`\`\`

### Leaderboard

#### GET /api/leaderboard

Get top contributors by earnings.

**Public:** Yes

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
\`\`\`json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "uuid",
      "displayName": "John Doe",
      "avatarUrl": "https://...",
      "githubUsername": "johndoe",
      "totalEarned": 500.50,
      "contributionCount": 25
    }
  ]
}
\`\`\`

### Webhooks

#### POST /api/webhooks/github

GitHub webhook endpoint for processing events.

**Authentication:** GitHub webhook signature verification

**Headers:**
- `x-hub-signature-256`: GitHub webhook signature
- `x-github-event`: Event type (pull_request, issues)

**Events Handled:**
- `pull_request` (opened, closed)
- `issues` (opened, closed)

## Cron Jobs

These endpoints are called by Vercel Cron and require authentication via Bearer token.

### GET /api/cron/check-stale-tasks

Check for tasks that have been open for more than 30 days.

**Schedule:** Daily at midnight
**Authentication:** Bearer token (CRON_SECRET)

### GET /api/cron/process-pending-payouts

Process pending payouts in batches.

**Schedule:** Every 15 minutes
**Authentication:** Bearer token (CRON_SECRET)

### GET /api/cron/sync-github-data

Sync GitHub repository data for all projects.

**Schedule:** Every 6 hours
**Authentication:** Bearer token (CRON_SECRET)

## Error Responses

All endpoints return standard error responses:

\`\`\`json
{
  "error": "Error message"
}
\`\`\`

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are subject to rate limiting:
- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute

## Environment Variables

Required environment variables for API functionality:

\`\`\`env
# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Polkadot
POLKADOT_WS_ENDPOINT=wss://westend-rpc.polkadot.io
POLKADOT_PLATFORM_ADDRESS=your_platform_address
POLKADOT_PLATFORM_PRIVATE_KEY=your_private_key

# Cron Jobs
CRON_SECRET=your_cron_secret

# Supabase (automatically provided)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
\`\`\`

## SDK Example

Example usage with JavaScript/TypeScript:

\`\`\`typescript
// Fetch open tasks
const response = await fetch('https://your-domain.com/api/tasks?difficulty=medium&minReward=5')
const { tasks } = await response.json()

// Get platform stats
const statsResponse = await fetch('https://your-domain.com/api/stats')
const stats = await statsResponse.json()

// Get leaderboard
const leaderboardResponse = await fetch('https://your-domain.com/api/leaderboard?limit=10')
const { leaderboard } = await leaderboardResponse.json()
