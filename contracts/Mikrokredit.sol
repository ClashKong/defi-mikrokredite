// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Mikrokredit {
    address public owner;

    struct Kredit {
        address borrower;
        uint256 amount;
        uint256 interest;
        uint256 duration;
        bool repaid;
    }

    Kredit[] public kredite;

    event KreditAnfrage(address indexed borrower, uint256 amount, uint256 interest, uint256 duration);
    event KreditZurueckgezahlt(address indexed borrower, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function anfrageKredit(uint256 _amount, uint256 _interest, uint256 _duration) public {
        kredite.push(Kredit(msg.sender, _amount, _interest, _duration, false));
        emit KreditAnfrage(msg.sender, _amount, _interest, _duration);
    }

    function zurueckzahlen(uint256 _kreditId) public payable {
        require(_kreditId < kredite.length, "Kredit existiert nicht");
        Kredit storage kredit = kredite[_kreditId];

        require(kredit.borrower == msg.sender, "Nicht dein Kredit");
        require(!kredit.repaid, "Schon zurueckgezahlt");
        require(msg.value >= kredit.amount + (kredit.amount * kredit.interest / 100), "Betrag zu gering");

        kredit.repaid = true;
        payable(owner).transfer(msg.value);
        
        emit KreditZurueckgezahlt(msg.sender, msg.value);
    }

    function getKredite() public view returns (Kredit[] memory) {
        return kredite;
    }
    function getKreditAnfragen() public view returns (Kredit[] memory) {
    return kredite;
}
    function getKreditAnzahl() public view returns (uint256) {
    return kredite.length;
}
    function getKreditDetails(uint256 _kreditId) public view returns (address, uint256, uint256, uint256, bool) {
    require(_kreditId < kredite.length, "Kredit existiert nicht");
    
    Kredit memory kredit = kredite[_kreditId];
    return (kredit.borrower, kredit.amount, kredit.interest, kredit.duration, kredit.repaid);
}

}

