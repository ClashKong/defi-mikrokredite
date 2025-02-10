const hre = require("hardhat");

async function main() {
    const Mikrokredit = await hre.ethers.getContractFactory("Mikrokredit");
    const mikrokredit = await Mikrokredit.deploy();

    await mikrokredit.deployed();

    console.log(`Mikrokredit deployed to: ${mikrokredit.address}`);
}

async function main() {
    const Mikrokredit = await hre.ethers.getContractFactory("Mikrokredit");
    const mikrokredit = await Mikrokredit.deploy();

    await mikrokredit.deployed();

    console.log(`✅ Mikrokredit deployed to: ${mikrokredit.address}`);

    // Beispiel-Kreditanfrage direkt nach Deployment
    const tx = await mikrokredit.anfrageKredit(1000, 5, 30);
    await tx.wait();
    const kreditAnzahl = await mikrokredit.getKreditAnzahl();
    console.log(`📊 Aktuelle Anzahl an Kreditanfragen: ${kreditAnzahl}`);
    
    console.log("📌 Erste Kreditanfrage erfolgreich gestellt!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
