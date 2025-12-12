'use client';

interface BlockchainStatusProps {
  ipId?: string | null;
  txHash?: string | null;
  licenseTermsId?: string | null;
}

export default function BlockchainStatus({ ipId, txHash, licenseTermsId }: BlockchainStatusProps) {
  // If ipId exists, the asset is fully registered
  const isRegistered = !!ipId;

  if (isRegistered) {
    return (
      <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-sm text-gray-500">On-Chain Protection</p>
            <p className="font-bold text-lg text-green-700">
              Active on Story Protocol
            </p>
          </div>
        </div>

        {/* IP Asset Details */}
        <div className="space-y-3 mt-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">IP Asset ID:</p>
            <p className="font-mono text-xs break-all bg-white p-2 rounded border border-green-200">
              {ipId}
            </p>
          </div>

          {licenseTermsId && (
            <div>
              <p className="text-xs text-gray-600 mb-1">PIL License Terms ID:</p>
              <p className="font-mono text-xs break-all bg-white p-2 rounded border border-green-200">
                {licenseTermsId}
              </p>
              <p className="text-xs text-green-700 mt-1">
                ✓ Programmable IP License (PIL) terms attached
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <a
              href={`https://aeneid.explorer.story.foundation/ipa/${ipId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg text-center text-sm flex items-center justify-center gap-2"
            >
              <span>🔍 View on Story Explorer</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {txHash && (
              <a
                href={`https://aeneid.explorer.story.foundation/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg text-center text-sm flex items-center justify-center gap-2"
              >
                <span>📋 View Transaction</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pending state - show yellow box
  return (
    <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-4 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl animate-pulse">⏳</span>
        <div>
          <p className="text-sm text-gray-500">Blockchain Status</p>
          <p className="font-bold text-lg text-yellow-700">
            Registering on Story Protocol...
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-3">
        Waiting for transaction confirmation on the blockchain.
      </p>

      {txHash && (
        <div className="mt-4">
          <a
            href={`https://aeneid.explorer.story.foundation/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg text-sm"
          >
            <span>📋 View Pending Transaction</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      <p className="text-xs text-blue-600 mt-3 animate-pulse">
        🔄 This page will auto-refresh when registration completes
      </p>
    </div>
  );
}
