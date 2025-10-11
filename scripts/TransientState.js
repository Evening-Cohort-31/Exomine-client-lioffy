const state = {
    governorId: 0,
    colonyId: 0,
    facilityId: 0,
    mineralId: 0,
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

//clone of transient state
export const getState = () => {
    return { ...state }
}

// export const setFacility = (facilityId) => {
//     state.selectedFacility = facilityId
//     document.dispatchEvent(new CustomEvent("stateChanged"))
// }

export const purchaseMineral = async () => {
    /*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?
export const setMineral = (mineralId) => {
    state.mineralId = mineralId
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.
export const purchaseMineral = async () => {
    // 1. Check if all necessary selections have been made
    if (!state.selectedGovernor || !state.selectedFacility || !state.mineralId) {
        window.alert("Please make a selection for governor, facility, and mineral.");
        return;
    }
        Only the foolhardy try to solve this problem with code.
    */
    // 2. Get all necessary data from the API
    const governors = await (await fetch("http://localhost:8088/governors")).json();

    const colonies = await (await fetch("http://localhost:8088/colonies")).json();

    const facilities = await (await fetch("http://localhost:8088/facilities")).json();

    // 3. Find the colonyId for the selected governor
    const selectedGovernorObject = governors.find(g => g.id === state.governorId);

    const colonyId = selectedGovernorObject.colonyId;

    // 4. Check if the colony already owns this mineral
    const existingColonyMineral = colonies.find(
        // come back to later
        cm => cm.id === colonyId && cm.mineralId === state.mineralId
    );

    console.log(existingColonyMineral)

    document.dispatchEvent(new CustomEvent("stateChanged"))
    // 5. Update colony inventory (PUT or POST)
    if (existingColonyMineral) {
        // If yes, update the quantity with a PUT request
        const updatedColonyMineral = {
            id: existingColonyMineral.id,
            colonyId: existingColonyMineral.colonyId,
            mineralId: existingColonyMineral.mineralId,
            quantity: existingColonyMineral.quantity + 1
        };

        await fetch(`http://localhost:8088/colonies/${existingColonyMineral.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedColonyMineral)
        });

    } else {
        // If no, create a new record with a POST request
        const newColonyMineral = {
            colonyId: colonyId,
            mineralId: state.mineralId,
            quantity: 1
        };

        await fetch("http://localhost:8088/colonies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newColonyMineral)
        });

    }

    // 6. Update facility inventory (decrement by 1)
    const facilityMineralToUpdate = facilities.find(
        //come back to this later
        fm => fm.id === state.facilityId && fm.mineralId === state.mineralId
    );

    // take one away 
    facilityMineralToUpdate.quantity -= 1;

    await fetch(`http://localhost:8088/facilities/${facilityMineralToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facilityMineralToUpdate)
    });

    // 7. Dispatch stateChanged event to re-render the UI
    document.dispatchEvent(new CustomEvent("stateChanged"));
}