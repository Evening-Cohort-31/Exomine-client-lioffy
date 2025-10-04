const state = {
    governorId: 0,
    colonyId: 0,
    facilityId: 0,
    mineralId: 0,
    quantity: 0
}

// make setGovernor function

export const setGovernor = (chosenGovernor) => {
    state.governorId = chosenGovernor
}

export const setFacility = (chosenFacility) => {
    state.facilityId = chosenFacility
}

export const setColony = (chosenColony) => {
    state.colonyId = chosenColony
}




// export const setFacility = (facilityId) => {
//     state.selectedFacility = facilityId
//     document.dispatchEvent(new CustomEvent("stateChanged"))
// }

export const purchaseMineral = () => {
    /*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?

        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.

        Only the foolhardy try to solve this problem with code.
    */



    // if ()


    document.dispatchEvent(new CustomEvent("stateChanged"))
}
