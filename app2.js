// app.js (Admin Dashboard)

// ==========================
// Contract Config
// ==========================
let provider;
let signer;
let contract;
let userAddress;

const CONTRACT_ADDRESS = "0xF2bba480Fc3b2e75019CE54e3Da8D1f9A5d9a067"; // <- replace with real
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_vestingContract","type":"address"},{"internalType":"address","name":"_devWallet","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newDevWallet","type":"address"}],"name":"DevWalletUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phaseId","type":"uint256"},{"indexed":false,"internalType":"string","name":"phaseName","type":"string"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"}],"name":"PhaseUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"isActive","type":"bool"}],"name":"PresaleStatusChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"sdaAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"nuurAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"phaseName","type":"string"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"sdaAmount","type":"uint256"}],"name":"calculateNUURAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentPhaseId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"devWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentPhaseInfo","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"phaseId","type":"uint256"}],"name":"getPhaseInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"phases","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setPresaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalSDAReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newDevWallet","type":"address"}],"name":"updateDevWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPhaseId","type":"uint256"},{"internalType":"string","name":"newName","type":"string"},{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"updatePhase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vestingContract","outputs":[{"internalType":"contract IVesting","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];
// ==========================
// Wallet Connection
// ==========================
async function connectWallet() {
  try {
    showStatus("Connecting to wallet...", "info");

    if (!window.ethereum) {
      showStatus("MetaMask not found! Please install it.", "error");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    userAddress = await signer.getAddress();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    document.getElementById("walletStatus").textContent = "Connected";
    document.getElementById("connectedAddress").textContent =
      userAddress.slice(0, 6) + "..." + userAddress.slice(-4);

    showStatus("Wallet connected!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Connection error:", err);
    showStatus("Connection failed: " + err.message, "error");
  }
}

// ==========================
// Refresh Contract Info
// ==========================
async function refreshContractInfo() {
  if (!contract) {
    showStatus("Please connect wallet first", "error");
    return;
  }

  try {
    showStatus("Loading contract info...", "info");

    const [
      presaleActive,
      currentPhaseId,
      currentPhaseName,
      currentRate,
      totalTokensSold,
      totalSDAReceived,
      sdaBalance,
      nuurBalance,
      devWalletAddress,
    ] = await Promise.all([
      contract.presaleActive(),
      contract.currentPhaseId(),
      contract.currentPhaseName(),
      contract.currentRate(),
      contract.totalTokensSold(),
      contract.totalSDAReceived(),
      contract.getSDABalance(),
      contract.getNUURBalance(),
      contract.devWallet(),
    ]);

    document.getElementById("contractAddress").textContent =
      CONTRACT_ADDRESS.slice(0, 6) + "..." + CONTRACT_ADDRESS.slice(-4);
    document.getElementById("presaleStatus").textContent = presaleActive
      ? "Active"
      : "Inactive";
    document.getElementById(
      "currentPhase"
    ).textContent = `Phase ${currentPhaseId} - ${currentPhaseName}`;
    document.getElementById(
      "currentRate"
    ).textContent = `${currentRate.toString()} NUUR/SDA`;
    document.getElementById("totalTokensSold").textContent =
      ethers.formatUnits(totalTokensSold, 18) + " NUUR";
    document.getElementById("totalSDAReceived").textContent =
      ethers.formatEther(totalSDAReceived) + " SDA";
    document.getElementById("sdaBalance").textContent =
      ethers.formatEther(sdaBalance) + " SDA";
    document.getElementById("nuurBalance").textContent =
      ethers.formatUnits(nuurBalance, 18) + " NUUR";
    document.getElementById("devWallet").textContent =
      devWalletAddress.slice(0, 6) + "..." + devWalletAddress.slice(-4);

    showStatus("Contract info updated!", "success");
  } catch (err) {
    console.error("Refresh error:", err);
    showStatus("Error loading contract info: " + err.message, "error");
  }
}

// ==========================
// Withdraw Functions
// ==========================
async function withdrawSDA() {
  if (!contract) return showStatus("Please connect wallet first", "error");

  const amount = document.getElementById("withdrawAmount").value;
  if (!amount || amount <= 0)
    return showStatus("Enter a valid amount", "error");

  try {
    showStatus("Withdrawing SDA...", "info");
    const tx = await contract.withdrawSDA(ethers.parseEther(amount));
    await tx.wait();
    showStatus("SDA withdrawn!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Withdrawal error:", err);
    showStatus("Withdrawal failed: " + err.message, "error");
  }
}

async function withdrawAllSDA() {
  if (!contract) return showStatus("Please connect wallet first", "error");

  try {
    const balance = await contract.getSDABalance();
    if (balance === 0n) return showStatus("No SDA to withdraw", "info");

    showStatus("Withdrawing all SDA...", "info");
    const tx = await contract.withdrawSDA(balance);
    await tx.wait();
    showStatus("All SDA withdrawn!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("WithdrawAll error:", err);
    showStatus("Withdrawal failed: " + err.message, "error");
  }
}

async function withdrawNUUR() {
  if (!contract) return showStatus("Please connect wallet first", "error");

  const amount = document.getElementById("withdrawNuurAmount").value;
  if (!amount || amount <= 0)
    return showStatus("Enter a valid amount", "error");

  try {
    showStatus("Withdrawing NUUR...", "info");
    const tx = await contract.withdrawNUUR(ethers.parseUnits(amount, 18));
    await tx.wait();
    showStatus("NUUR withdrawn!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Withdraw NUUR error:", err);
    showStatus("Withdrawal failed: " + err.message, "error");
  }
}

// ==========================
// Admin Controls
// ==========================
async function setPresaleStatus() {
  if (!contract) return showStatus("Please connect wallet first", "error");

  const status = document.getElementById("presaleStatusSelect").value === "true";

  try {
    showStatus("Updating presale status...", "info");
    const tx = await contract.setPresaleStatus(status);
    await tx.wait();
    showStatus("Presale status updated!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Set presale error:", err);
    showStatus("Update failed: " + err.message, "error");
  }
}

async function updateDevWallet() {
  if (!contract) return showStatus("Please connect wallet first", "error");

  const newWallet = document.getElementById("newDevWallet").value;
  if (!ethers.isAddress(newWallet))
    return showStatus("Invalid wallet address", "error");

  try {
    showStatus("Updating dev wallet...", "info");
    const tx = await contract.updateDevWallet(newWallet);
    await tx.wait();
    showStatus("Dev wallet updated!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Dev wallet error:", err);
    showStatus("Update failed: " + err.message, "error");
  }
}

async function updatePhase() {
  if (!contract) return showStatus("Please connect wallet first", "error");

  const phaseId = document.getElementById("newPhaseId").value;
  const phaseName = document.getElementById("newPhaseName").value;
  const rate = document.getElementById("newRate").value;

  if (!phaseId || !phaseName || !rate)
    return showStatus("Fill all fields", "error");

  try {
    showStatus("Updating phase...", "info");
    const tx = await contract.updatePhase(
      Number(phaseId),
      phaseName,
      Number(rate)
    );
    await tx.wait();
    showStatus("Phase updated!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Phase update error:", err);
    showStatus("Update failed: " + err.message, "error");
  }
}

// ==========================
// Helpers
// ==========================
function showStatus(message, type) {
  const statusEl = document.getElementById("statusMessage");
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = "block";
  setTimeout(() => {
    statusEl.style.display = "none";
  }, type === "error" ? 5000 : 3000);
}

// ==========================
// Init
// ==========================
window.addEventListener("load", () => {
  if (typeof ethers === "undefined") {
    showStatus("Ethers.js not loaded", "error");
    return;
  }
  if (window.ethereum) {
    showStatus("MetaMask detected. Click 'Connect Wallet'.", "info");
  } else {
    showStatus("Please install MetaMask", "error");
  }
});
