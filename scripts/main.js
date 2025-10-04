// import function for HTML code for governor's list dropdown
import { GovernorChoice } from "./GovernorsList.js";
// import function for HTML code for colonies inventory list dropdown
//import { ColonyChoice } from "./ColonyList.js"
// import function for HTML code for facilities dropdown
import { FacilityChoice } from "./MiningFacilities.js"
// import function for HTML code for minerals available at each facility
//import { MineralSelection } from "./ColonyList.js"
//import function for HTML code for purchase button
//import { PurchaseButton } from "./PurchaseButton.js"

// target #container with querySelector
const container = document.getElementById("container");

// make render async function that will inject/update all the HTML into the DOM and attaches event listeners
const render = async () => {
    const governorHTML = await GovernorChoice();
    const facilityHTML = await FacilityChoice();
    //const colonyHTML = await ColonyChoice();
    //const purchaseButtonHTML = PurchaseButton();

    const composedHTML = `
        <article class="choices">
                <section class="governor__choices">
                    ${governorHTML} 
                </section>

                <section class="facility__choices">
                    ${facilityHTML}
                </section>

                <section>
                    <h2 class="mineral__header">Colony Minerals</h2>
                   <div class="mineral__display"><!-- injected code will appear here --></div>
                </section>

                  <section class="facility__minerals">
                    <h2 class="facility__header">Facility Minerals</h2>
                    <!-- TBD -->
                </section>

                  <section class="purchase__button">
                    <h2>Space Cart</h2>
                    <!-- TBD -->
                </section>
            </article>
    `

    container.innerHTML = composedHTML
}

document.addEventListener("stateChanged", event => {
    console.log("State of data has changed. Regenerating HTML ....")
    render()
})

render()
