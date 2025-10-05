# Escrow & Payout System Guide

This guide explains how the escrow and payout system works in PolkaHub.

## Overview

PolkaHub uses an escrow system to ensure contributors get paid for their work. When a maintainer creates a task, they must fund the escrow before contributors can claim the reward.

## How It Works

### 1. Task Creation

When a maintainer creates a task:
- Task is created with a reward amount in DOT
- Escrow status is set to "pending"
- Task is visible to contributors but marked as unfunded

### 2. Funding Escrow

Maintainer funds the escrow:
- Clicks "Fund Escrow" button on task management page
- Confirms the transaction
- DOT is locked in escrow (in production, this would be a smart contract)
- Escrow status changes to "funded"
- Task becomes fully active

### 3. Contribution Submission

Contributor submits work:
- Opens a pull request referencing the issue
- GitHub webhook automatically creates contribution record
- Contribution status is "pending"

### 4. Review & Approval

Maintainer reviews the contribution:
- Views the PR and code changes
- Approves or rejects the contribution
- If approved, escrow is automatically released

### 5. Payout

When contribution is approved:
- Escrow funds are released
- DOT is transferred to contributor's Polkadot address
- Payout record is created with transaction hash
- Task status changes to "completed"
- Escrow status changes to "released"

## Polkadot Integration

### Testnet vs Mainnet

**Development/Testing:**
- Uses Westend testnet
- Endpoint: `wss://westend-rpc.polkadot.io`
- Get test DOT from [Westend Faucet](https://faucet.polkadot.io/)

**Production:**
- Uses Polkadot mainnet
- Endpoint: `wss://rpc.polkadot.io`
- Real DOT required

### Setting Up Polkadot

1. **Platform Wallet:**
   - Create a Polkadot wallet for the platform
   - Fund it with DOT for gas fees
   - Add private key to environment variables:
     \`\`\`
     POLKADOT_PLATFORM_ADDRESS=your_address
     POLKADOT_PLATFORM_PRIVATE_KEY=your_private_key
     \`\`\`

2. **Network Configuration:**
   - Set the WebSocket endpoint:
     \`\`\`
     POLKADOT_WS_ENDPOINT=wss://westend-rpc.polkadot.io
     \`\`\`

3. **User Wallets:**
   - Contributors add their Polkadot address in profile settings
   - Payouts are sent to this address

## Smart Contract (Future Enhancement)

Currently, the escrow system tracks funds in the database. For production, you should implement:

1. **Escrow Smart Contract:**
   - Deploy a smart contract on Polkadot
   - Contract holds escrowed funds
   - Only releases funds when approved by maintainer
   - Supports refunds if task is cancelled

2. **Multi-Signature:**
   - Require multiple signatures for large payouts
   - Add platform admin as co-signer for security

3. **Automated Payouts:**
   - Trigger payouts automatically when PR is merged
   - Use GitHub webhook + smart contract integration

## Security Considerations

1. **Private Keys:**
   - Never commit private keys to repository
   - Use environment variables
   - Consider using a hardware wallet for platform funds

2. **Transaction Verification:**
   - Always verify transaction hashes on-chain
   - Check recipient address before sending
   - Implement transaction limits

3. **Escrow Protection:**
   - Funds are locked until work is verified
   - Maintainers can refund if task is cancelled
   - Platform cannot access escrowed funds

## API Endpoints

### Fund Escrow
\`\`\`
POST /api/tasks/[id]/fund-escrow
\`\`\`
Funds the escrow for a task (maintainer only).

### Approve Contribution
\`\`\`
POST /api/contributions/[id]/approve
\`\`\`
Approves contribution and releases escrow (maintainer only).

### Reject Contribution
\`\`\`
POST /api/contributions/[id]/reject
\`\`\`
Rejects contribution without releasing escrow (maintainer only).

## Database Schema

### Payouts Table
\`\`\`sql
- id: UUID
- contribution_id: UUID (foreign key)
- recipient_user_id: UUID (foreign key)
- amount_dot: DECIMAL
- polkadot_address: TEXT
- transaction_hash: TEXT
- status: TEXT (pending, completed, failed)
- paid_at: TIMESTAMP
- created_at: TIMESTAMP
\`\`\`

## Troubleshooting

### Payout Failed
- Check contributor has valid Polkadot address
- Verify platform wallet has sufficient balance
- Check network connectivity to Polkadot node

### Escrow Not Funded
- Verify maintainer has sufficient DOT
- Check transaction was confirmed on-chain
- Review server logs for errors

### Transaction Pending
- Polkadot transactions can take 6-12 seconds
- Check transaction status on Subscan
- Wait for block confirmation
