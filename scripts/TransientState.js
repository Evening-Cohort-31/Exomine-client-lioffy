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
    // Update UI feedback (clear cart + show success message)
    const purchaseItemsContainer = document.querySelector(".purchase__items");

    if (!purchaseItemsContainer) return;

    // Clear cart of previous item(s) from container above the purchase button
    purchaseItemsContainer.innerHTML = "";

    // Create success message element
    const successMessage = document.createElement("p");
    // Add class and text content to newly created <p> element
    successMessage.classList.add("purchase__success");
    successMessage.textContent = "✅ Purchase successful!";

    // Inject message into container as the last child element of the container
    purchaseItemsContainer.appendChild(successMessage);

    // Remove message after 3 seconds
    setTimeout(() => {
        // add fade-out class to trigger CSS transition for the message
        successMessage.classList.add("fade-out");
        // remove message from DOM after fade-out transition completes (0.5s)
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
    // variable to access the selected colony object which will be updated and PUT to API after purchase
    const selectedColony = colonies.find(c => c.id === colonyId);
    if (!selectedColony) {
        console.error("Colony not found");
        return;
    }

    // Identify the selected facility
    // variable to access the selected facility object which will be updated and PUT to API after purchase
    const selectedFacility = facilities.find(f => f.id === facilityId);
    if (!selectedFacility) {
        console.error("Facility not found");
        return;
    }

    // mineral name from transient state
    const selectedMineralName = mineralName;
    // variable to access the colony's inventory and check if mineral exists
    let colonyMineral = selectedColony.inventory.find(m => m.mineral === selectedMineralName);

    if (colonyMineral) {
        // Increment quantity key value in the colony's inventory if mineral exists already
        colonyMineral.quantity += 1;
    } else {
        // Add new mineral entry to the colony's inventory
        selectedColony.inventory.push({ mineral: selectedMineralName, quantity: 1 });
    }

    // variable to access the facility's inventory and check if mineral exists
    const facilityMineral = selectedFacility.inventory.find(m => m.mineral === selectedMineralName);

    if (facilityMineral && facilityMineral.quantity > 0) {
        // Decrement quantity key value in the facility's inventory
        facilityMineral.quantity -= 1;
    } else {
        // alert user if mineral is out of stock
        window.alert("This mineral is out of stock at the selected facility!");
        return;
    }

    // Persist changes to API (PUT both colony and facility)
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

    // Create new purchase record in API
    const newPurchase = {
        governorId: state.governorId,
        colonyId: selectedColony.id,
        facilityId: selectedFacility.id,
        mineralName: selectedMineralName,
        quantity: 1
    };

    // POST new purchase to the database
    await fetch("http://localhost:8088/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPurchase)
    });

    // Dynamically update affected sections of the UI on the webpage
    // Re-render facility minerals and colony minerals
    await updateFacilityMinerals(state.facilityId);
    await updateColonyMinerals(state.governorId);

    // Invoke function to show success message
    showPurchaseSuccessMessage();
};