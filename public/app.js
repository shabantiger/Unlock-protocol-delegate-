let provider, signer, userAddress;

const connectWalletBtn = document.getElementById("connectWallet");
const walletDisplay = document.getElementById("walletAddress");
const delegateType = document.getElementById("delegateType");
const delegateAddressInput = document.getElementById("delegateAddress");
// FAQ & Help (now includes resource links in accordion)
const FAQS = [
  {q: "What is delegation?", a: "Delegation lets you assign your voting power to another address (a steward or yourself) so they can vote on your behalf."},
  {q: "What is voting power?", a: "Voting power is the number of votes your tokens provide, and can be exercised in governance decisions."},
  {q: "What are stewards?", a: "Stewards are trusted community members who can vote on behalf of others for efficient governance."},
  {q: "Where can I get more help?", a: `Check out <a href="https://docs.unlock-protocol.com" target="_blank" class="underline text-indigo-300">Unlock Protocol Docs</a>, <a href="https://unlock-protocol.com" target="_blank" class="underline text-indigo-300">main site</a>, or <a href="https://bit.ly/joinunlockdaodiscord" target="_blank" class="underline text-indigo-300">DAO Discord</a>.`}
];
// 🔌 Define the wallet connect function
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];
      const walletDisplay = document.getElementById("walletAddress");

      if (walletDisplay) {
        walletDisplay.innerText = `Connected: ${walletAddress}`;
      }

      console.log("Connected wallet:", walletAddress);
    } catch (err) {
      console.error("Wallet connection rejected:", err);
    }
  } else {
    alert("MetaMask not detected. Please install MetaMask.");
  }
}

// 🎯 Hook up the button by ID
window.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectWalletBtn");
  if (connectBtn) {
    connectBtn.addEventListener("click", connectWallet);
  }
});
delegateType.addEventListener("change", () => {
  const type = delegateType.value;
  if (type === "custom") {
    delegateAddressInput.classList.remove("hidden");
  } else {
    delegateAddressInput.classList.add("hidden");
  }
});
// Contract ABI
const UP_TOKEN_ADDRESS = "0xac27fa800955849d6d17cc8952ba9dd6eaa66187";
const UP_TOKEN_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"CheckpointUnorderedInsertion","type":"error"},
  {"inputs":[],"name":"ECDSAInvalidSignature","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"name":"ECDSAInvalidSignatureLength","type":"error"},
  {"inputs":[{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"ECDSAInvalidSignatureS","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"increasedSupply","type":"uint256"},{"internalType":"uint256","name":"cap","type":"uint256"}],"name":"ERC20ExceededSafeSupply","type":"error"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},
  {"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},
  {"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},
  {"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},
  {"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"ERC2612ExpiredSignature","type":"error"},
  {"inputs":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC2612InvalidSigner","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"},{"internalType":"uint48","name":"clock","type":"uint48"}],"name":"ERC5805FutureLookup","type":"error"},
  {"inputs":[],"name":"ERC6372InconsistentClock","type":"error"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"currentNonce","type":"uint256"}],"name":"InvalidAccountNonce","type":"error"},
  {"inputs":[],"name":"InvalidInitialization","type":"error"},
  {"inputs":[],"name":"NotInitializing","type":"error"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},
  {"inputs":[{"internalType":"uint8","name":"bits","type":"uint8"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SafeCastOverflowedUintDowncast","type":"error"},
  {"inputs":[{"internalType":"uint256","name":"expiry","type":"uint256"}],"name":"VotesExpiredSignature","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousVotes","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newVotes","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},
  {"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"version","type":"uint64"}],"name":"Initialized","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
  {"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},
  {"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint32","name":"pos","type":"uint32"}],"name":"checkpoints","outputs":[{"components":[{"internalType":"uint48","name":"_key","type":"uint48"},{"internalType":"uint208","name":"_value","type":"uint208"}],"internalType":"struct Checkpoints.Checkpoint208","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"initialOwner","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"upSwap","type":"address"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}
];


