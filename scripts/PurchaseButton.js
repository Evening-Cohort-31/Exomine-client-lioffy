// import selection submission from TransientState.js
import { purchaseMineral } from "./TransientState.js";

// Click event listener for purchase button
export const handlePurchaseChoices = (clickEvent) => {
    const clickedButton = clickEvent.target;

    if (clickedButton.id === "purchase-button") {
        purchaseMineral();
    }
};

export const PurchaseButton = () => {
    return `<button id="purchase-button" type="button">Purchase Mineral</button>`;
}