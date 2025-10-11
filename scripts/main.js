// import function for HTML code for governor's list dropdown
import { GovernorChoice } from "./GovernorsList.js";
// import function for HTML code for colonies inventory list dropdown
//import { ColonyChoice } from "./ColonyList.js"
// import function for HTML code for facilities dropdown
import { FacilityChoice } from "./MiningFacilities.js"
// import function for handling purchase button click event
import { handlePurchaseChoices } from "./PurchaseButton.js"
//import function for HTML code for purchase button
import { PurchaseButton } from "./PurchaseButton.js"

// target #container with querySelector
const container = document.getElementById("exomine");

// make render async function that will inject/update all the HTML into the DOM and attaches event listeners
const render = async () => {
  const governorHTML = await GovernorChoice();
  const facilityHTML = await FacilityChoice();
  const purchaseButtonHTML = PurchaseButton();

  const composedHTML = `
      
      <!-- Left Control Panel -->
      <aside class="exomine__controls">
        <section class="governor governor__choices">
          <h2 class="governor__title">Select Governor</h2>
          ${governorHTML}
        </section>

        <section class="facility facility__choices">
          <h2 class="facility__title">Select Facility</h2>
          ${facilityHTML}
        </section>
      </aside>

      <!-- Right Colony Info Panel -->
      <section class="exomine__colony">
        <h2 class="colony__header">Colony Minerals</h2>
        <div id="colony-minerals" class="colony__minerals-display"><!-- dynamic content --></div>
      </section>

      <!-- Bottom Panels -->
      <footer class="exomine__footer">
        <section class="facility facility__minerals">
          <h2 class="facility__header">Facility Minerals</h2>
          <div id="facility-minerals" class="facility__minerals-display">
          <!-- dynamic content -->
          </div>
        </section>

        <section class="purchase purchase__cart">
          <h2 class="purchase__header">Space Cart</h2>
          <div class="purchase__items"><!-- dynamic content --></div>
          ${purchaseButtonHTML}
        </section>
      </footer>
  `;

  container.innerHTML = composedHTML;
};

document.addEventListener("click", handlePurchaseChoices);

document.addEventListener("stateChanged", event => {
  console.log("State of data has changed. Regenerating HTML ....")
  render()
})

render()
