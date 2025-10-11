import { MineralsChoice } from "./MiningFacilities.js";
import { MineralSelection } from "./ColonyList.js";

const state = {
    governorId: 0,
    colonyId: 0,
    facilityId: 0,
    mineralName: "",
}

// make setGovernor function

export const setGovernor = (chosenGovernor, chosenGovernorColony) => {
    state.governorId = chosenGovernor
}

export const setFacility = (chosenFacility) => {
    state.facilityId = chosenFacility
}

export const setColony = (chosenColony) => {
    state.colonyId = chosenColony
}

export const setMineral = (chosenMineral) => {
    state.mineralName = chosenMineral
}

//clone of transient state
export const getState = () => {
    return { ...state }
}

const resetState = () => {
    state.governorId = 0
    state.colonyId = 0
    state.facilityId = 0
    state.mineralName = ""
}

//Re-renders the facility mineral radio buttons after purchase
export const updateFacilityMinerals = async (facilityId) => {
    const facilityMineralsContainer = document.getElementById("facility-minerals");
    if (!facilityMineralsContainer) return;

    const updatedHTML = await MineralsChoice(facilityId);
    facilityMineralsContainer.innerHTML = updatedHTML;
};

//Re-renders the colony mineral list after purchase
export const updateColonyMinerals = async (governorId) => {
    const colonyMineralsContainer = document.getElementById("colony-minerals");
    if (!colonyMineralsContainer) return;

    // Update transient state (if you store governorId globally, this might already be correct)
    const currentState = getState();
    currentState.governorId = governorId;

    // Re-run the MineralSelection() to rebuild the colony inventory HTML
    await MineralSelection();
};

//Clears purchase__items and shows success message
export const showPurchaseSuccessMessage = () => {
    const purchaseItemsContainer = document.querySelector(".purchase__items");
    if (!purchaseItemsContainer) return;

    purchaseItemsContainer.innerHTML = ""; // clear cart
    const successMessage = document.createElement("p");
    successMessage.classList.add("purchase__success");
    successMessage.textContent = "✅ Purchase successful!";

    purchaseItemsContainer.appendChild(successMessage);

    setTimeout(() => {
        successMessage.classList.add("fade-out");
        setTimeout(() => (purchaseItemsContainer.innerHTML = ""), 500);
    }, 2500);
};

export const purchaseMineral = async () => {
    // Destructure transient state for easier access
    const { governorId, facilityId, mineralName } = state;

    // Guard clause: ensure all required selections exist
    if (!governorId || !facilityId || !mineralName) {
        window.alert("Please select a governor, facility, and mineral before purchasing.");
        return;
    }

    // Fetch data
    const [governors, colonies, facilities] = await Promise.all([
        fetch("http://localhost:8088/governors").then(res => res.json()),
        fetch("http://localhost:8088/colonies").then(res => res.json()),
        fetch("http://localhost:8088/facilities").then(res => res.json())
    ]);

    // Identify the active governor 
    const selectedGovernor = governors.find(g => g.id === governorId);
    if (!selectedGovernor) {
        console.error("Governor not found in API data");
        return;
    }

    // Identify the selected colony based on governor's colonyId
    const colonyId = selectedGovernor.colonyId;
    const selectedColony = colonies.find(c => c.id === colonyId);
    if (!selectedColony) {
        console.error("Colony not found");
        return;
    }

    // Identify the selected facility
    const selectedFacility = facilities.find(f => f.id === facilityId);
    if (!selectedFacility) {
        console.error("Facility not found");
        return;
    }

    // Update the colony inventory
    const selectedMineralName = mineralName; // assuming you store the mineral name directly
    let colonyMineral = selectedColony.inventory.find(m => m.mineral === selectedMineralName);

    if (colonyMineral) {
        // Increment quantity
        colonyMineral.quantity += 1;
    } else {
        // Add new mineral entry
        selectedColony.inventory.push({ mineral: mineralName, quantity: 1 });
    }

    // Update the facility inventory (decrement by 1)
    const facilityMineral = selectedFacility.inventory.find(m => m.mineral === mineralName);
    if (facilityMineral && facilityMineral.quantity > 0) {
        facilityMineral.quantity -= 1;
    } else {
        window.alert("This mineral is out of stock at the selected facility!");
        return;
    }

    // 6️⃣ Persist changes to API (PUT both colony and facility)
    await fetch(`http://localhost:8088/colonies/${selectedColony.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedColony)
    });

    await fetch(`http://localhost:8088/facilities/${selectedFacility.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedFacility)
    });

    const newPurchase = {
        governorId: state.governorId,
        colonyId: selectedColony.id,
        facilityId: selectedFacility.id,
        mineralName: mineralName,
        quantity: 1
    };

    await fetch("http://localhost:8088/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPurchase)
    });

    // 7️⃣ Dynamically update affected sections
    await updateFacilityMinerals(state.facilityId);
    await updateColonyMinerals(state.governorId);

    // 8️⃣ Show success message
    showPurchaseSuccessMessage();

    // Update UI feedback (clear cart + show success message)
    const purchaseItemsContainer = document.querySelector(".purchase__items");

    // Clear previous item(s)
    purchaseItemsContainer.innerHTML = "";

    // Create success message element
    const successMessage = document.createElement("p");
    successMessage.classList.add("purchase__success");
    successMessage.textContent = "✅ Purchase successful!";

    // Inject message into container
    purchaseItemsContainer.appendChild(successMessage);

    // Remove message after 3 seconds
    setTimeout(() => {
        successMessage.classList.add("fade-out");
        setTimeout(() => (purchaseItemsContainer.innerHTML = ""), 500);
    }, 2500);
};