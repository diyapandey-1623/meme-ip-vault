'use client';

import { useState } from 'react';
import { parseEther } from 'viem';

interface PayRoyaltyProps {
  ipAssetId: string;
  ipAssetTitle: string;
  onSuccess?: () => void;
}

export default function PayRoyaltyForm({ ipAssetId, ipAssetTitle, onSuccess }: PayRoyaltyProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePayRoyalty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/royalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverIpId: ipAssetId,
          payerIpId: '0x0000000000000000000000000000000000000000', // Tip (external payment)
          amount: parseEther(amount).toString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to pay royalty');
      }

      setSuccess(true);
      setAmount('');
      if (onSuccess) onSuccess();
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pay royalty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-purple-500/30">
      <h3 className="text-2xl font-bold text-purple-400 mb-4">💰 Support This IP Asset</h3>
      <p className="text-gray-300 mb-6">
        Send $WIP tokens to <span className="text-cyan-400 font-semibold">{ipAssetTitle}</span>
      </p>

      <form onSubmit={handlePayRoyalty} className="space-y-4">
        <div>
          <label className="block text-gray-300 font-bold mb-2">
            Amount ($WIP)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-3 bg-gray-800 border-2 border-purple-500/30 text-white rounded-xl focus:border-purple-500 focus:outline-none text-lg"
            disabled={loading}
          />
          <p className="text-sm text-gray-400 mt-2">
            Wrapped IP Token - Used for royalty payments
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-300">✅ Royalty payment successful!</p>
          </div>
        )}

        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
          <h4 className="text-cyan-400 font-bold mb-2">ℹ️ How It Works</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• You're tipping this IP Asset with $WIP tokens</li>
            <li>• If this IP has parent IPs, they automatically get their share</li>
            <li>• Payment is split based on licensing terms</li>
            <li>• Requires wallet connection (MetaMask, etc.)</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg py-4 rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            '💸 Send Payment'
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Note: Actual transaction requires wallet integration
        </p>
      </form>
    </div>
  );
}
