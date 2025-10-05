# Mock Data Guide

This guide explains the mock data that has been seeded into the PolkaHub platform for development and demonstration purposes.

## Overview

The mock data includes realistic examples of:
- 7 user profiles (3 maintainers, 4 developers)
- 5 active projects from the Polkadot ecosystem
- 12 tasks with various statuses and reward amounts
- 6 contributions in different states
- 2 completed payouts
- 14 escrow transactions
- 6 webhook events

## Mock Users

### Maintainers
1. **alice_polkadot** - Core Polkadot developer
   - Wallet: `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`
   - Maintains: Polkadot SDK, Acala Network

2. **bob_substrate** - Substrate framework maintainer
   - Wallet: `5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty`
   - Maintains: Substrate Node Template, Polkadot.js Apps

3. **carol_parachain** - Parachain developer
   - Wallet: `5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy`
   - Maintains: Moonbeam Network

### Developers
1. **dev_david** - Full-stack developer (Rust & TypeScript)
   - Wallet: `5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw`
   - Contributions: 2 approved, 1 in progress

2. **emma_codes** - Frontend specialist
   - Wallet: `5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL`
   - Contributions: 1 approved, 1 in progress

3. **frank_rust** - Rust developer
   - Wallet: `5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y`
   - Contributions: 1 in progress

4. **grace_web3** - Web3 developer
   - Wallet: `5DfhGyQdFobKM8NsWvEeAKk5EQQgYe9AydgJ7rMB6E1EqRzV`
   - Contributions: 1 rejected

## Mock Projects

1. **Polkadot SDK** - Framework for building blockchains
   - 3 tasks (1 open, 1 in progress, 1 completed)
   - Total rewards: 950 DOT

2. **Substrate Node Template** - Blockchain template
   - 2 tasks (1 open, 1 completed)
   - Total rewards: 300 DOT

3. **Moonbeam Network** - Ethereum-compatible parachain
   - 2 tasks (1 open, 1 in progress)
   - Total rewards: 1,400 DOT

4. **Acala Network** - DeFi hub of Polkadot
   - 2 tasks (1 open, 1 completed)
   - Total rewards: 650 DOT

5. **Polkadot.js Apps** - Portal into Polkadot networks
   - 3 tasks (2 open, 1 in progress)
   - Total rewards: 520 DOT

## Task Status Distribution

- **Open**: 7 tasks (available for developers to claim)
- **In Progress**: 3 tasks (PRs submitted, under review)
- **Completed**: 2 tasks (PRs merged, rewards paid)

## Reward Amounts

- **Beginner tasks**: 100-200 DOT
- **Intermediate tasks**: 150-400 DOT
- **Advanced tasks**: 300-800 DOT

Total rewards available: **3,820 DOT**
Total rewards paid out: **450 DOT**

## Escrow Status

- **Funded**: 11 tasks have escrow funded and ready
- **Released**: 2 tasks have had escrow released to contributors
- **Pending**: 1 task awaiting escrow funding

## Testing Scenarios

### As a Developer
1. Browse available tasks on `/tasks`
2. View task details and requirements
3. Check your dashboard at `/dashboard`
4. View your contribution history

### As a Maintainer
1. View your projects at `/dashboard/projects`
2. Create new tasks for your projects
3. Review pending contributions
4. Approve/reject PRs and trigger payouts

### As a Visitor
1. Explore projects on `/projects`
2. View platform statistics on homepage
3. Check leaderboard (coming soon)
4. Browse task listings

## API Testing

You can test the API endpoints with this mock data:

\`\`\`bash
# Get all projects
curl http://localhost:3000/api/projects

# Get all tasks
curl http://localhost:3000/api/tasks

# Get platform statistics
curl http://localhost:3000/api/stats

# Get leaderboard
curl http://localhost:3000/api/leaderboard
\`\`\`

## Resetting Data

To reset and reload the mock data:

1. Run the seed script again from the v0 interface
2. All existing data will be cleared
3. Fresh mock data will be inserted

## Next Steps

After reviewing the mock data:
1. Test the user flows with different personas
2. Verify escrow and payout functionality
3. Test GitHub webhook integration with real repos
4. Add more diverse task types and projects
5. Implement search and filtering features

## Notes

- All GitHub URLs are examples and won't resolve to real repositories
- Wallet addresses are valid Polkadot format but are test addresses
- Transaction hashes are mock values for demonstration
- Timestamps are relative to the current date for realistic data
</markdown>
