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
    // Gesamtanzahl aller Kreditanfragen in Datei speichern
    fs.writeFileSync("total-loans.txt", totalLoansRequested.toString());

    console.log(`💾 Gesamtanzahl aller Kreditanfragen gespeichert: ${totalLoansRequested}`);

    // Durchschnittlichen Kreditbetrag berechnen
    const averageLoanAmount = loanAmounts.length > 0 
    ? (totalLoanAmount / loanAmounts.length).toFixed(4) 
    : 0;

    console.log(`📊 Durchschnittlicher Kreditbetrag: ${averageLoanAmount} ETH`);
    // Maximale und minimale Kreditanfrage berechnen
    const maxLoanAmount = loanAmounts.length > 0 ? Math.max(...loanAmounts).toFixed(4) : 0;
    const minLoanAmount = loanAmounts.length > 0 ? Math.min(...loanAmounts).toFixed(4) : 0;

    console.log(`📊 Höchste Kreditanfrage: ${maxLoanAmount} ETH`);
    console.log(`📉 Niedrigste Kreditanfrage: ${minLoanAmount} ETH`);

    const borrowerStatsFile = "borrower-stats.json";
    let borrowerStats = {};
    
    // Prüfen, ob die Datei existiert, und bisherige Werte laden
    if (fs.existsSync(borrowerStatsFile)) {
        borrowerStats = JSON.parse(fs.readFileSync(borrowerStatsFile, "utf8"));
    }
    
    // Kreditanzahl für den aktuellen Kreditnehmer erhöhen
    borrowerStats[user.address] = (borrowerStats[user.address] || 0) + 1;
    
    // Speichert die aktualisierten Werte in der Datei
    fs.writeFileSync(borrowerStatsFile, JSON.stringify(borrowerStats, null, 2));
    
    console.log(`📊 ${user.address} hat nun insgesamt ${borrowerStats[user.address]} Kredite beantragt.`);
    // Anzahl der einzigartigen Kreditnehmer berechnen
    const uniqueBorrowers = Object.keys(borrowerStats).length;

    console.log(`📊 Anzahl der einzigartigen Kreditnehmer: ${uniqueBorrowers}`);
    // Meistgenutzte Kreditnehmer-Adresse finden
    let mostActiveBorrower = Object.keys(borrowerStats).reduce((a, b) => borrowerStats[a] > borrowerStats[b] ? a : b, "");

    console.log(`🏆 Aktivster Kreditnehmer: ${mostActiveBorrower} mit ${borrowerStats[mostActiveBorrower]} Krediten`);
    // Speichert die aktivste Kreditnehmer-Adresse in einer Datei
    fs.writeFileSync("most-active-borrower.txt", mostActiveBorrower);

    console.log(`💾 Aktivster Kreditnehmer gespeichert: ${mostActiveBorrower}`);

    // Ersten Kreditnehmer ermitteln (erste Adresse in borrowerStats)
    const firstBorrower = Object.keys(borrowerStats).length > 0 ? Object.keys(borrowerStats)[0] : "Keine Anfragen bisher";
    // Letzten Kreditnehmer ermitteln (letzte Adresse in borrowerStats)
    const borrowerAddresses = Object.keys(borrowerStats);
    const lastBorrower = borrowerAddresses.length > 0 ? borrowerAddresses[borrowerAddresses.length - 1] : "Keine Anfragen bisher";

    console.log(`🔚 Letzter Kreditnehmer: ${lastBorrower}`);
    // Gesamtanzahl aller Kreditanfragen berechnen
    const totalLoansRequested = Object.values(borrowerStats).reduce((sum, count) => sum + count, 0);

    console.log(`📈 Gesamtzahl aller Kreditanfragen: ${totalLoansRequested}`);


    console.log(`🎖️ Erster Kreditnehmer: ${firstBorrower}`);

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
    // Speichert die gesamte Kreditsumme in einer Datei
    s.writeFileSync("total-loan-amount.txt", totalLoanAmount.toString());

    console.log(`💾 Gesamtsumme aller Kredite gespeichert: ${totalLoanAmount} ETH`);
    // Speichert den durchschnittlichen Kreditbetrag in einer Datei
    fs.writeFileSync("average-loan-amount.txt", averageLoanAmount.toString());

    console.log(`💾 Durchschnittlicher Kreditbetrag gespeichert: ${averageLoanAmount} ETH`);

    // 💰 Rückzahlungstest hinzufügen
    const rueckzahlung = await mikrokredit.zurueckzahlen(0, { value: hre.ethers.parseEther("1.05") });
    await rueckzahlung.wait();
    console.log("✅ Kredit erfolgreich zurückgezahlt!");
    const fs = require("fs");
    const repaymentCountFile = "total-repayment-count.txt";
    let totalRepaymentCount = 0;
    
    const latestRepaymentFile = "latest-repayment.txt";
    const latestRepaymentAmount = hre.ethers.formatEther("1.05"); // Beispielwert für eine Rückzahlung

    // Speichert die letzte Rückzahlungssumme in einer Datei
    fs.writeFileSync(latestRepaymentFile, latestRepaymentAmount.toString());

    console.log(`💾 Letzte Rückzahlungssumme gespeichert: ${latestRepaymentAmount} ETH`);

    const maxRepaymentFile = "max-repayment.txt";
    const minRepaymentFile = "min-repayment.txt";
    let maxRepayment = 0;
    let minRepayment = Number.MAX_VALUE;
    const loanRepaymentStatsFile = "loan-repayment-stats.txt";

    // Prüfen, ob die Dateien existieren und Werte laden
    const totalLoans = fs.existsSync("total-loans.txt") ? parseInt(fs.readFileSync("total-loans.txt", "utf8")) || 0 : 0;
    const totalRepayments = fs.existsSync("total-repayment-count.txt") ? parseInt(fs.readFileSync("total-repayment-count.txt", "utf8")) || 0 : 0;

    // Speichert die Gesamtanzahl der Kredite und Rückzahlungen in einer Datei
    fs.writeFileSync(loanRepaymentStatsFile, `Kreditanfragen: ${totalLoans}\nRückzahlungen: ${totalRepayments}`);

    console.log(`💾 Kreditanfragen und Rückzahlungen gespeichert: Kredite: ${totalLoans}, Rückzahlungen: ${totalRepayments}`);

    // Prüfen, ob die Dateien existieren und bisherige Werte laden
    if (fs.existsSync(maxRepaymentFile)) {
        maxRepayment = parseFloat(fs.readFileSync(maxRepaymentFile, "utf8")) || 0;
    }
    if (fs.existsSync(minRepaymentFile)) {
        minRepayment = parseFloat(fs.readFileSync(minRepaymentFile, "utf8")) || Number.MAX_VALUE;
    }
    
    // Neuen Rückzahlungsbetrag prüfen und speichern
    const repaymentAmount = parseFloat(latestRepaymentAmount);
    if (repaymentAmount > maxRepayment) {
        fs.writeFileSync(maxRepaymentFile, repaymentAmount.toString());
        console.log(`💾 Höchste Rückzahlung gespeichert: ${repaymentAmount} ETH`);
    }
    if (repaymentAmount < minRepayment) {
        fs.writeFileSync(minRepaymentFile, repaymentAmount.toString());
        console.log(`💾 Niedrigste Rückzahlung gespeichert: ${repaymentAmount} ETH`);
    }
    
    // Prüfen, ob die Datei existiert und bisherige Werte laden
    if (fs.existsSync(repaymentCountFile)) {
        totalRepaymentCount = parseInt(fs.readFileSync(repaymentCountFile, "utf8")) || 0;
    }
    
    // Erhöhe den Zähler für die neue Rückzahlung
    totalRepaymentCount++;
    
    // Speichert die gesamte Anzahl an Rückzahlungen in einer Datei
    fs.writeFileSync(repaymentCountFile, totalRepaymentCount.toString());
    
    console.log(`💾 Anzahl der Rückzahlungen gespeichert: ${totalRepaymentCount}`);
    
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
    // Speichert die höchste Kreditanfrage in einer Datei
    fs.writeFileSync("max-loan-amount.txt", maxLoanAmount.toString());
    console.log(`💾 Höchste Kreditanfrage gespeichert: ${maxLoanAmount} ETH`);

    // Speichert die niedrigste Kreditanfrage in einer Datei
    fs.writeFileSync("min-loan-amount.txt", minLoanAmount.toString());
    console.log(`💾 Niedrigste Kreditanfrage gespeichert: ${minLoanAmount} ETH`);
    // Speichert die Anzahl der einzigartigen Kreditnehmer in einer Datei
    fs.writeFileSync("unique-borrowers.txt", uniqueBorrowers.toString());

    console.log(`💾 Anzahl einzigartiger Kreditnehmer gespeichert: ${uniqueBorrowers}`);
    // Speichert die letzte Kreditanfrage-ID in einer Datei
    fs.writeFileSync("latest-loan-id.txt", latestLoanId.toString());

    console.log(`💾 Letzte Kreditanfrage-ID gespeichert: ${latestLoanId}`);

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
    // Speichert die letzte Smart Contract-Adresse in einer Datei
    fs.writeFileSync("latest-contract-address.txt", mikrokredit.address);

    console.log(`💾 Letzte Smart Contract-Adresse gespeichert: ${mikrokredit.address}`);



}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

