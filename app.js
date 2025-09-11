// ===== Global Variables =====
let provider, signer, contract;

const CONTRACT_ADDRESS = "0x98FCc396547D450208e926995a74b61874a1423A"; // replace with real address
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_nuurToken","type":"address"},{"internalType":"address","name":"_devWallet","type":"address"},{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newDevWallet","type":"address"}],"name":"DevWalletUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"NUURWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phaseId","type":"uint256"},{"indexed":false,"internalType":"string","name":"phaseName","type":"string"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"}],"name":"PhaseUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"isActive","type":"bool"}],"name":"PresaleStatusChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"SDAWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"sdaAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"nuurAmount","type":"uint256"},{"indexed":false,"internalType":"string","name":"phaseName","type":"string"},{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"sdaAmount","type":"uint256"}],"name":"calculateNUURAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentPhaseId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentPhaseName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentPhaseInfo","outputs":[{"internalType":"uint256","name":"phaseId","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNUURBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"phaseId","type":"uint256"}],"name":"getPhaseInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSDABalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nuurToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"phases","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"tokensSold","type":"uint256"},{"internalType":"uint256","name":"sdaReceived","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_status","type":"bool"}],"name":"setPresaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalSDAReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newDevWallet","type":"address"}],"name":"updateDevWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPhaseId","type":"uint256"},{"internalType":"string","name":"newPhaseName","type":"string"},{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"updatePhase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawNUUR","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawSDA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// ===== Utility =====
function showStatus(message, type = "info") {
  const el = document.getElementById("statusMessage");
  el.textContent = message;
  el.className = `status ${type}`;
  el.style.display = "block";
}

// ===== Wallet Connection =====
async function connectWallet() {
  try {
    if (!window.ethereum) {
      showStatus("MetaMask not found", "error");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Request accounts
    await provider.send("eth_requestAccounts", []);

    const address = await signer.getAddress();
    document.getElementById("walletStatus").textContent = "Connected";
    document.getElementById("connectedAddress").textContent =
      address.slice(0, 6) + "..." + address.slice(-4);

    // Load contract
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    showStatus("Wallet connected!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Connection error:", err);
    showStatus("Connection failed: " + err.message, "error");
  }
}

// ===== Load Contract Info =====
async function refreshContractInfo() {
  if (!contract) {
    showStatus("Connect wallet first", "error");
    return;
  }

  try {
    const [
      presaleActive,
      currentPhaseId,
      currentPhaseName,
      currentRate,
      totalTokensSold,
      totalSDAReceived,
      sdaBalance,
      nuurBalance,
      devWallet,
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

    document.getElementById("contractAddress").textContent = CONTRACT_ADDRESS;
    document.getElementById("presaleStatus").textContent = presaleActive ? "Active" : "Inactive";
    document.getElementById("currentPhase").textContent = `Phase ${currentPhaseId} - ${currentPhaseName}`;
    document.getElementById("currentRate").textContent = `${currentRate.toString()} NUUR/SDA`;
    document.getElementById("totalTokensSold").textContent = ethers.formatUnits(totalTokensSold, 18) + " NUUR";
    document.getElementById("totalSDAReceived").textContent = ethers.formatEther(totalSDAReceived) + " SDA";
    document.getElementById("sdaBalance").textContent = ethers.formatEther(sdaBalance) + " SDA";
    document.getElementById("nuurBalance").textContent = ethers.formatUnits(nuurBalance, 18) + " NUUR";
    document.getElementById("devWallet").textContent = devWallet;

    showStatus("Contract info loaded!", "success");
  } catch (err) {
    console.error("Refresh error:", err);
    showStatus("Error loading info: " + err.message, "error");
  }
}

// ===== Withdraw SDA =====
async function withdrawSDA() {
  try {
    const amount = document.getElementById("withdrawAmount").value;
    if (!amount || amount <= 0) {
      showStatus("Enter a valid amount", "error");
      return;
    }
    const tx = await contract.withdrawSDA(ethers.parseEther(amount));
    showStatus("Transaction sent...", "info");
    await tx.wait();
    showStatus("SDA withdrawn!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Withdraw error:", err);
    showStatus("Withdraw failed: " + err.message, "error");
  }
}

// ===== Withdraw All SDA =====
async function withdrawAllSDA() {
  try {
    const balance = await contract.getSDABalance();
    if (balance === 0n) {
      showStatus("No SDA to withdraw", "info");
      return;
    }
    const tx = await contract.withdrawSDA(balance);
    showStatus("Transaction sent...", "info");
    await tx.wait();
    showStatus("All SDA withdrawn!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Withdraw all error:", err);
    showStatus("Withdraw failed: " + err.message, "error");
  }
}

// ===== Presale Status =====
async function setPresaleStatus() {
  try {
    const status = document.getElementById("presaleStatusSelect").value === "true";
    const tx = await contract.setPresaleStatus(status);
    await tx.wait();
    showStatus("Presale status updated!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Presale status error:", err);
    showStatus("Update failed: " + err.message, "error");
  }
}

// ===== Update Dev Wallet =====
async function updateDevWallet() {
  try {
    const newWallet = document.getElementById("newDevWallet").value;
    if (!ethers.isAddress(newWallet)) {
      showStatus("Invalid address", "error");
      return;
    }
    const tx = await contract.updateDevWallet(newWallet);
    await tx.wait();
    showStatus("Dev wallet updated!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Update wallet error:", err);
    showStatus("Update failed: " + err.message, "error");
  }
}

// ===== Update Phase =====
async function updatePhase() {
  try {
    const id = document.getElementById("newPhaseId").value;
    const name = document.getElementById("newPhaseName").value;
    const rate = document.getElementById("newRate").value;
    if (!id || !name || !rate) {
      showStatus("Fill all fields", "error");
      return;
    }
    const tx = await contract.updatePhase(parseInt(id), name, parseInt(rate));
    await tx.wait();
    showStatus("Phase updated!", "success");
    await refreshContractInfo();
  } catch (err) {
    console.error("Update phase error:", err);
    showStatus("Update failed: " + err.message, "error");
  }
}
