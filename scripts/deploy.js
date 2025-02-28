const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`👤 Vertrag wird von folgender Adresse deployed: ${deployer.address}`);

    const estimatedGas = await hre.ethers.provider.estimateGas(Mikrokredit.getDeployTransaction());
    console.log(`📊 Geschätzter Gasverbrauch für das Deployment: ${estimatedGas}`);

    const Mikrokredit = await hre.ethers.getContractFactory("Mikrokredit");
    const mikrokredit = await Mikrokredit.deploy();

    await mikrokredit.deployed();

    console.log(`✅ Mikrokredit deployed to: ${mikrokredit.address}`);

    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Sekunden warten

    console.log("⏳ Wartezeit nach Deployment abgeschlossen. Es geht weiter...");
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`📦 Aktuelle Blocknummer: ${blockNumber}`);
    const txReceipt = await mikrokredit.deploymentTransaction().wait();
    const gasUsed = txReceipt.gasUsed;
    const gasPrice = txReceipt.effectiveGasPrice;
    const gasCost = hre.ethers.formatEther(gasUsed * gasPrice);

    console.log(`⛽ Gasverbrauch beim Deployment: ${gasUsed} Einheiten`);
    console.log(`💰 Gaspreis: ${hre.ethers.formatUnits(gasPrice, "gwei")} Gwei`);
    console.log(`💸 Gesamt-Kosten des Deployments: ${gasCost} ETH`);
    console.log(`👤 Vertrag wird von folgender Adresse deployed: ${deployer.address}`);
    const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`💳 ETH-Balance des Deployers nach Deployment: ${hre.ethers.formatEther(deployerBalance)} ETH`);
    
    const networkName = hre.network.name;

    console.log(`🌐 Deployment auf Netzwerk: ${networkName}`);


    // Beispiel-Kreditanfrage direkt nach Deployment
    const kreditBetrag = hre.ethers.parseEther("1"); // 1 ETH
    const tx = await mikrokredit.anfrageKredit(kreditBetrag, 5, 30);
    await tx.wait();

    const kreditAnzahl = await mikrokredit.getKreditAnzahl();
    const kreditDetails = await mikrokredit.getKreditDetails(0);
    const kreditBetragInEth = hre.ethers.formatEther(kreditDetails[1]);

    console.log(`📊 Aktuelle Anzahl an Kreditanfragen: ${kreditAnzahl}`);
    console.log(`💰 Kreditbetrag der ersten Anfrage: ${kreditBetragInEth} ETH`);


    console.log("📌 Erste Kreditanfrage erfolgreich gestellt!");

    // 💰 Rückzahlungstest hinzufügen
    const rueckzahlung = await mikrokredit.zurueckzahlen(0, { value: hre.ethers.parseEther("1.05") });
    await rueckzahlung.wait();
    console.log("✅ Kredit erfolgreich zurückgezahlt!");
    const fs = require("fs");

// Speichert die Adresse in einer Datei für das Frontend
    fs.writeFileSync("contract-address.txt", mikrokredit.address);

    console.log("💾 Smart Contract-Adresse wurde in 'contract-address.txt' gespeichert!");
 

    const kreditZurueckgezahlt = kreditDetails[4] ? "✅ Bezahlt" : "⏳ Ausstehend";

    console.log(`📊 Aktuelle Anzahl an Kreditanfragen: ${kreditAnzahl}`);
    console.log(`💰 Kreditbetrag der ersten Anfrage: ${kreditBetragInEth} ETH`);
    const kreditnehmerAdresse = kreditDetails[0];

    console.log(`📌 Kreditnehmer: ${kreditnehmerAdresse}`);
    console.log(`📌 Kreditstatus: ${kreditZurueckgezahlt}`);


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

