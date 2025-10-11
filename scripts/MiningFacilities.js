// import setter function from TransientState.js
import { setFacility } from "./TransientState.js"
import { getState } from "./TransientState.js"

// Make function handleFacilityChoice function
const handleFacilityChoice = async (event) => {
    debugger
    if (event.target.id === "facilities-dropdown") {
        const facilityId = parseInt(event.target.value)
        setFacility(facilityId)
        console.log(facilityId)

        const defaultDropdown = document.getElementById("facilities-dropdown");

        console.log(defaultDropdown.options[defaultDropdown.selectedIndex].value)

        if (parseInt(defaultDropdown.options[defaultDropdown.selectedIndex].value) === facilityId) {
            MineralSelectionListForSelectedFacility(facilityId);
        }
    }

};

// Make function FacilityChoice async function 
export const FacilityChoice = async () => {
    const response = await fetch("http://localhost:8088/facilities");
    const facilities = await response.json();

    document.addEventListener("change", handleFacilityChoice);

    let html = `<h2>Facilities</h2>
                    <select required name="facility" id="facilities-dropdown" >
                        <option value="0" class="facilities-dropdown-option" disabled selected> Select One </option>
                    `;

    const facilitiesHTML = facilities.map((facility) => {
        return `
                <option value="${facility.id}" class="facilities-dropdown-option"> 
                    ${facility.name} </option>
            `
    });

    html += facilitiesHTML.join("");
    html += `</select>`;

    return html;
};

// This function will do an API call to fetch facilities data

// Function maps/loops facilities data array to create the dropdown list HTML for the facilities and populates the "facility minerals" container 

export const MineralSelectionListForSelectedFacility = async (facilityId) => {
    // Fetch all facilities
    const response = await fetch("http://localhost:8088/facilities");
    const facilities = await response.json();

    // Find the selected facility
    const selectedFacility = facilities.find(facility => facility.id === facilityId);

    // If the facility doesn’t exist or is inactive
    if (!selectedFacility || selectedFacility.status !== "active") {
        document.getElementById("facility-minerals").innerHTML =
            "<p class='error'>No active facility selected or facility not found.</p>";
        return;
    }

    // Build HTML for minerals available at this one facility
    const mineralOptions = selectedFacility.inventory
        .map(inventory => {
            if (inventory.quantity <= 0) return ""; // skip depleted minerals
            return `
        <label class="facility__mineral-option">
          <input
            type="radio"
            class="facilityMineral"
            name="minerals"
            data-facility-id="${selectedFacility.id}"
            data-facility-name="${selectedFacility.name}"
            value="${inventory.mineral}"
          />
          ${inventory.quantity} tons of ${inventory.mineral}
        </label>
      `;
        })
        .join("");

    const html = `
    <h2>Minerals for ${selectedFacility.name}</h2>
    <fieldset class="facility__group">
      <legend>${selectedFacility.name}</legend>
      ${mineralOptions || "<p>No minerals available at this facility.</p>"}
    </fieldset>
  `;

    // Inject into container
    const container = document.querySelector(".facility-minerals");
    container.innerHTML = html;
};
