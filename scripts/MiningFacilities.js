// import setter function from TransientState.js
import { setFacility } from "./TransientState.js"


// Make function handleFacilityChoice function
const handleFacilityChoice = async (event) => {
    if (event.target.id === "facilities-dropdown") {
        const facilityId = parseInt(event.target.value)
        setFacility(facilityId)
    }
};

// Make function FacilityChoice async function 
export const FacilityChoice = async () => {
    const response = await fetch("http://localhost:8088/facilities");
    const facilities = await response.json();

    document.addEventListener("change", handleFacilityChoice);

    let html = `<h2>Facilities</h2>
                    <select required name="facility" id="facilities-dropdown">
                        <option value="0" disabled selected> Select One </option>
                    `;

    const facilitiesHTML = facilities.map((facility) => {
        return `
                <option value="${facility.id}"> 
                    ${facility.name} </option>
            `
    });

    html += facilitiesHTML.join("");
    html += `</select>`;

    return html;
};

// This function will do an API call to fetch facilities data

// Function maps/loops facilities data array to create the dropdown list HTML for the facilities and populates the "facility minerals" container 