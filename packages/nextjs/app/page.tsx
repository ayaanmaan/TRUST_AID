"use client";

import { useEffect, useState } from "react";
import { type NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import {
  useScaffoldReadContract,
  useScaffoldWatchContractEvent,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

// --- TYPE FOR ROLES ---
type SelectedRole = "donor" | "recipient" | "oracle" | null;

// --- MAIN PAGE COMPONENT ---

const Home: NextPage = () => {
  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* --- HEADER --- */}
          <ContractInfo />

          {/* --- ROLE SELECTOR "LOGIN" --- */}
          <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

          {/* --- CONDITIONAL DASHBOARDS --- */}
          <div className="mt-8">
            {selectedRole === "donor" && <DonorCard />}
            {selectedRole === "recipient" && <RecipientDashboard />}
            {selectedRole === "oracle" && <OracleDashboard />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;

// --- ROLE SELECTOR COMPONENT ---

function RoleSelector({
  selectedRole,
  setSelectedRole,
}: {
  selectedRole: SelectedRole;
  setSelectedRole: (role: SelectedRole) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-6 flex-wrap">
      <button
        className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
          selectedRole === "donor"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md"
        }`}
        onClick={() => setSelectedRole("donor")}
      >
        👋 I am a Donor
      </button>
      <button
        className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
          selectedRole === "recipient"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md"
        }`}
        onClick={() => setSelectedRole("recipient")}
      >
        🏠 I am a Recipient
      </button>
      <button
        className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
          selectedRole === "oracle"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md"
        }`}
        onClick={() => setSelectedRole("oracle")}
      >
        🔍 I am an Oracle
      </button>
    </div>
  );
}

// --- 1. CONTRACT INFO COMPONENT ---

function ContractInfo() {
  const { data: contractBalance, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "getBalance",
  });

  const { data: recipient } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "recipient",
  });

  const { data: requiredVotes } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "requiredVotes",
  });

  useScaffoldWatchContractEvent({
    contractName: "ReliefFund",
    eventName: "Donated",
    onLogs: () => {
      refetchBalance();
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "ReliefFund",
    eventName: "MilestonePaid",
    onLogs: () => {
      refetchBalance();
    },
  });

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-800 mb-4">🌊 Natural Disaster Relief Fund</h1>
        <p className="text-lg text-blue-600 mb-8 max-w-2xl mx-auto">
          A decentralized, milestone-based fund for transparent and accountable disaster relief.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-blue-700 font-semibold text-sm uppercase tracking-wide mb-2">Total Pooled Funds</div>
            <div className="text-3xl font-bold text-blue-800">
              {contractBalance !== undefined ? parseFloat(formatEther(contractBalance)).toFixed(4) : "0.0"} ETH
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-blue-700 font-semibold text-sm uppercase tracking-wide mb-2">Required Votes</div>
            <div className="text-3xl font-bold text-blue-800">{requiredVotes?.toString()}</div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 bg-blue-50 rounded-2xl p-4 border border-blue-200 max-w-md mx-auto">
          <span className="font-semibold text-blue-700">Official Recipient:</span>
          <Address address={recipient} />
        </div>
      </div>
    </div>
  );
}

// --- 2. DONOR CARD COMPONENT ---

function DonorCard() {
  const [donationAmount, setDonationAmount] = useState("");

  const { writeContractAsync: donate, isPending } = useScaffoldWriteContract("ReliefFund");

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💝</span>
        </div>
        <h2 className="text-2xl font-bold text-blue-800">Make a Donation</h2>
        <p className="text-blue-600 mt-2">Support disaster relief efforts with transparency and accountability.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-blue-700 font-medium mb-2">Amount in ETH</label>
          <EtherInput
            value={donationAmount}
            onChange={setDonationAmount}
            className="border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          onClick={() =>
            donate({
              functionName: "donate",
              value: parseEther(donationAmount || "0"),
            })
          }
          disabled={isPending || !donationAmount}
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Donate Now</span>
              <span>✨</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// --- 3. RECIPIENT DASHBOARD ---

function RecipientDashboard() {
  const { address } = useAccount();
  const [newMilestoneAmount, setNewMilestoneAmount] = useState("");

  const { data: recipient } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "recipient",
  });

  const { data: milestoneCount, refetch: refetchMilestoneCount } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "getMilestoneCount",
  });

  const { writeContractAsync: addMilestone, isPending: isAddingMilestone } = useScaffoldWriteContract("ReliefFund");

  useScaffoldWatchContractEvent({
    contractName: "ReliefFund",
    eventName: "MilestoneAdded",
    onLogs: () => {
      refetchMilestoneCount();
    },
  });

  if (address !== recipient) {
    if (address && recipient) {
      return (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Recipient Dashboard</h2>
            <p className="text-blue-600 mb-4">You are not the recipient of this fund.</p>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <p className="font-semibold text-blue-700 mb-2">Current Recipient:</p>
              <Address address={recipient} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏠</span>
        </div>
        <h2 className="text-2xl font-bold text-blue-800">Recipient Dashboard</h2>
        <p className="text-blue-600">Manage your relief fund milestones and requests</p>
      </div>

      {/* Add Milestone Section */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-8">
        <h3 className="font-bold text-lg text-blue-800 mb-3">Add New Milestone</h3>
        <p className="text-blue-600 text-sm mb-4">Define a new payout amount for a future milestone.</p>
        <div className="space-y-3">
          <div>
            <label className="block text-blue-700 font-medium mb-2">Payout Amount (ETH)</label>
            <EtherInput
              value={newMilestoneAmount}
              onChange={setNewMilestoneAmount}
              className="border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            onClick={() =>
              addMilestone(
                {
                  functionName: "addMilestone",
                  args: [parseEther(newMilestoneAmount || "0")],
                },
                {
                  onSuccess: async () => {
                    setNewMilestoneAmount("");
                  },
                },
              )
            }
            disabled={isAddingMilestone || !newMilestoneAmount}
          >
            {isAddingMilestone ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Add Milestone</span>
                <span>📝</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Milestones List */}
      <div>
        <h3 className="font-bold text-lg text-blue-800 mb-4">Your Milestones</h3>
        <div className="space-y-4">
          {milestoneCount !== undefined &&
            Array.from({ length: Number(milestoneCount) }, (_, i) => (
              <RecipientMilestoneItem key={i} milestoneIndex={i} />
            ))}
          {milestoneCount === 0n && (
            <div className="text-center py-8 text-blue-500 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-4xl mb-2 block">📋</span>
              <p>No milestones added yet. Add your first milestone above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 3a. Recipient Milestone Item ---

function RecipientMilestoneItem({ milestoneIndex }: { milestoneIndex: number }) {
  const [proofUrl, setProofUrl] = useState("");

  const { data: milestone, refetch } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "milestones",
    args: [BigInt(milestoneIndex)],
  });

  const { writeContractAsync: request, isPending } = useScaffoldWriteContract("ReliefFund");

  if (!milestone) return null;

  const [payoutAmount, proofUrlFromContract, isPaid, voteCount] = milestone;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-lg text-blue-800">Milestone {milestoneIndex + 1}</h4>
        <div className="text-right">
          <div className="text-xl font-bold text-blue-600">{formatEther(payoutAmount).toString()} ETH</div>
        </div>
      </div>

      {isPaid ? (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span className="font-semibold">Payment Completed</span>
        </div>
      ) : proofUrlFromContract ? (
        <div className="space-y-3">
          <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">⏳</span>
              <span className="font-semibold">Awaiting Approval</span>
            </div>
            <div className="text-sm">Votes: {voteCount.toString()}</div>
          </div>
          <a
            href={proofUrlFromContract}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <span>🔗</span>
            View Submitted Proof
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">📤</span>
              <span className="font-semibold">Ready to Submit Proof</span>
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="https://your-proof-of-work.com"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={proofUrl}
              onChange={e => setProofUrl(e.target.value)}
            />
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              onClick={() =>
                request(
                  {
                    functionName: "requestMilestone",
                    args: [BigInt(milestoneIndex), proofUrl],
                  },
                  {
                    onSuccess: async () => {
                      await refetch();
                    },
                  },
                )
              }
              disabled={isPending || !proofUrl}
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Request Funds</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. ORACLE DASHBOARD ---

function OracleDashboard() {
  const { address } = useAccount();

  const { data: isOracle } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "isOracle",
    args: [address],
  });

  const { data: milestoneCount, refetch: refetchMilestoneCount } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "getMilestoneCount",
  });

  useScaffoldWatchContractEvent({
    contractName: "ReliefFund",
    eventName: "MilestoneAdded",
    onLogs: () => {
      refetchMilestoneCount();
    },
  });

  if (!isOracle) {
    if (address && isOracle === false) {
      return (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Oracle Dashboard</h2>
            <p className="text-blue-600">You are not authorized as an oracle for this fund.</p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h2 className="text-2xl font-bold text-blue-800">Oracle Dashboard</h2>
        <p className="text-blue-600">Review and approve milestone completions</p>
      </div>

      <div className="space-y-4">
        {milestoneCount !== undefined &&
          Array.from({ length: Number(milestoneCount) }, (_, i) => <OracleMilestoneItem key={i} milestoneIndex={i} />)}
        {milestoneCount === 0n && (
          <div className="text-center py-8 text-blue-500 bg-blue-50 rounded-2xl border border-blue-200">
            <span className="text-4xl mb-2 block">📭</span>
            <p>No milestones to review yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 4a. Oracle Milestone Item ---

function OracleMilestoneItem({ milestoneIndex }: { milestoneIndex: number }) {
  const { address } = useAccount();

  const { data: milestone, refetch: refetch_milestone } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "milestones",
    args: [BigInt(milestoneIndex)],
  });

  const { data: hasVoted, refetch: refetch_hasVoted } = useScaffoldReadContract({
    contractName: "ReliefFund",
    functionName: "getMilestoneVotedStatus",
    args: [BigInt(milestoneIndex), address],
  });

  const { writeContractAsync: approve, isPending } = useScaffoldWriteContract("ReliefFund");

  useScaffoldWatchContractEvent({
    contractName: "ReliefFund",
    eventName: "MilestoneRequested",
    onLogs: logs => {
      logs.forEach(log => {
        // @ts-expect-error - Event args are not strongly typed here
        if (log.args.milestoneIndex === BigInt(milestoneIndex)) {
          refetch_milestone();
        }
      });
    },
  });

  if (!milestone) return null;

  const [payoutAmount, proofUrl, isPaid, voteCount] = milestone;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-lg text-blue-800">Milestone {milestoneIndex + 1}</h4>
        <div className="text-right">
          <div className="text-xl font-bold text-blue-600">{formatEther(payoutAmount).toString()} ETH</div>
        </div>
      </div>

      {isPaid ? (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span className="font-semibold">Payment Completed</span>
        </div>
      ) : !proofUrl ? (
        <div className="bg-gray-50 text-gray-500 px-4 py-3 rounded-xl border border-gray-200 flex items-center gap-2">
          <span className="text-lg">⏸️</span>
          <span>Not yet requested by recipient</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📎</span>
              <span className="font-semibold text-blue-700">Proof Submission</span>
            </div>
            <a
              href={proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 break-all text-sm transition-colors"
            >
              {proofUrl}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <div className="text-blue-700 font-semibold">Current Votes</div>
              <div className="text-lg font-bold text-blue-800">{voteCount.toString()}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <div className="text-blue-700 font-semibold">Your Vote</div>
              <div className="text-lg font-bold text-blue-800">{hasVoted ? "✅" : "⏳"}</div>
            </div>
          </div>

          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={() =>
              approve(
                {
                  functionName: "approveMilestone",
                  args: [BigInt(milestoneIndex)],
                },
                {
                  onSuccess: async () => {
                    await refetch_milestone();
                    await refetch_hasVoted();
                  },
                },
              )
            }
            disabled={isPending || hasVoted}
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : hasVoted ? (
              <>
                <span>Already Voted</span>
                <span>👍</span>
              </>
            ) : (
              <>
                <span>Approve Milestone</span>
                <span>✅</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}