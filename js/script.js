// Dungeon Loot Splitter - script.js

// array to store loot items - declared at top so it persists across button clicks
var lootItems = [];

// Event listeners registered in script.js
document.getElementById("addLootBtn").addEventListener("click", addLoot);
document.getElementById("splitLootBtn").addEventListener("click", splitLoot);
document.getElementById("partySize").addEventListener("input", updateUI);

// adding loot items in the array
function addLoot() {

    // clearing old errors
    document.getElementById("lootError").textContent = "";

    // understanding input value
    var name = document.getElementById("lootName").value.trim();
    var valueInput = document.getElementById("lootValue").value.trim();
    var value = parseFloat(valueInput);
    var quantityInput = document.getElementById("lootQuantity").value.trim();
    var quantity = parseInt(quantityInput);

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

    // validating quantity
    if (quantityInput === "" || isNaN(quantity) || quantity < 1) {
        document.getElementById("lootError").textContent = "Quantity must be 1 or greater.";
        return;
    }

    // storing the loots name, value, and quantity
    var lootObject = {
        name: name,
        value: value,
        quantity: quantity
    };

    lootItems.push(lootObject);

    // clearing the fields
    document.getElementById("lootName").value = "";
    document.getElementById("lootValue").value = "";
    document.getElementById("lootQuantity").value = "";

    // state changed - update the interface
    updateUI();
}

// removing a loot item by index
function removeLoot(index) {

    // remove item from array
    lootItems.splice(index, 1);

    // state changed - update the interface
    updateUI();
}

// single function that handles all rendering and calculations
function updateUI() {

    // --- calculate total loot ---
    var grandTotal = 0;

    for (var i = 0; i < lootItems.length; i++) {
        grandTotal += lootItems[i].value * lootItems[i].quantity;
    }

    // update the running total display
    document.getElementById("totalLoot").textContent = "$" + grandTotal.toFixed(2);

    // --- render the loot list ---
    var lootRows = document.getElementById("lootRows");
    var noLootMessage = document.getElementById("noLootMessage");
    var lootTable = document.getElementById("lootTable");

    lootRows.innerHTML = "";

    if (lootItems.length === 0) {
        // show empty message, hide table
        noLootMessage.className = "";
        lootTable.className = "loot-table hidden";
    } else {
        // hide empty message, show table
        noLootMessage.className = "hidden";
        lootTable.className = "loot-table";

        for (var i = 0; i < lootItems.length; i++) {

            var row = document.createElement("div");
            row.className = "loot-row";

            var nameCell = document.createElement("div");
            nameCell.className = "loot-cell";
            nameCell.textContent = lootItems[i].name;

            var valueCell = document.createElement("div");
            valueCell.className = "loot-cell";
            valueCell.textContent = "$" + lootItems[i].value.toFixed(2);

            var quantityCell = document.createElement("div");
            quantityCell.className = "loot-cell";
            quantityCell.textContent = lootItems[i].quantity;

            var actionCell = document.createElement("div");
            actionCell.className = "loot-cell";

            var removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "remove-btn";
            removeBtn.addEventListener("click", function(index) {
                return function() {
                    removeLoot(index);
                };
            }(i));

            actionCell.appendChild(removeBtn);

            row.appendChild(nameCell);
            row.appendChild(valueCell);
            row.appendChild(quantityCell);
            row.appendChild(actionCell);

            lootRows.appendChild(row);
        }
    }

    // --- check if party size is valid ---
    var partySizeInput = document.getElementById("partySize").value.trim();
    var partySize = parseInt(partySizeInput);
    var partyValid = partySizeInput !== "" && !isNaN(partySize) && partySize >= 1;

    document.getElementById("partySizeError").textContent = "";

    if (partySizeInput !== "" && !partyValid) {
        document.getElementById("partySizeError").textContent = "Party size must be at least 1.";
    }

    // --- enable or disable the split button ---
    var splitBtn = document.getElementById("splitLootBtn");

    if (lootItems.length > 0 && partyValid) {
        splitBtn.disabled = false;
    } else {
        splitBtn.disabled = true;
    }

    // --- show or hide results ---
    var resultsArea = document.getElementById("resultsArea");

    if (lootItems.length > 0 && partyValid) {
        var perMember = grandTotal / partySize;
        document.getElementById("splitTotal").textContent = "$" + grandTotal.toFixed(2);
        document.getElementById("splitPerMember").textContent = "$" + perMember.toFixed(2);
        resultsArea.className = "results-area";
    } else {
        document.getElementById("splitTotal").textContent = "--";
        document.getElementById("splitPerMember").textContent = "--";
        resultsArea.className = "results-area hidden";
    }
}

// split button calls updateUI - no calculation logic lives here
function splitLoot() {
    updateUI();
}