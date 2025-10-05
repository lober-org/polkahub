-- Seed Mock Data for PolkaHub Platform
-- This script creates realistic test data for development and demonstration

-- Clear existing data (in reverse order of dependencies)
DELETE FROM webhook_events;
DELETE FROM payouts;
DELETE FROM escrow_transactions;
DELETE FROM contributions;
DELETE FROM tasks;
DELETE FROM projects;
DELETE FROM profiles;

-- Reset sequences
ALTER SEQUENCE projects_id_seq RESTART WITH 1;
ALTER SEQUENCE tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE contributions_id_seq RESTART WITH 1;
ALTER SEQUENCE payouts_id_seq RESTART WITH 1;
ALTER SEQUENCE escrow_transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE webhook_events_id_seq RESTART WITH 1;

-- Insert Mock User Profiles
INSERT INTO profiles (id, github_username, wallet_address, role, avatar_url, bio, created_at) VALUES
-- Maintainers
('550e8400-e29b-41d4-a716-446655440001', 'alice_polkadot', '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 'maintainer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', 'Core developer at Polkadot. Building the future of Web3.', NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440002', 'bob_substrate', '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 'maintainer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', 'Substrate framework maintainer. Open source enthusiast.', NOW() - INTERVAL '8 months'),
('550e8400-e29b-41d4-a716-446655440003', 'carol_parachain', '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy', 'maintainer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol', 'Parachain developer. Love building decentralized apps.', NOW() - INTERVAL '5 months'),

-- Developers
('550e8400-e29b-41d4-a716-446655440004', 'dev_david', '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw', 'developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', 'Full-stack developer. Rust and TypeScript expert.', NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440005', 'emma_codes', '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL', 'developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', 'Frontend specialist. React and Web3 integration.', NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440006', 'frank_rust', '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y', 'developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank', 'Rust developer. Contributing to Substrate ecosystem.', NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440007', 'grace_web3', '5DfhGyQdFobKM8NsWvEeAKk5EQQgYe9AydgJ7rMB6E1EqRzV', 'developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace', 'Web3 developer. Smart contracts and dApps.', NOW() - INTERVAL '1 month');

-- Insert Mock Projects
INSERT INTO projects (name, description, github_repo_url, website_url, logo_url, maintainer_id, status, created_at) VALUES
('Polkadot SDK', 'The Polkadot SDK is a framework for building blockchains. It provides everything needed to build a custom blockchain from scratch.', 'https://github.com/paritytech/polkadot-sdk', 'https://polkadot.network', 'https://api.dicebear.com/7.x/shapes/svg?seed=polkadot', '550e8400-e29b-41d4-a716-446655440001', 'active', NOW() - INTERVAL '5 months'),

('Substrate Node Template', 'A fresh FRAME-based Substrate node, ready for hacking. This is a template for building your own blockchain.', 'https://github.com/substrate-developer-hub/substrate-node-template', 'https://substrate.io', 'https://api.dicebear.com/7.x/shapes/svg?seed=substrate', '550e8400-e29b-41d4-a716-446655440002', 'active', NOW() - INTERVAL '4 months'),

('Moonbeam Network', 'An Ethereum-compatible smart contract parachain on Polkadot. Build Solidity dApps with Polkadot security.', 'https://github.com/moonbeam-foundation/moonbeam', 'https://moonbeam.network', 'https://api.dicebear.com/7.x/shapes/svg?seed=moonbeam', '550e8400-e29b-41d4-a716-446655440003', 'active', NOW() - INTERVAL '6 months'),

('Acala Network', 'Acala is a decentralized finance network powering the aUSD ecosystem. The DeFi hub of Polkadot.', 'https://github.com/AcalaNetwork/Acala', 'https://acala.network', 'https://api.dicebear.com/7.x/shapes/svg?seed=acala', '550e8400-e29b-41d4-a716-446655440001', 'active', NOW() - INTERVAL '3 months'),

('Polkadot.js Apps', 'A Portal into the Polkadot and Substrate networks. Providing access to all features available on Substrate chains.', 'https://github.com/polkadot-js/apps', 'https://polkadot.js.org/apps', 'https://api.dicebear.com/7.x/shapes/svg?seed=polkadotjs', '550e8400-e29b-41d4-a716-446655440002', 'active', NOW() - INTERVAL '7 months');

-- Insert Mock Tasks
INSERT INTO tasks (project_id, title, description, github_issue_url, reward_amount, difficulty, status, tags, escrow_status, escrow_tx_hash, created_at) VALUES
-- Polkadot SDK Tasks
(1, 'Improve runtime benchmarking documentation', 'We need better documentation for the runtime benchmarking process. This should include examples and best practices for writing benchmarks.', 'https://github.com/paritytech/polkadot-sdk/issues/1234', 150.00, 'intermediate', 'open', ARRAY['documentation', 'runtime', 'benchmarking'], 'funded', '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '10 days'),

(1, 'Add support for custom RPC methods', 'Implement a way for parachains to register custom RPC methods that can be called through the standard RPC interface.', 'https://github.com/paritytech/polkadot-sdk/issues/1235', 500.00, 'advanced', 'in_progress', ARRAY['rpc', 'runtime', 'feature'], 'funded', '0x2234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '15 days'),

(1, 'Fix memory leak in consensus module', 'There is a memory leak in the consensus module that causes nodes to crash after running for extended periods.', 'https://github.com/paritytech/polkadot-sdk/issues/1236', 300.00, 'advanced', 'open', ARRAY['bug', 'consensus', 'critical'], 'funded', '0x3234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '5 days'),

-- Substrate Node Template Tasks
(2, 'Create tutorial for adding custom pallets', 'Write a comprehensive tutorial showing how to add custom pallets to the node template. Include code examples.', 'https://github.com/substrate-developer-hub/substrate-node-template/issues/456', 200.00, 'beginner', 'completed', ARRAY['documentation', 'tutorial', 'pallets'], 'released', '0x4234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '30 days'),

(2, 'Update dependencies to latest Substrate version', 'Update all dependencies to use the latest stable Substrate version and ensure all tests pass.', 'https://github.com/substrate-developer-hub/substrate-node-template/issues/457', 100.00, 'intermediate', 'open', ARRAY['maintenance', 'dependencies'], 'funded', '0x5234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '7 days'),

-- Moonbeam Tasks
(3, 'Implement EIP-1559 fee mechanism', 'Add support for EIP-1559 style transaction fees to improve fee predictability and user experience.', 'https://github.com/moonbeam-foundation/moonbeam/issues/789', 800.00, 'advanced', 'in_progress', ARRAY['ethereum', 'fees', 'feature'], 'funded', '0x6234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '20 days'),

(3, 'Add Ethereum precompile for XCM', 'Create a precompile that allows Solidity contracts to interact with XCM for cross-chain messaging.', 'https://github.com/moonbeam-foundation/moonbeam/issues/790', 600.00, 'advanced', 'open', ARRAY['ethereum', 'xcm', 'precompile'], 'funded', '0x7234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '3 days'),

-- Acala Tasks
(4, 'Optimize DEX swap performance', 'Profile and optimize the DEX swap operations to reduce gas costs and improve transaction throughput.', 'https://github.com/AcalaNetwork/Acala/issues/321', 400.00, 'advanced', 'open', ARRAY['defi', 'optimization', 'dex'], 'funded', '0x8234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '12 days'),

(4, 'Create liquidation bot example', 'Build an example liquidation bot that monitors positions and executes liquidations when needed.', 'https://github.com/AcalaNetwork/Acala/issues/322', 250.00, 'intermediate', 'completed', ARRAY['defi', 'example', 'bot'], 'released', '0x9234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '45 days'),

-- Polkadot.js Apps Tasks
(5, 'Add dark mode support', 'Implement a dark mode theme for the entire application with proper color contrast and accessibility.', 'https://github.com/polkadot-js/apps/issues/654', 180.00, 'intermediate', 'in_progress', ARRAY['ui', 'feature', 'accessibility'], 'funded', '0xa234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '8 days'),

(5, 'Fix mobile responsive issues', 'Several pages have layout issues on mobile devices. Fix responsive design across all pages.', 'https://github.com/polkadot-js/apps/issues/655', 120.00, 'beginner', 'open', ARRAY['ui', 'bug', 'mobile'], 'funded', '0xb234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', NOW() - INTERVAL '4 days'),

(5, 'Improve transaction history UI', 'Redesign the transaction history page to show more details and improve filtering options.', 'https://github.com/polkadot-js/apps/issues/656', 220.00, 'intermediate', 'open', ARRAY['ui', 'feature', 'transactions'], 'pending', NULL, NOW() - INTERVAL '2 days');

-- Insert Mock Contributions
INSERT INTO contributions (task_id, contributor_id, github_pr_url, status, submitted_at, reviewed_at) VALUES
-- Completed contributions
(4, '550e8400-e29b-41d4-a716-446655440004', 'https://github.com/substrate-developer-hub/substrate-node-template/pull/1001', 'approved', NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days'),
(9, '550e8400-e29b-41d4-a716-446655440005', 'https://github.com/AcalaNetwork/Acala/pull/2001', 'approved', NOW() - INTERVAL '45 days', NOW() - INTERVAL '43 days'),

-- In progress contributions
(2, '550e8400-e29b-41d4-a716-446655440006', 'https://github.com/paritytech/polkadot-sdk/pull/3001', 'pending', NOW() - INTERVAL '10 days', NULL),
(6, '550e8400-e29b-41d4-a716-446655440004', 'https://github.com/moonbeam-foundation/moonbeam/pull/4001', 'pending', NOW() - INTERVAL '15 days', NULL),
(10, '550e8400-e29b-41d4-a716-446655440005', 'https://github.com/polkadot-js/apps/pull/5001', 'pending', NOW() - INTERVAL '5 days', NULL),

-- Rejected contribution
(1, '550e8400-e29b-41d4-a716-446655440007', 'https://github.com/paritytech/polkadot-sdk/pull/3002', 'rejected', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days');

-- Insert Mock Payouts
INSERT INTO payouts (contribution_id, recipient_id, amount, status, transaction_hash, processed_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440004', 200.00, 'completed', '0xpayout1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', NOW() - INTERVAL '27 days'),
(2, '550e8400-e29b-41d4-a716-446655440005', 250.00, 'completed', '0xpayout2234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', NOW() - INTERVAL '42 days');

-- Insert Mock Escrow Transactions
INSERT INTO escrow_transactions (task_id, transaction_type, amount, transaction_hash, block_number, status, created_at) VALUES
-- Funded escrows
(1, 'deposit', 150.00, '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234567, 'confirmed', NOW() - INTERVAL '10 days'),
(2, 'deposit', 500.00, '0x2234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234568, 'confirmed', NOW() - INTERVAL '15 days'),
(3, 'deposit', 300.00, '0x3234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234569, 'confirmed', NOW() - INTERVAL '5 days'),
(5, 'deposit', 100.00, '0x5234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234571, 'confirmed', NOW() - INTERVAL '7 days'),
(6, 'deposit', 800.00, '0x6234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234572, 'confirmed', NOW() - INTERVAL '20 days'),
(7, 'deposit', 600.00, '0x7234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234573, 'confirmed', NOW() - INTERVAL '3 days'),
(8, 'deposit', 400.00, '0x8234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234574, 'confirmed', NOW() - INTERVAL '12 days'),
(10, 'deposit', 180.00, '0xa234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234576, 'confirmed', NOW() - INTERVAL '8 days'),
(11, 'deposit', 120.00, '0xb234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234577, 'confirmed', NOW() - INTERVAL '4 days'),

-- Released escrows (for completed tasks)
(4, 'deposit', 200.00, '0x4234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234570, 'confirmed', NOW() - INTERVAL '30 days'),
(4, 'release', 200.00, '0xpayout1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', 1234580, 'confirmed', NOW() - INTERVAL '27 days'),
(9, 'deposit', 250.00, '0x9234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 1234575, 'confirmed', NOW() - INTERVAL '45 days'),
(9, 'release', 250.00, '0xpayout2234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', 1234581, 'confirmed', NOW() - INTERVAL '42 days');

-- Insert Mock Webhook Events
INSERT INTO webhook_events (event_type, payload, processed, created_at) VALUES
('pull_request.opened', '{"action":"opened","number":3001,"pull_request":{"id":1,"title":"Add custom RPC support","user":{"login":"dev_david"}}}', true, NOW() - INTERVAL '10 days'),
('pull_request.opened', '{"action":"opened","number":4001,"pull_request":{"id":2,"title":"Implement EIP-1559","user":{"login":"dev_david"}}}', true, NOW() - INTERVAL '15 days'),
('pull_request.opened', '{"action":"opened","number":5001,"pull_request":{"id":3,"title":"Add dark mode","user":{"login":"emma_codes"}}}', true, NOW() - INTERVAL '5 days'),
('pull_request.closed', '{"action":"closed","number":1001,"pull_request":{"id":4,"merged":true,"title":"Custom pallet tutorial","user":{"login":"dev_david"}}}', true, NOW() - INTERVAL '28 days'),
('pull_request.closed', '{"action":"closed","number":2001,"pull_request":{"id":5,"merged":true,"title":"Liquidation bot example","user":{"login":"emma_codes"}}}', true, NOW() - INTERVAL '43 days'),
('issues.labeled', '{"action":"labeled","issue":{"number":1234,"title":"Improve benchmarking docs","labels":[{"name":"help wanted"}]}}', true, NOW() - INTERVAL '10 days');

-- Update statistics
UPDATE projects SET 
  total_tasks = (SELECT COUNT(*) FROM tasks WHERE tasks.project_id = projects.id),
  total_rewards = (SELECT COALESCE(SUM(reward_amount), 0) FROM tasks WHERE tasks.project_id = projects.id);

-- Display summary
SELECT 
  'Mock Data Summary' as info,
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM tasks) as total_tasks,
  (SELECT COUNT(*) FROM contributions) as total_contributions,
  (SELECT COUNT(*) FROM payouts) as total_payouts,
  (SELECT COALESCE(SUM(amount), 0) FROM payouts WHERE status = 'completed') as total_paid_out;
