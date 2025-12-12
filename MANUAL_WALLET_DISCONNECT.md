# Manual Wallet Disconnect Utility

If the wallet is still not disconnecting, open your browser console (F12) and paste this code:

## 🔴 FORCE DISCONNECT WALLET (Browser Console)

```javascript
// ========================================
// MANUAL WALLET DISCONNECT UTILITY
// ========================================

(async function forceDisconnectWallet() {
  console.log('🔴 Starting manual wallet disconnect...');
  
  try {
    // 1. Set disconnect flag
    localStorage.setItem('wallet_disconnected', 'true');
    console.log('✅ Set disconnect flag');
    
    // 2. Disconnect from provider
    if (window.ethereum) {
      try {
        if (window.ethereum.disconnect) await window.ethereum.disconnect();
        if (window.ethereum.close) await window.ethereum.close();
        if (window.ethereum.removeAllListeners) window.ethereum.removeAllListeners();
        console.log('✅ Provider disconnected');
      } catch (e) {
        console.log('⚠️ Provider disconnect error:', e);
      }
    }
    
    // 3. List all wallet-related keys BEFORE clearing
    const walletKeys = Object.keys(localStorage).filter(k => 
      /WEB3_CONNECT_CACHED_PROVIDER|walletconnect|connected|wagmi|web3modal|wallet|ethereum|metamask|coinbase/i.test(k)
    );
    console.log('📋 Wallet-related localStorage keys:', walletKeys);
    
    // 4. Remove specific wallet keys
    const keysToRemove = [
      'WEB3_CONNECT_CACHED_PROVIDER',
      'walletconnect',
      'WALLETCONNECT_DEEPLINK_CHOICE',
      'connected',
      'wagmi.connected',
      'wagmi.wallet',
      '-walletlink:https://www.walletlink.org:session:id',
      '-walletlink:https://www.walletlink.org:session:secret',
      '-walletlink:https://www.walletlink.org:session:linked'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    console.log('✅ Removed specific wallet keys');
    
    // 5. Remove all keys containing wallet-related terms
    Object.keys(localStorage).forEach(key => {
      if (/wallet|web3|metamask|ethereum|coinbase|connect/i.test(key) && key !== 'wallet_disconnected') {
        localStorage.removeItem(key);
        console.log('🗑️ Removed:', key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (/wallet|web3|metamask|ethereum|coinbase|connect/i.test(key)) {
        sessionStorage.removeItem(key);
        console.log('🗑️ Removed from session:', key);
      }
    });
    
    // 6. Final clear (optional - uncomment if needed)
    // localStorage.clear();
    // sessionStorage.clear();
    
    console.log('✅ All wallet data cleared!');
    console.log('🔄 Reloading page in 1 second...');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error during disconnect:', error);
  }
})();
```

## 📋 Inspection Commands

### Check what's in localStorage:
```javascript
// List all wallet-related keys
Object.keys(localStorage).filter(k => 
  /WEB3_CONNECT_CACHED_PROVIDER|walletconnect|connected|wagmi|web3modal|wallet|ethereum/i.test(k)
);

// Show all key-value pairs
Object.entries(localStorage).filter(([k]) => 
  /WEB3_CONNECT_CACHED_PROVIDER|walletconnect|connected|wagmi|web3modal/i.test(k)
);
```

### Check sessionStorage:
```javascript
Object.keys(sessionStorage).filter(k => 
  /walletconnect|connected|wallet|web3/i.test(k)
);
```

### Manual removal (if needed):
```javascript
localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
localStorage.removeItem('walletconnect');
localStorage.removeItem('connected');
sessionStorage.clear();
```

## 🔧 Quick Test

After running the disconnect utility, test if it worked:

```javascript
// Should return 'true'
localStorage.getItem('wallet_disconnected');

// Should return empty array or minimal keys
Object.keys(localStorage).filter(k => /wallet|web3/i.test(k));
```

## 🔄 Complete Reset

If nothing works, nuclear option:

```javascript
// WARNING: This clears EVERYTHING
localStorage.clear();
sessionStorage.clear();
localStorage.setItem('wallet_disconnected', 'true');
window.location.href = '/';
```
