// import setter function from TransientState.js
import { setFacility } from "./TransientState.js";

// Make function handleFacilityChoice function
const handleFacilityChoice = async (event) => {
    if (event.target.id === "facilities-dropdown") {
        const facilityId = parseInt(event.target.value)
        setFacility(facilityId)
        console.log(facilityId)

        // Display minerals available at the selected facility
        const facilityMineralsContainer = document.getElementById("facility-minerals");
        facilityMineralsContainer.innerHTML = "<p>Loading minerals...</p>";

        // Fetch and display minerals for the selected facility
        const mineralsHTML = await MineralsChoice(facilityId);
        facilityMineralsContainer.innerHTML = mineralsHTML;
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

export const handleMineralChoice = (event) => {
    // Check that a mineral radio was clicked
    if (event.target.classList.contains("facilityMineral")) {
        const selectedMineral = event.target.value;
        // Get the container where selected minerals will be displayed right above the purchase button
        const purchaseItemsContainer = document.querySelector(".purchase__items");

        // Log selection (for debugging)
        console.log(`Selected mineral: ${selectedMineral}`);

        // Replace existing content with the new selection
        purchaseItemsContainer.innerHTML = `
      <div class="purchase__item active">
        <span class="purchase__item-name">${selectedMineral}</span>
        <span class="purchase__item-qty">1 ton</span>
      </div>
    `;

        // Add a subtle visual pulse for user feedback
        purchaseItemsContainer.classList.add("active");
        // Remove the pulse effect after a short delay
        setTimeout(() => purchaseItemsContainer.classList.remove("active"), 400);
    }
};


// Function to create the "Facility Minerals" container that displays the minerals available at the selected facility
export const MineralsChoice = async (facilityId) => {
    // Fetch facilities to get the selected facility's inventory
    const response = await fetch("http://localhost:8088/facilities");
    const facilities = await response.json();

    // Find the selected facility among the fetched facilities
    const selectedFacility = facilities.find(facility => facility.id === facilityId);

    // If no facility is found or if the facility is inactive, return a message
    if (!selectedFacility || selectedFacility.status !== "active") {
        return "<p class='error'>No active facility selected or facility not found.</p>";
    }

    // Update the header to reflect the selected facility's name
    const containerHeader = document.querySelector(".facility__minerals .facility__header");
    if (containerHeader) {
        containerHeader.textContent = `Minerals at ${selectedFacility.name}`;
    }

    document.addEventListener("change", handleMineralChoice);

    // start building the HTML for the minerals list
    let html = ``;

    // Create radio buttons for each mineral in the selected facility's inventory
    const mineralOptionsHTML = selectedFacility.inventory
        // Only show minerals with quantity greater than 0
        .filter(inventoryMineral => inventoryMineral.quantity > 0)
        // Transform minerals array into HTML radio button options
        .map(inventoryMineral => `
      <label class="facility__mineral-option">
        <input
          type="radio"
          class="facilityMineral"
          name="minerals"
          data-facility-id="${selectedFacility.id}"
          value="${inventoryMineral.mineral}"
        />
        <span>${inventoryMineral.quantity} tons of ${inventoryMineral.mineral}</span>
      </label>
    `)
        // Join the array of HTML strings into a single string
        .join("");

    // Wrap the mineral options in a fieldset for better accessibility
    html += `
    <fieldset class="facility__group">
      <legend class="visually-hidden">${selectedFacility.name}</legend>
      ${mineralOptionsHTML || "<p>No minerals available at this facility.</p>"}
    </fieldset>
  `;

    return html;
};