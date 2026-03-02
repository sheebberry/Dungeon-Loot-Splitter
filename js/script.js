// Dungeon Loot Splitter - script.js

// array to store loot items - declared at top so it persists across button clicks
var lootItems = [];

// Event listeners registered in script.js
document.getElementById("addLootBtn").addEventListener("click", addLoot);
document.getElementById("splitLootBtn").addEventListener("click", splitLoot);

// adding loot items in the array
function addLoot() {

    // clearing old errors
    document.getElementById("lootError").textContent = "";

    // understanding input value
    var name = document.getElementById("lootName").value.trim();
    var valueInput = document.getElementById("lootValue").value.trim();
    var value = parseFloat(valueInput);

    // validating loot input
    if (name === "") {
        document.getElementById("lootError").textContent = "Please enter a loot name.";
        return;
    }

    // validating number input
    if (valueInput === "" || isNaN(value)) {
        document.getElementById("lootError").textContent = "Please enter a valid loot value.";
        return;
    }

    // validating number is a positive
    if (value < 0) {
        document.getElementById("lootError").textContent = "Loot value cannot be negative.";
        return;
    }

    // storing the loots name and value
    var lootObject = {
        name: name,
        value: value
    };

    lootItems.push(lootObject);

    // clearing the field for loot
    document.getElementById("lootName").value = "";
    document.getElementById("lootValue").value = "";

    renderLoot();
}

// updating loot list and total
function renderLoot() {

    var list = document.getElementById("lootList");
    var runningTotal = document.getElementById("runningTotal");

    // clearing list
    list.innerHTML = "";

    // if no items, show empty msg
    if (lootItems.length === 0) {
        var emptyItem = document.createElement("li");
        emptyItem.className = "empty-msg";
        emptyItem.textContent = "No loot added yet.";
        list.appendChild(emptyItem);
        runningTotal.textContent = "$0.00";
        return;
    }

    // looping each item and total
    var total = 0;

    for (var i = 0; i < lootItems.length; i++) {
        var li = document.createElement("li");

        var nameSpan = document.createElement("span");
        nameSpan.className = "item-name";
        nameSpan.textContent = lootItems[i].name;

        var valueSpan = document.createElement("span");
        valueSpan.className = "item-value";
        valueSpan.textContent = "$" + lootItems[i].value.toFixed(2);

        li.appendChild(nameSpan);
        li.appendChild(valueSpan);
        list.appendChild(li);

        total += lootItems[i].value;
    }

    runningTotal.textContent = "$" + total.toFixed(2);
}

// spliting the loot evenly
function splitLoot() {

    // clearing any errors
    document.getElementById("splitError").textContent = "";
    document.getElementById("partySizeError").textContent = "";
    document.getElementById("splitTotal").textContent = "--";
    document.getElementById("splitPerMember").textContent = "--";

    // checking if loot is there to split
    if (lootItems.length === 0) {
        document.getElementById("splitError").textContent = "No loot to split! Add some items first.";
        return;
    }

    // checking party size
    var partySizeInput = document.getElementById("partySize").value.trim();
    var partySize = parseInt(partySizeInput);

    if (partySizeInput === "" || isNaN(partySize)) {
        document.getElementById("partySizeError").textContent = "Please enter a valid number of party members.";
        return;
    }

    if (partySize < 1) {
        document.getElementById("partySizeError").textContent = "Party size must be at least 1.";
        return;
    }

    // looping to calc the grand total
    var grandTotal = 0;

    for (var i = 0; i < lootItems.length; i++) {
        grandTotal += lootItems[i].value;
    }

    // calc each persons share
    var perMember = grandTotal / partySize;

    // display the results
    document.getElementById("splitTotal").textContent = "$" + grandTotal.toFixed(2);
    document.getElementById("splitPerMember").textContent = "$" + perMember.toFixed(2);
}