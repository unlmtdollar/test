let provider;
let signer;
let contract;
let userAddress;

// Contract configuration - UPDATE THESE VALUES
const CONTRACT_ADDRESS = "0x98FCc396547D450208e926995a74b61874a1423A";
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_nuurToken","type":"address"},{"internalType":"address","name":"_devWallet","type":"address"},{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newDevWallet","type":"address"}],"name":"DevWalletUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"NUURWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phaseId","type":"uint256"},{"indexed":false,"internalType":"string","name":"phaseName","type":"string"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"}],"name":"PhaseUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"isActive","type":"bool"}],"name":"PresaleStatusChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"SDAWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"sdaAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"nuurAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"phaseName","type":"string"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"sdaAmount","type":"uint256"}],"name":"calculateNUURAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentPhaseId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentPhaseName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentPhaseInfo","outputs":[{"internalType":"uint256","name":"phaseId","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNUURBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"phaseId","type":"uint256"}],"name":"getPhaseInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSDABalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nuurToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"phases","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setPresaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalSDAReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newDevWallet","type":"address"}],"name":"updateDevWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPhaseId","type":"uint256"},{"internalType":"string","name":"newPhaseName","type":"string"},{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"updatePhase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawNUUR","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawSDA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

async function connectWallet() {
  try {
    showStatus("Connecting to wallet...", "info");

    if (!window.ethereum) {
      showStatus("MetaMask not found! Please install MetaMask.", "error");
      return;
    }

    // ✅ Ethers v6 BrowserProvider
    provider = new ethers.BrowserProvider(window.ethereum);

    // Request account access
    await provider.send("eth_requestAccounts", []);

    // Get signer + address
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    // Create contract instance
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Update UI
    document.getElementById("walletStatus").textContent = "Connected";
    document.getElementById("connectedAddress").textContent =
      userAddress.slice(0, 8) + "..." + userAddress.slice(-6);

    showStatus("Wallet connected successfully!", "success");
    await refreshContractInfo();
  } catch (error) {
    console.error("Connection error:", error);
    showStatus("Connection failed: " + error.message, "error");
  }
}

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
      devWalletAddress
    ] = await Promise.all([
      contract.presaleActive(),
      contract.currentPhaseId(),
      contract.currentPhaseName(),
      contract.currentRate(),
      contract.totalTokensSold(),
      contract.totalSDAReceived(),
      contract.getSDABalance(),
      contract.getNUURBalance(),
      contract.devWallet()
    ]);

    document.getElementById("contractAddress").textContent =
      CONTRACT_ADDRESS.slice(0, 8) + "..." + CONTRACT_ADDRESS.slice(-6);
    document.getElementById("presaleStatus").textContent = presaleActive ? "Active" : "Inactive";
    document.getElementById("currentPhase").textContent = `Phase ${currentPhaseId} - ${currentPhaseName}`;
    document.getElementById("currentRate").textContent = `${currentRate} NUUR/SDA`;
    document.getElementById("totalTokensSold").textContent = ethers.formatUnits(totalTokensSold, 18) + " NUUR";
    document.getElementById("totalSDAReceived").textContent = ethers.formatEther(totalSDAReceived) + " SDA";
    document.getElementById("sdaBalance").textContent = ethers.formatEther(sdaBalance) + " SDA";
    document.getElementById("nuurBalance").textContent = ethers.formatUnits(nuurBalance, 18) + " NUUR";
    document.getElementById("devWallet").textContent = devWalletAddress.slice(0, 8) + "..." + devWalletAddress.slice(-6);

    showStatus("Contract info updated!", "success");
  } catch (error) {
    console.error("Refresh error:", error);
    showStatus("Error loading contract info: " + error.message, "error");
  }
}

async function withdrawSDA() {
  if (!contract) {
    showStatus("Please connect wallet first", "error");
    return;
  }

  const amount = document.getElementById("withdrawAmount").value;
  if (!amount || amount <= 0) {
    showStatus("Please enter a valid amount", "error");
    return;
  }

  try {
    showStatus("Withdrawing SDA...", "info");
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.withdrawSDA(amountWei);
    showStatus("Transaction sent. Waiting for confirmation...", "info");
    await tx.wait();
    showStatus("SDA withdrawn successfully!", "success");
    await refreshContractInfo();
  } catch (error) {
    console.error("Withdrawal error:", error);
    showStatus("Withdrawal failed: " + error.message, "error");
  }
}

async function withdrawAllSDA() {
  if (!contract) {
    showStatus("Please connect wallet first", "error");
    return;
  }

  try {
    showStatus("Getting SDA balance...", "info");
    const balance = await contract.getSDABalance();
    if (balance === 0n) {
      showStatus("No SDA to withdraw", "info");
      return;
    }

    showStatus("Withdrawing all SDA...", "info");
    const tx = await contract.withdrawSDA(balance);
    showStatus("Transaction sent. Waiting for confirmation...", "info");
    await tx.wait();
    showStatus("All SDA withdrawn successfully!", "success");
    await refreshContractInfo();
  } catch (error) {
    console.error("Withdrawal error:", error);
    showStatus("Withdrawal failed: " + error.message, "error");
  }
}

async function setPresaleStatus() {
  if (!contract) {
    showStatus("Please connect wallet first", "error");
    return;
  }

  const status = document.getElementById("presaleStatusSelect").value === "true";

  try {
    showStatus("Updating presale status...", "info");
    const tx = await contract.setPresaleStatus(status);
    await tx.wait();
    showStatus(`Presale status updated to: ${status ? "Active" : "Inactive"}`, "success");
    await refreshContractInfo();
  } catch (error) {
    console.error("Status update error:", error);
    showStatus("Update failed: " + error.message, "error");
  }
}

async function updateDevWallet() {
  if (!contract) {
    showStatus("Please connect wallet first", "error");
    return;
  }

  const newWallet = document.getElementById("newDevWallet").value;
  if (!ethers.isAddress(newWallet)) {
    showStatus("Please enter a valid wallet address", "error");
    return;
  }

  try {
    showStatus("Updating dev wallet...", "info");
    const tx = await contract.updateDevWallet(newWallet);
    await tx.wait();
    showStatus("Dev wallet updated successfully!", "success");
    await refreshContractInfo();
  } catch (error) {
    console.error("Wallet update error:", error);
    showStatus("Update failed: " + error.message, "error");
  }
}

async function updatePhase() {
  if (!contract) {
    showStatus("Please connect wallet first", "error");
    return;
  }

  const phaseId = document.getElementById("newPhaseId").value;
  const phaseName = document.getElementById("newPhaseName").value;
  const rate = document.getElementById("newRate").value;

  if (!phaseId || !phaseName || !rate) {
    showStatus("Please fill all fields", "error");
    return;
  }

  try {
    showStatus("Updating phase...", "info");
    const tx = await contract.updatePhase(parseInt(phaseId), phaseName, parseInt(rate));
    await tx.wait();
    showStatus("Phase updated successfully!", "success");
    await refreshContractInfo();
  } catch (error) {
    console.error("Phase update error:", error);
    showStatus("Update failed: " + error.message, "error");
  }
}

function showStatus(message, type) {
  const statusEl = document.getElementById("statusMessage");
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = "block";

    setTimeout(() => {
      statusEl.style.display = "none";
    }, type === "error" ? 5000 : 3000);
  }
}

window.addEventListener("load", () => {
  if (typeof ethers === "undefined") {
    showStatus("Ethers.js not loaded. Please check the CDN.", "error");
    return;
  }

  if (window.ethereum) {
    showStatus("MetaMask detected. Click 'Connect Wallet' to start", "info");
  } else {
    showStatus("Please install MetaMask to use this dApp", "error");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const withdrawInput = document.getElementById("withdrawAmount");
  if (withdrawInput) {
    withdrawInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") withdrawSDA();
    });
  }

  const newWalletInput = document.getElementById("newDevWallet");
  if (newWalletInput) {
    newWalletInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") updateDevWallet();
    });
  }
});
