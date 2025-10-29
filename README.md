Natural Disaster Relief Fund

A decentralized, milestone-based fund for transparent and accountable disaster relief. Built with Solidity and Scaffold-eth 2.

This project solves the problem of donor trust in traditional charity. Instead of sending funds to a black box, donors contribute to a smart contract. These funds can only be released to a pre-approved recipient (e.g., a relief organization) after they have provided public proof-of-work and a decentralized committee of oracles has voted to approve it.

Key Features

Trustless Donations: Anyone can donate to the public fund. The funds are held in the smart contract, not by a central party.

Recipient-Managed Milestones: The official recipient (e.g., Red Cross) can dynamically add new funding milestones as a disaster situation evolves.

Decentralized Governance: A committee of independent "oracles" (e.g., journalists, auditors, on-the-ground NGOs) must review and approve the recipient's proof-of-work for each milestone.

Automatic Payouts: As soon as a milestone reaches the required number of votes, the smart contract automatically and immediately releases the funds to the recipient's wallet.

User Roles & Workflow

This dApp is built around three distinct user roles that work together to create a trustless environment.

    The Donor

Who they are: Anyone in the world with an internet connection and a crypto wallet.

What they do: Donors are the funding source. They connect to the dApp and use the "Donate Now" card to send ETH or other tokens to the ReliefFund smart contract.

Their Guarantee: Once donated, their funds are locked in the contract and can only be moved by the contract's automated rules.

    The Recipient

Who they are: A single, pre-approved organization responsible for performing the relief work (e.g., 0x709...).

What they do:

Add Milestones: The recipient adds new milestones to the fund, defining how much money they need for a specific, provable task (e.g., "0.5 ETH for 100 food kits").

Request Funds: After completing the work, the recipient submits "proof-of-work" (like a link to photos, videos, or reports) to the smart contract to request the funds for that milestone.

    The Oracle Committee

Who they are: A group of independent, pre-approved addresses that act as a decentralized verification committee. They are not the recipient.

What they do: The oracles review the recipient's "proof-of-work" for each milestone. If the proof is valid, they vote to approve it.

The Trustless Loop

This system creates a "complete trust environment" because no single person is in control.

The Recipient is required to send proof for each milestone. Only after a majority of the Oracle members vote to approve this proof will the next part of the funds be allotted for the next milestone.

Because of this, Donors can see exactly what and where their money is being used, step-by-step, knowing it can't be misused.

Tech Stack

Blockchain: Solidity, Hardhat

Framework: Scaffold-eth 2

Frontend: Next.js (React), TypeScript, TailwindCSS

Libraries: lucide-react (icons), wagmi (wallet interaction)

Local Development & Testing

    Run the Local Stack

You will need three separate terminals.

Terminal 1: Start the Local Blockchain

yarn chain

Important: This terminal will output a list of 20 test accounts and their private keys. You will need these keys to test the different user roles.

Terminal 2: Deploy Your Contract

yarn deploy --reset

This command compiles your ReliefFund.sol contract and deploys it to your local blockchain.

Terminal 3: Start the Frontend

yarn start

Your application will be live at http://localhost:3000.

    Set Up MetaMask

To test the different roles, you must use MetaMask connected to your local chain.

Add the Local Network to MetaMask:

Open MetaMask and click "Add network" > "Add a network manually".

Network name: Localhost 8545

New RPC URL: http://127.0.0.1:8545

Chain ID: 31337

Currency symbol: ETH

Click "Save".

Import Test Accounts:

Go to your Terminal 1 (yarn chain) output.

Copy the Private Key for Account (1) (this is the Recipient).

In MetaMask, click the round icon > "Import account" and paste the key.

Repeat the process. Copy the Private Key for Account (2) (this is the first Oracle) and import it.

Repeat for Account (3) and Account (4) to have more oracles for testing.

    Test the Full Workflow

Now you can "log in" as each role by switching your active account in MetaMask.

Log in as a Donor:

Use your main Account (0) (the deployer).

On the website, select "I am a Donor".

Use the "Donate Now" card to send ETH to the fund. You will see the "Total Pooled Funds" increase.

Log in as the Recipient:

On the website, select "I am a Recipient".

Open MetaMask and switch your active account to Account (1).

The Recipient Dashboard will appear.

Use the "Add New Milestone" form to create a milestone (e.g., 0.5 ETH).

The new milestone will appear below. Enter a "Proof URL" (e.g., https://google.com) and click "Request Funds".

Log in as an Oracle:

On the website, select "I am an Oracle".

Open MetaMask and switch your active account to Account (2).

The Oracle Dashboard will appear. You will see "Milestone 1" is "Awaiting Votes".

Click the "Review Proof" link.

Click "Approve". The vote count will increase to 1.

Test the Payout:

Open MetaMask and switch to Account (3) (the second oracle).

The Oracle Dashboard will show 1 vote.

Click "Approve". The vote count will become 2.

Since requiredVotes is 2, this second vote will automatically trigger the payout. The "Total Pooled Funds" will decrease, and the milestone will be marked as "Paid".
