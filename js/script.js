// Dungeon Loot Splitter - script.js

// Array to store loot items - declared at top so it persists across button clicks
var lootItems = [];

// Event listeners registered in script.js
document.getElementById("addLootBtn").addEventListener("click", addLoot);
document.getElementById("splitLootBtn").addEventListener("click", splitLoot);

// Add a loot item to the array
function addLoot() {

    // Clear previous error
    document.getElementById("lootError").textContent = "";

    // Read input values
    var name = document.getElementById("lootName").value.trim();
    var valueInput = document.getElementById("lootValue").value.trim();
    var value = parseFloat(valueInput);

    // Validate: name must not be empty
    if (name === "") {
        document.getElementById("lootError").textContent = "Please enter a loot name.";
        return;
    }

    // Validate: value must be a valid number
    if (valueInput === "" || isNaN(value)) {
        document.getElementById("lootError").textContent = "Please enter a valid loot value.";
        return;
    }

    // Validate: value must not be negative
    if (value < 0) {
        document.getElementById("lootError").textContent = "Loot value cannot be negative.";
        return;
    }

    // Store loot as an object with name and value properties
    var lootObject = {
        name: name,
        value: value
    };

    lootItems.push(lootObject);

    // Clear the input fields
    document.getElementById("lootName").value = "";
    document.getElementById("lootValue").value = "";

    renderLoot();
}

// Render the loot list and update the running total
function renderLoot() {

    var list = document.getElementById("lootList");
    var runningTotal = document.getElementById("runningTotal");

    // Clear the current list
    list.innerHTML = "";

    // If no items, show empty message
    if (lootItems.length === 0) {
        var emptyItem = document.createElement("li");
        emptyItem.className = "empty-msg";
        emptyItem.textContent = "No loot added yet.";
        list.appendChild(emptyItem);
        runningTotal.textContent = "$0.00";
        return;
    }

    // Loop to render each item and calculate the running total
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

// Split the total loot evenly among party members
function splitLoot() {

    // Clear previous errors and results
    document.getElementById("splitError").textContent = "";
    document.getElementById("partySizeError").textContent = "";
    document.getElementById("splitTotal").textContent = "--";
    document.getElementById("splitPerMember").textContent = "--";

    // Check that there is loot to split
    if (lootItems.length === 0) {
        document.getElementById("splitError").textContent = "No loot to split! Add some items first.";
        return;
    }

    // Validate party size
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

    // Loop to calculate the grand total
    var grandTotal = 0;

    for (var i = 0; i < lootItems.length; i++) {
        grandTotal += lootItems[i].value;
    }

    // Calculate each member's share
    var perMember = grandTotal / partySize;

    // Display results
    document.getElementById("splitTotal").textContent = "$" + grandTotal.toFixed(2);
    document.getElementById("splitPerMember").textContent = "$" + perMember.toFixed(2);
}