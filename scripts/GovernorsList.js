// import setter function from TransientState.js

 import { setGovernor } from "./TransientState.js"
 
// Make function handleGovernorChoice function

const handleGovernorChoice = async (event) => {
    if (event.target.id === "governors-dropdown") {
        let updatedGovernorOption = parseInt(event.target.value)
        setGovernor(updatedGovernorOption)
        console.log(updatedGovernorOption)
    }
}
// Make function GovernorChoice async function 

export const GovernorChoice = async () => {
    const response = await fetch("http://localhost:8088/governors");
    const governors = await response.json()

    // Add event listener

    document.addEventListener("change", handleGovernorChoice)

    let html = `<h2>Governors</h2>
                    <select required name="governor" id="governors-dropdown">
                        <option value="0" disabled selected> Select One </option>
                    `

    const governorsHTML = governors.map((governor) => {
        return `
                <option 
                    name="governor" 
                    value="${governor.id}" 
                    data-status="${governor.status}"> 
                        ${governor.name} </option>
            `
        ;
    });

    html += governorsHTML.join("")
    html += `</select>`

    return html;
}

// This function will do an API call to fetch both governor data

// Function creates the dropdown list HTML for the governors
 
// The function iterates over the governors array to generate HTML to display name in a dropdown list
