const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`👤 Vertrag wird von folgender Adresse deployed: ${deployer.address}`);

    const estimatedGas = await hre.ethers.provider.estimateGas(Mikrokredit.getDeployTransaction());
    console.log(`📊 Geschätzter Gasverbrauch für das Deployment: ${estimatedGas}`);

    const Mikrokredit = await hre.ethers.getContractFactory("Mikrokredit");
    const mikrokredit = await Mikrokredit.deploy();

    await mikrokredit.deployed();

    fs.writeFileSync("latest-contract.txt", mikrokredit.address);
    console.log("💾 Letzte Smart Contract-Adresse wurde in 'latest-contract.txt' gespeichert!");


    console.log(`✅ Mikrokredit deployed to: ${mikrokredit.address}`);

    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Sekunden warten

    console.log("⏳ Wartezeit nach Deployment abgeschlossen. Es geht weiter...");
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`📦 Aktuelle Blocknummer: ${blockNumber}`);
    const network = await hre.ethers.provider.getNetwork();
    console.log(`🌍 Chain-ID des Netzwerks: ${network.chainId}`);
    const contractBalance = await hre.ethers.provider.getBalance(mikrokredit.address);
    console.log(`🏦 Aktuelle ETH-Balance des Vertrags: ${hre.ethers.formatEther(contractBalance)} ETH`);
    const gasPrice = await hre.ethers.provider.getGasPrice();
    console.log(`⛽ Durchschnittliche Gasgebühr im Netzwerk: ${hre.ethers.formatUnits(gasPrice, "gwei")} Gwei`)
    const txReceipt = await mikrokredit.deploymentTransaction().wait();
    const gasUsed = txReceipt.gasUsed;
    const gasCost = hre.ethers.formatEther(gasUsed * gasPrice);

    console.log(`⛽ Gasverbrauch beim Deployment: ${gasUsed} Einheiten`);
    console.log(`💰 Gaspreis: ${hre.ethers.formatUnits(gasPrice, "gwei")} Gwei`);
    console.log(`💸 Gesamt-Kosten des Deployments: ${gasCost} ETH`);
    const deploymentTime = new Date().toISOString();
    console.log(`⏳ Deployment-Zeit (UTC): ${deploymentTime}`);

    const fs = require("fs");

    // Deployment-Daten speichern
    const deploymentData = {
       contractAddress: mikrokredit.address,
       chainId: network.chainId,
       blockNumber: blockNumber,
       gasUsed: gasUsed.toString(),
       gasCost: gasCost
     };

    // Speichert die Deployment-Daten in einer JSON-Datei
    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentData, null, 2));

    console.log("💾 Deployment-Informationen wurden in 'deployment-info.json' gespeichert!");

    console.log(`👤 Vertrag wird von folgender Adresse deployed: ${deployer.address}`);
    const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`💳 ETH-Balance des Deployers nach Deployment: ${hre.ethers.formatEther(deployerBalance)} ETH`);
    
    const networkName = hre.network.name;

    console.log(`🌐 Deployment auf Netzwerk: ${networkName}`);
    const [user] = await hre.ethers.getSigners();
    console.log(`👤 Kreditanfrage wird gestellt von: ${user.address}`);
    
    // Beispiel-Kreditanfrage direkt nach Deployment
    const kreditBetrag = hre.ethers.parseEther("1"); // 1 ETH
    const kreditStartTime = Date.now();
    const tx = await mikrokredit.anfrageKredit(kreditBetrag, 5, 30);
    await tx.wait();
    const kreditEndTime = Date.now();
    
    const kreditDauer = ((kreditEndTime - kreditStartTime) / 1000).toFixed(2);
    console.log(`⏳ Kreditanfrage verarbeitet in: ${kreditDauer} Sekunden`);
    
    // Letzte Kreditanfrage-ID speichern
    const latestLoanId = kreditAnzahl - 1; // IDs beginnen bei 0
    fs.writeFileSync("latest-loan-id.txt", latestLoanId.toString());
    // Kreditbetrag speichern
    fs.appendFileSync("loan-amounts.txt", `${kreditBetragInEth} ETH\n`);
    
    console.log(`💾 Kreditbetrag gespeichert: ${kreditBetragInEth} ETH`);
    // Gesamtsumme aller Kredite berechnen
    const loanAmounts = fs.readFileSync("loan-amounts.txt", "utf8")
    .split("\n")
    .filter(line => line.trim() !== "")
    .map(line => parseFloat(line.split(" ")[0])); // ETH-Betrag extrahieren
    const totalLoanAmount = loanAmounts.reduce((acc, val) => acc + val, 0).toFixed(4);
    console.log(`📊 Gesamtsumme aller Kredite: ${totalLoanAmount} ETH`);
    // Durchschnittlichen Kreditbetrag berechnen
    const averageLoanAmount = loanAmounts.length > 0 
    ? (totalLoanAmount / loanAmounts.length).toFixed(4) 
    : 0;

    console.log(`📊 Durchschnittlicher Kreditbetrag: ${averageLoanAmount} ETH`);



    console.log(`💾 Letzte Kreditanfrage-ID gespeichert: ${latestLoanId}`);
    // Speichert die letzte Kreditnehmer-Adresse
    fs.writeFileSync("latest-borrower.txt", user.address);
    console.log(`💾 Letzte Kreditnehmer-Adresse gespeichert: ${user.address}`);
    // ETH-Balance des Kreditnehmers abrufen
    const borrowerBalance = await hre.ethers.provider.getBalance(user.address);
    console.log(`💰 ETH-Balance des Kreditnehmers nach Kreditanfrage: ${hre.ethers.formatEther(borrowerBalance)} ETH`);

    

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
    const endTime = Date.now();
    const deploymentDuration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`⏱️ Deployment-Dauer: ${deploymentDuration} Sekunden`);
    const fs = require("fs");

    // Überprüfen, ob die Datei existiert, und vorherige Deployments zählen
    let deploymentCount = 0;
    const deploymentCountFile = "deployment-count.txt";
    
    if (fs.existsSync(deploymentCountFile)) {
        const count = fs.readFileSync(deploymentCountFile, "utf8");
        deploymentCount = parseInt(count) || 0;
    }
    
    deploymentCount++; // Erhöhe den Zähler für das neue Deployment
    fs.writeFileSync(deploymentCountFile, deploymentCount.toString());
    
    console.log(`🔄 Anzahl der bisherigen Deployments: ${deploymentCount}`);
    


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

