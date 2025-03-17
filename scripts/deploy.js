const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const startTime = Date.now();
    const [deployer] = await hre.ethers.getSigners();

    console.log(`👤 Vertrag wird von folgender Adresse deployed: ${deployer.address}`);

    const Mikrokredit = await hre.ethers.getContractFactory("Mikrokredit");
    const mikrokredit = await Mikrokredit.deploy();
    await mikrokredit.deployed();

    console.log(`✅ Mikrokredit deployed to: ${mikrokredit.address}`);
    saveToFile("latest-contract-address.txt", mikrokredit.address);
    
    await wait(5000);

    const network = await hre.ethers.provider.getNetwork();
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    const contractBalance = await hre.ethers.provider.getBalance(mikrokredit.address);
    const gasPrice = await hre.ethers.provider.getGasPrice();
    const txReceipt = await mikrokredit.deploymentTransaction().wait();
    
    logDeploymentDetails(deployer, network, blockNumber, contractBalance, gasPrice, txReceipt);

    saveDeploymentData(mikrokredit.address, network.chainId, blockNumber, txReceipt.gasUsed, gasPrice);
    
    // Beispiel-Kreditanfrage
    const [user] = await hre.ethers.getSigners();
    await handleLoanRequest(mikrokredit, user);

    // Rückzahlung simulieren
    await handleRepayment(mikrokredit);

    const endTime = Date.now();
    console.log(`⏱️ Deployment-Dauer: ${((endTime - startTime) / 1000).toFixed(2)} Sekunden`);

    saveDeploymentCount();
}

async function handleLoanRequest(mikrokredit, user) {
    console.log(`👤 Kreditanfrage wird gestellt von: ${user.address}`);

    const kreditBetrag = hre.ethers.parseEther("1"); // 1 ETH
    const kreditStartTime = Date.now();

    const tx = await mikrokredit.anfrageKredit(kreditBetrag, 5, 30);
    await tx.wait();

    console.log(`⏳ Kreditanfrage verarbeitet in: ${((Date.now() - kreditStartTime) / 1000).toFixed(2)} Sekunden`);

    const kreditAnzahl = await mikrokredit.getKreditAnzahl();
    const kreditDetails = await mikrokredit.getKreditDetails(0);
    const kreditBetragInEth = hre.ethers.formatEther(kreditDetails[1]);

    saveToFile("latest-loan-id.txt", kreditAnzahl - 1);
    appendToFile("loan-amounts.txt", `${kreditBetragInEth} ETH\n`);
    updateBorrowerStats(user);
}

async function handleRepayment(mikrokredit) {
    console.log("💰 Rückzahlung wird getestet...");
    const tx = await mikrokredit.zurueckzahlen(0, { value: hre.ethers.parseEther("1.05") });
    await tx.wait();
    console.log("✅ Kredit erfolgreich zurückgezahlt!");

    saveToFile("latest-repayment.txt", "1.05 ETH");
    updateRepaymentStats();
}
const revenueFile = "total-revenue.txt";
let totalRevenue = 0;

// Prüfen, ob die Datei existiert und bisherige Werte laden
if (fs.existsSync(revenueFile)) {
    totalRevenue = parseFloat(fs.readFileSync(revenueFile, "utf8")) || 0;
}

// Neuen Rückzahlungsbetrag hinzufügen
const repaymentAmount = parseFloat("1.05"); // Beispiel für eine Rückzahlung
totalRevenue += repaymentAmount;

// Speichert die gesamte Einnahmensumme in einer Datei
fs.writeFileSync(revenueFile, totalRevenue.toString());

console.log(`💰 Gesamte Einnahmen aus Rückzahlungen gespeichert: ${totalRevenue} ETH`);
const maxRevenueFile = "max-revenue.txt";
const minRevenueFile = "min-revenue.txt";
let maxRevenue = 0;
let minRevenue = Number.MAX_VALUE;

// Prüfen, ob die Dateien existieren und bisherige Werte laden
if (fs.existsSync(maxRevenueFile)) {
    maxRevenue = parseFloat(fs.readFileSync(maxRevenueFile, "utf8")) || 0;
}
if (fs.existsSync(minRevenueFile)) {
    minRevenue = parseFloat(fs.readFileSync(minRevenueFile, "utf8")) || Number.MAX_VALUE;
}

// Neuen Rückzahlungsbetrag prüfen und speichern
if (repaymentAmount > maxRevenue) {
    fs.writeFileSync(maxRevenueFile, repaymentAmount.toString());
    console.log(`💾 Höchste Rückzahlung gespeichert: ${repaymentAmount} ETH`);
}
if (repaymentAmount < minRevenue) {
    fs.writeFileSync(minRevenueFile, repaymentAmount.toString());
    console.log(`💾 Niedrigste Rückzahlung gespeichert: ${repaymentAmount} ETH`);
}
const latestPaidLoanFile = "latest-paid-loan.txt";
const latestPaidLoanId = 0; // Beispiel: Hier müsste die tatsächliche ID des zurückgezahlten Kredits stehen

// Speichert die ID des zuletzt zurückgezahlten Kredits in einer Datei
fs.writeFileSync(latestPaidLoanFile, latestPaidLoanId.toString());

console.log(`💾 Letzte zurückgezahlte Kredit-ID gespeichert: ${latestPaidLoanId}`);

function logDeploymentDetails(deployer, network, blockNumber, contractBalance, gasPrice, txReceipt) {
    console.log(`📦 Blocknummer: ${blockNumber}`);
    console.log(`🌍 Chain-ID: ${network.chainId}`);
    console.log(`🏦 Vertragsbalance: ${hre.ethers.formatEther(contractBalance)} ETH`);
    console.log(`⛽ Gasverbrauch: ${txReceipt.gasUsed}`);
    console.log(`💰 Gaspreis: ${hre.ethers.formatUnits(gasPrice, "gwei")} Gwei`);
    console.log(`💸 Deployment-Kosten: ${hre.ethers.formatEther(txReceipt.gasUsed * gasPrice)} ETH`);
}

function saveDeploymentData(contractAddress, chainId, blockNumber, gasUsed, gasPrice) {
    const deploymentData = {
        contractAddress,
        chainId,
        blockNumber,
        gasUsed: gasUsed.toString(),
        gasCost: hre.ethers.formatEther(gasUsed * gasPrice),
    };

    saveToFile("deployment-info.json", JSON.stringify(deploymentData, null, 2));
}

function updateBorrowerStats(user) {
    const file = "borrower-stats.json";
    const stats = readJSON(file);

    stats[user.address] = (stats[user.address] || 0) + 1;

    saveToFile(file, JSON.stringify(stats, null, 2));
    console.log(`📊 ${user.address} hat nun insgesamt ${stats[user.address]} Kredite beantragt.`);
}

function updateRepaymentStats() {
    const file = "total-repayment-count.txt";
    let count = readNumber(file);
    count++;

    saveToFile(file, count.toString());
    console.log(`💾 Anzahl der Rückzahlungen: ${count}`);
}

function saveDeploymentCount() {
    const file = "deployment-count.txt";
    let count = readNumber(file);
    count++;

    saveToFile(file, count.toString());
    console.log(`🔄 Anzahl der bisherigen Deployments: ${count}`);
}

// Hilfsfunktionen für Dateioperationen
function saveToFile(filename, data) {
    fs.writeFileSync(filename, data);
}

function appendToFile(filename, data) {
    fs.appendFileSync(filename, data);
}

function readJSON(filename) {
    return fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, "utf8")) : {};
}

function readNumber(filename) {
    return fs.existsSync(filename) ? parseInt(fs.readFileSync(filename, "utf8")) || 0 : 0;
}

// Wartezeit simulieren
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
