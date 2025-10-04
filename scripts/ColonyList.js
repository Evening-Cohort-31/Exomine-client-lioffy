// import setter function from TransientState.js
import { getState } from "./TransientState.js";

// Get choice of governor from TransientState and see if governors.colonyId === colony.id

export const MineralSelection = async () => {
    const currentState = getState();

    const response = await fetch("http://localhost:8088/governors?_expand=colony")
    const whateverYouWantToCallIt = await response.json();

    const currentGovernorId = currentState.governorId;

    let currentGovernorColony = ""

    currentGovernorColony = whateverYouWantToCallIt.find(object => object.id === currentGovernorId);

    const colonyInventory = currentGovernorColony.colony.inventory;

    let injectedHTML = `<ul>`;

    const container = document.getElementById("colony-minerals");
    const header = document.querySelector(".colony__header");

    if (colonyInventory.length > 0) {
        injectedHTML += colonyInventory.map((mineral) => `<li>${mineral.quantity} tons of ${mineral.mineral}</li>`).join("")
    }

    injectedHTML += `</ul>`;

    const colonyName = currentGovernorColony.colony.name;

    header.innerHTML = `${colonyName} Minerals`;
    container.innerHTML = injectedHTML;
}

// API call to fetch Colony data and create the "Colony Minerals" container that displays the minerals in each colony based on the governor selected
