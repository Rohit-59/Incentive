const { ipcRenderer, contextBridge } = require("electron");
const XLSX = require("xlsx");

let MGAranges = [];
let carPairs = [];
let ExchangePairs = [];
let EWInputs = [];
let CCPInputs = [];
let MSSFInputs = [];
let DiscountInputs = [];
let ComplaintInputs = [];

let pairCount = 1;
let specialCarPairCount = 1;




// function MGAcreateInputField(type) {
//     const div = document.createElement('div');
//     div.className = 'range-input';
//     div.dataset.rangeType = type

//     if (type === 'lessThan') {
//         div.innerHTML = `
//           <label>Value:</label>
//           <input type="number" name="lessThanValue" step="any">
//           <label>Percentage Incentive (%):</label>
//           <input type="number" name="lessThanIncentive" step="any">
//       `;
//     } else if (type === 'greaterThan') {
//         div.innerHTML = `
//           <label>Value:</label>
//           <input type="number" name="greaterThanValue" step="any">
//           <label>Percentage Incentive (%):</label>
//           <input type="number" name="greaterThanIncentive" step="any">
//       `;
//     } else if (type === 'between') {
//         div.innerHTML = `
//           <label>From:</label>
//           <input type="number" name="betweenValue1" step="any">
//           <label>To:</label>
//           <input type="number" name="betweenValue2" step="any">
//           <label>Percentage Incentive (%):</label>
//           <input type="number" name="betweenIncentive" step="any">
//       `;
//     }
//     return div;
// }


// function addRange(type, value1, value2, incentive) {
//     if (type === 'lessThan') {
//         MGAranges.push({ type: 'lessThan', value: value1, incentive: incentive });
//     } else if (type === 'greaterThan') {
//         MGAranges.push({ type: 'greaterThan', value: value1, incentive: incentive });
//     } else if (type === 'between') {
//         MGAranges.push({ type: 'between', from: value1, to: value2, incentive: incentive });
//     }
// }


const addEWInputFields = (type, EWinputsContainer) => {
    let inputFields;

    switch(type) {
        case 'greater':
            inputFields = `
                <div class="inputGroup">
                    <label for="percentageGreaterThan">Percentage Greater Than or Equal To:</label>
                    <input type="number" step="0.01" name="percentageGreaterThan" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        case 'less':
            inputFields = `
                <div class="inputGroup">
                    <label for="percentageLessThan">Percentage Less Than or Equal To:</label>
                    <input type="number" step="0.01" name="percentageLessThan" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        case 'range':
            inputFields = `
                <div class="inputGroup">
                    <label for="percentageMin">Percentage Minimum (%):</label>
                    <input type="number" step="0.01" name="percentageMin" required>
                    <label for="percentageMax">Percentage Maximum (%):</label>
                    <input type="number" step="0.01" name="percentageMax" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        default:
            inputFields = '';
            break;
    }

    EWinputsContainer.insertAdjacentHTML('beforeend', inputFields);
};


const addCCPInputFields = (type, CCPinputsContainer) => {
    let inputFields;

    switch(type) {
        case 'greater':
            inputFields = `
                <div class="CCPinputGroup">
                    <label for="percentageGreaterThan">Percentage Greater Than or Equal To:</label>
                    <input type="number" step="0.01" name="percentageGreaterThan" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        case 'less':
            inputFields = `
                <div class="CCPinputGroup">
                    <label for="percentageLessThan">Percentage Less Than or Equal To:</label>
                    <input type="number" step="0.01" name="percentageLessThan" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        case 'range':
            inputFields = `
                <div class="CCPinputGroup">
                    <label for="percentageMin">Percentage Minimum (%):</label>
                    <input type="number" step="0.01" name="percentageMin" required>
                    <label for="percentageMax">Percentage Maximum (%):</label>
                    <input type="number" step="0.01" name="percentageMax" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        default:
            inputFields = '';
            break;
    }

    CCPinputsContainer.insertAdjacentHTML('beforeend', inputFields);
};


const addMSSFInputFields = (type, MSSFinputsContainer) => {
    let inputFields;

    switch(type) {
        case 'greater':
            inputFields = `
                <div class="MSSFinputGroup">
                    <label for="percentageGreaterThan">Percentage Greater Than or Equal To:</label>
                    <input type="number" step="0.01" name="percentageGreaterThan" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        case 'less':
            inputFields = `
                <div class="MSSFinputGroup">
                    <label for="percentageLessThan">Percentage Less Than or Equal To:</label>
                    <input type="number" step="0.01" name="percentageLessThan" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        case 'range':
            inputFields = `
                <div class="MSSFinputGroup">
                    <label for="percentageMin">Percentage Minimum (%):</label>
                    <input type="number" step="0.01" name="percentageMin" required>
                    <label for="percentageMax">Percentage Maximum (%):</label>
                    <input type="number" step="0.01" name="percentageMax" required>
                    <label for="incentive">Incentive (Rs):</label>
                    <input type="number" name="incentive" required>
                </div>
            `;
            break;

        default:
            inputFields = '';
            break;
    }

    MSSFinputsContainer.insertAdjacentHTML('beforeend', inputFields);
};


const addDiscountInputFields = (DinputsContainer) => {
    const inputFields = `
        <div class="DinputGroup">
            <label for="amountMin">Amount Minimum (Rs):</label>
            <input type="number" step="any" name="amountMin" required>
            <label for="amountMax">Amount Maximum (Rs):</label>
            <input type="number" step="any" name="amountMax">
            <label for="incentive">Incentive (%):</label>
            <input type="number" step="any"  name="incentive" required>
        </div>
    `;
    DinputsContainer.insertAdjacentHTML('beforeend', inputFields);
};



const addMGAInputFields = (MGAinputsContainer) => {
    const inputFields = `
        <div class="MGAinputGroup">
            <label for="amountMin">Amount Minimum (Rs):</label>
            <input type="number" step="any"  name="amountMin" required>
            <label for="amountMax">Amount Maximum (Rs):</label>
            <input type="number" step="any"  name="amountMax">
            <label for="incentive">Incentive (%):</label>
            <input type="number" step="any"  name="incentive" required>
        </div>
    `;
    MGAinputsContainer.insertAdjacentHTML('beforeend', inputFields);
};



document.addEventListener("DOMContentLoaded", function () {
    const fileSelectorSalesExcel = document.querySelector("#file-input-salesExcel");
    fileSelectorSalesExcel.addEventListener("change", (e) => {
        const filePath = e.target.files[0].path;
        ipcRenderer.send("file-selected-salesExcel", filePath);
        console.log(filePath);

    });

    const fileSelectorCDIScore = document.querySelector("#file-input-CDIScore");
    fileSelectorCDIScore.addEventListener("change", (e) => {
        const filePath = e.target.files[0].path;
        ipcRenderer.send("file-selected-CDIScore", filePath);
        console.log(filePath);
    });
    const form = document.getElementById('myForm');


    // For CDI Range
    const inputTemplates = {
        greater: `
          <div class="cdiInput">
              <label>CDI Greater Than:</label>
              <input type="number" name="cdiValue" >
              <label>Incentive:</label>
              <input type="number" name="incentive" >
          </div>
      `,
        less: `
          <div class="cdiInput">
              <label>CDI Less Than:</label>
              <input type="number" name="cdiValue" >
              <label>Incentive:</label>
              <input type="number" name="incentive" >
          </div>
      `,
        range: `
          <div class="cdiInput">
              <label>CDI Minimum:</label>
              <input type="number" name="cdiMin" >
              <label>CDI Maximum:</label>
              <input type="number" name="cdiMax" >
              <label>Incentive:</label>
              <input type="number" name="incentive" >
          </div>
      `
    };

    
    const addInputButton = document.getElementById('addInputButton');

    addInputButton.addEventListener('click', () => {
        const inputType = document.getElementById('inputType');
        const selectedType = inputType.value;
        const cdiContainer = document.getElementById('cdiInputs');
        cdiContainer.insertAdjacentHTML('beforeend', inputTemplates[selectedType]);
    });


   // For EW Input
   
   const addEWInputButton = document.getElementById('addEWInputButton');

   addEWInputButton.addEventListener('click',()=>{
   const EWinputType = document.getElementById('EWinputType');
  const selectedType = EWinputType.value;
  const EWContainer = document.getElementById("EWinputsContainer");
  addEWInputFields(selectedType, EWContainer);

   })

   // For MSSF input


   const addMSSFInputButton = document.getElementById('addMSSFInputButton');

   addMSSFInputButton.addEventListener('click',()=>{
   const MSSFinputType = document.getElementById('MSSFinputType');
  const selectedType = MSSFinputType.value;
  const MSSFContainer = document.getElementById("MSSFinputsContainer");
  addMSSFInputFields(selectedType, MSSFContainer);

   })



    // For Car Pair
    const addPairButton = document.getElementById('addPairButton');
    addPairButton.addEventListener('click', () => {

        const pairContainer = document.getElementById('pairs-container');
        const div = document.createElement('div');
        div.className = 'pair-container';

        div.innerHTML = `
        <label for="cars">Number of Cars:</label>
        <input type="number" name="cars">
        <label for="incentive">Incentive:</label>
        <input type="number" name="incentive" step="0.01">
    `;
        pairContainer.insertBefore(div, pairContainer.lastElementChild);

    })



    // Exchange Pair

    const addExchangePairButton = document.getElementById('addExchangePairButton');
    addExchangePairButton.addEventListener('click', () => {

        const pairContainer = document.getElementById('Exchange-pairs-container');
        const div = document.createElement('div');
        div.className = 'Exchange-pair-container';

        div.innerHTML = `
        <label for="exchange">Exchange No:</label>
        <input type="number" name="exchange">
        <label for="incentive">Incentive:</label>
        <input type="number" name="incentive" step="0.01">
    `;
        pairContainer.insertBefore(div, pairContainer.lastElementChild);

    })



    // Complaint Pair


    const addComplaintPairButton = document.getElementById('addComplaintPairButton');
    addComplaintPairButton.addEventListener('click', () => {

        const pairContainer = document.getElementById('Complaint-pairs-container');
        const div = document.createElement('div');
        div.className = 'Complaint-pair-container';

        div.innerHTML = `
        <label for="complaint">Complaint No:</label>
        <input type="number" name="complaint">
        <label for="incentive">Incentive:</label>
        <input type="number" name="incentive" step="0.01">
    `;
        pairContainer.insertBefore(div, pairContainer.lastElementChild);

    })


    // For MGA incentive
    // const addMGAInput = document.getElementById('addMGAInput');
    // addMGAInput.addEventListener('click', () => {

    //     const rangeType = document.getElementById('rangeType').value;
    //     const MGAinputsContainer = document.getElementById('MGAinputsContainer');
    //     const newInputField = MGAcreateInputField(rangeType);
    //     MGAinputsContainer.appendChild(newInputField);

    // })

    const addMGAInput = document.getElementById('addMGAInput');
    addMGAInput.addEventListener('click', () => {

        const MGAinputsContainer = document.getElementById('MGAinputsContainer');
        addMGAInputFields(MGAinputsContainer);

    })


    //    For CCP input

   const addCCPInputButton = document.getElementById('addCCPInputButton');
   addCCPInputButton.addEventListener('click',()=>{
   const CCPinputType = document.getElementById('CCPinputType');
  const selectedType = CCPinputType.value;
  const CCPContainer = document.getElementById("CCPinputsContainer");
  addCCPInputFields(selectedType, CCPContainer);

   })


   // For Discount Input


   const addDiscountInputButton = document.getElementById('addDiscountInputButton');
   addDiscountInputButton.addEventListener('click',()=>{
    const DiscountContainer = document.getElementById('DiscountInputsContainer');
    addDiscountInputFields(DiscountContainer);
   })



   // For Per Model Input

   
   const addPerModelPairButton = document.getElementById('addPerModelPairButton')
        addPerModelPairButton.addEventListener('click', function() {
            pairCount++;
            const perModelPairContainer = document.getElementById('perModelPairContainer');

            const newPairHTML = `
                <div class="perModelPairContainer">
                    <label for="carModel${pairCount}">Car Model:</label>
                    <select id="carModel${pairCount}">
                        <option value="ALTO">ALTO</option>
                        <option value="K-10">K-10</option>
                        <option value="S-Presso">S-Presso</option>
                        <option value="CELERIO">CELERIO</option>
                        <option value="WagonR">WagonR</option>
                        <option value="BREZZA">BREZZA</option>
                        <option value="DZIRE">DZIRE</option>
                        <option value="EECO">EECO</option>
                        <option value="Ertiga">Ertiga</option>
                        <option value="SWIFT">SWIFT</option>
                    </select>
                    <label for="incentive${pairCount}">Incentive:</label>
                    <input type="number" id="incentive${pairCount}" placeholder="Enter incentive amount">
                </div>
            `;

            perModelPairContainer.insertAdjacentHTML('beforeend', newPairHTML);
        });


    
        const addSpecialCarPairButton = document.getElementById('addSpecialCarPairButton')
        addSpecialCarPairButton.addEventListener('click', function() {
            pairCount++;
            const specialCarPairContainer = document.getElementById('specialCarPairContainer');

            const newPairHTML = `
                <div class="specialCarPairContainer">
                    <label for="carModel${specialCarPairCount}">Car Model:</label>
                    <select id="carModel${specialCarPairCount}">
                        <option value="ALTO">ALTO</option>
                        <option value="K-10">K-10</option>
                        <option value="S-Presso">S-Presso</option>
                        <option value="CELERIO">CELERIO</option>
                        <option value="WagonR">WagonR</option>
                        <option value="BREZZA">BREZZA</option>
                        <option value="DZIRE">DZIRE</option>
                        <option value="EECO">EECO</option>
                        <option value="Ertiga">Ertiga</option>
                        <option value="SWIFT">SWIFT</option>
                    </select>
                    <label for="incentive${specialCarPairCount}">Incentive:</label>
                    <input type="number" id="incentive${specialCarPairCount}" placeholder="Enter incentive amount">
                </div>
            `;

            specialCarPairContainer.insertAdjacentHTML('beforeend', newPairHTML);
        });
    




        document.getElementById('sectionSelect').addEventListener('change', function() {
            const selectedValue = this.value;
            const perCarIncentiveSection = document.getElementById('perCarIncentiveSection');
            const perModelIncentiveSection = document.getElementById('perModelIncentiveSection');
    
            if (selectedValue === 'perCarIncentive') {
                perCarIncentiveSection.classList.remove('hidden');
                perModelIncentiveSection.classList.add('hidden');
            } else if (selectedValue === 'perModelIncentive') {
                perCarIncentiveSection.classList.add('hidden');
                perModelIncentiveSection.classList.remove('hidden');
            }
        });
    
        // Initialize visibility based on the initial selection
        document.getElementById('sectionSelect').dispatchEvent(new Event('change'));     
   



   form.addEventListener('submit', (e) => {
    e.preventDefault();


    const finalObj = {};
    const formData = new FormData(form);
    const qcData = {
        numOfCars: formData.get('numCars'),
        focusModel: formData.getAll('carsFM'),
        autoCard: formData.get('autocard'),
        EW: formData.get('ew')
    };


    const cdiIncentives = [...document.querySelectorAll('.cdiInput')].map(div => {
        let type;
        const cdiMinElement = div.querySelector('[name="cdiMin"]');
        const cdiMaxElement = div.querySelector('[name="cdiMax"]');
        const cdiValueElement = div.querySelector('[name="cdiValue"]');

        if (cdiMinElement && cdiMaxElement) {
            type = 'range';
        } else if (cdiValueElement) {
            const labelText = cdiValueElement.previousElementSibling.textContent;
            type = labelText.includes('Greater') ? 'greater' : 'less';
        } else {
            type = null;
        }



        const cdiValue = parseFloat(div.querySelector('[name="cdiValue"]')?.value) || null;
        const cdiMin = parseFloat(div.querySelector('[name="cdiMin"]')?.value) || null;
        const cdiMax = parseFloat(div.querySelector('[name="cdiMax"]')?.value) || null;
        const incentive = parseFloat(div.querySelector('[name="incentive"]')?.value) || null;

        return { type, cdiValue, cdiMin, cdiMax, incentive };
    });


    const pairContainers = document.getElementsByClassName('pair-container');
    for (let i = 0; i < pairContainers.length; i++) {
        const pairContainer = pairContainers[i];
        const carsInput = pairContainer.querySelector('input[name="cars"]');
        const incentiveInput = pairContainer.querySelector('input[name="incentive"]');


        const pair = {
            cars: carsInput.value,
            incentive: incentiveInput.value
        };

        carPairs.push(pair);
    }



    const ExchangepairContainers = document.getElementsByClassName('Exchange-pair-container');
    for (let i = 0; i < ExchangepairContainers.length; i++) {
        const ExchangepairContainer = ExchangepairContainers[i];
        const exchangeInput = ExchangepairContainer.querySelector('input[name="exchange"]');
        const incentiveInput = ExchangepairContainer.querySelector('input[name="incentive"]');


        const exchangePair = {
            ExchangeNumber: exchangeInput.value,
            incentive: incentiveInput.value
        };

        ExchangePairs.push(exchangePair);
    }




    const ComplaintpairContainers = document.getElementsByClassName('Complaint-pair-container');
    for (let i = 0; i < ComplaintpairContainers.length; i++) {
        const ComplaintpairContainer = ComplaintpairContainers[i];
        const complaintInput = ComplaintpairContainer.querySelector('input[name="complaint"]');
        const incentiveInput = ComplaintpairContainer.querySelector('input[name="incentive"]');


        const exchangePair = {
            ComplaintNumber: complaintInput.value,
            incentive: incentiveInput.value
        };

        ComplaintInputs.push(exchangePair);
    }



    // const MGinputsContainer = document.getElementById('MGAinputsContainer');

    // MGinputsContainer.querySelectorAll('.range-input').forEach(inputDiv => {
    //     const rangeType = inputDiv.dataset.rangeType;
    //     if (rangeType === 'lessThan') {
    //         const value = parseFloat(inputDiv.querySelector('[name="lessThanValue"]').value);
    //         const incentive = parseFloat(inputDiv.querySelector('[name="lessThanIncentive"]').value);
    //         addRange('lessThan', value, null, incentive);
    //     } else if (rangeType === 'greaterThan') {
    //         const value = parseFloat(inputDiv.querySelector('[name="greaterThanValue"]').value);
    //         const incentive = parseFloat(inputDiv.querySelector('[name="greaterThanIncentive"]').value);
    //         addRange('greaterThan', value, null, incentive);
    //     } else if (rangeType === 'between') {
    //         const fromValue = parseFloat(inputDiv.querySelector('[name="betweenValue1"]').value);
    //         const toValue = parseFloat(inputDiv.querySelector('[name="betweenValue2"]').value);
    //         const incentive = parseFloat(inputDiv.querySelector('[name="betweenIncentive"]').value);
    //         addRange('between', fromValue, toValue, incentive);
    //     }
    // });



    const EWinputsContainer = document.getElementById('EWinputsContainer');
    EWinputsContainer.querySelectorAll('.inputGroup').forEach(inputDiv => {
        const incentive = {};
        if (inputDiv.querySelector('[name="percentageGreaterThan"]')) {
            incentive.type = 'greater';
            incentive.value = parseFloat(inputDiv.querySelector('[name="percentageGreaterThan"]').value);
        } else if (inputDiv.querySelector('[name="percentageLessThan"]')) {
            incentive.type = 'less';
            incentive.value = parseFloat(inputDiv.querySelector('[name="percentageLessThan"]').value);
        } else if (inputDiv.querySelector('[name="percentageMin"]') && inputDiv.querySelector('[name="percentageMax"]')) {
            incentive.type = 'range';
            incentive.min = parseFloat(inputDiv.querySelector('[name="percentageMin"]').value);
            incentive.max = parseFloat(inputDiv.querySelector('[name="percentageMax"]').value);
        }
        incentive.incentive = parseFloat(inputDiv.querySelector('[name="incentive"]').value);
        EWInputs.push(incentive);
    });



    const CCPinputsContainer = document.getElementById('CCPinputsContainer');
    CCPinputsContainer.querySelectorAll('.CCPinputGroup').forEach(inputDiv => {
        const incentive = {};
        if (inputDiv.querySelector('[name="percentageGreaterThan"]')) {
            incentive.type = 'greater';
            incentive.value = parseFloat(inputDiv.querySelector('[name="percentageGreaterThan"]').value);
        } else if (inputDiv.querySelector('[name="percentageLessThan"]')) {
            incentive.type = 'less';
            incentive.value = parseFloat(inputDiv.querySelector('[name="percentageLessThan"]').value);
        } else if (inputDiv.querySelector('[name="percentageMin"]') && inputDiv.querySelector('[name="percentageMax"]')) {
            incentive.type = 'range';
            incentive.min = parseFloat(inputDiv.querySelector('[name="percentageMin"]').value);
            incentive.max = parseFloat(inputDiv.querySelector('[name="percentageMax"]').value);
        }
        incentive.incentive = parseFloat(inputDiv.querySelector('[name="incentive"]').value);
        CCPInputs.push(incentive);
    });




    const MSSFinputsContainer = document.getElementById('MSSFinputsContainer');
    MSSFinputsContainer.querySelectorAll('.MSSFinputGroup').forEach(inputDiv => {
        const incentive = {};
        if (inputDiv.querySelector('[name="percentageGreaterThan"]')) {
            incentive.type = 'greater';
            incentive.value = parseFloat(inputDiv.querySelector('[name="percentageGreaterThan"]').value);
        } else if (inputDiv.querySelector('[name="percentageLessThan"]')) {
            incentive.type = 'less';
            incentive.value = parseFloat(inputDiv.querySelector('[name="percentageLessThan"]').value);
        } else if (inputDiv.querySelector('[name="percentageMin"]') && inputDiv.querySelector('[name="percentageMax"]')) {
            incentive.type = 'range';
            incentive.min = parseFloat(inputDiv.querySelector('[name="percentageMin"]').value);
            incentive.max = parseFloat(inputDiv.querySelector('[name="percentageMax"]').value);
        }
        incentive.incentive = parseFloat(inputDiv.querySelector('[name="incentive"]').value);
        MSSFInputs.push(incentive);
    });



  

       const DinputGroups = document.querySelectorAll('.DinputGroup');
                DinputGroups.forEach(inputDiv => {
                    const amountMinInput = inputDiv.querySelector('[name="amountMin"]');
                    const amountMaxInput = inputDiv.querySelector('[name="amountMax"]');
                    const incentiveInput = inputDiv.querySelector('[name="incentive"]');

                    const incentive = {
                        min: parseFloat(amountMinInput.value),
                        max: amountMaxInput.value ? parseFloat(amountMaxInput.value) : null,
                        incentive: parseFloat(incentiveInput.value)
                    };
                    DiscountInputs.push(incentive);
                });



                const MGAinputGroups = document.querySelectorAll('.MGAinputGroup');
                MGAinputGroups.forEach(inputDiv => {
                    const amountMinInput = inputDiv.querySelector('[name="amountMin"]');
                    const amountMaxInput = inputDiv.querySelector('[name="amountMax"]');
                    const incentiveInput = inputDiv.querySelector('[name="incentive"]');

                    const incentive = {
                        min: parseFloat(amountMinInput.value),
                        max: amountMaxInput.value ? parseFloat(amountMaxInput.value) : null,
                        incentive: parseFloat(incentiveInput.value)
                    };
                    MGAranges.push(incentive);
                });            

                let perModelCarPairs = {};
                for (let i = 1; i <= pairCount; i++) {

                    const carModel = document.getElementById(`carModel${i}`).value;
                    const incentive = document.getElementById(`incentive${i}`).value;
                    
                    perModelCarPairs[carModel] = incentive;
                    // perModelInputs.push(perModelCarPairs);
                }
 

                let specialCarPairs = {};

                for (let i = 1; i <= specialCarPairCount; i++) {

                    const carModel = document.getElementById(`carModel${i}`).value;
                    const incentive = document.getElementById(`incentive${i}`).value;
                    
                    specialCarPairs[carModel] = incentive;
                    // perModelInputs.push(perModelCarPairs);
                }

    finalObj["QC"] = qcData;
    finalObj["CDI"] = cdiIncentives;
    finalObj["carIncentive"] = carPairs;
    finalObj["ExchangeInputs"] = ExchangePairs;
    finalObj["ComplaintInputs"] = ComplaintInputs;
    finalObj["DiscountInputs"] = DiscountInputs;
    finalObj["MGAIncentive"] = MGAranges;
    finalObj["Extended Warranty"] = EWInputs;
    finalObj["PerModelIncentive"] = perModelCarPairs;
    finalObj["SpecialCarIncentive"] = specialCarPairs;
    finalObj["CCP"] = CCPInputs;
    finalObj["MSSF"] = MSSFInputs;
    console.log('FinalObj', finalObj);

    ipcRenderer.send('form-submit', finalObj);

});

function populateTable(data) {
      const table = document.querySelector("table");
      table.innerHTML = "";

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      for (const key in data[0]) {

        const th = document.createElement("th");
        th.innerText = key;
        headerRow.appendChild(th);

      }

      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach((row) => {

        const tr = document.createElement("tr");
        for (const key in row) {
          const td = document.createElement("td");
          td.innerText = row[key];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
    }

ipcRenderer.on("dataForExcel", (event, data) => {
    populateTable(data);
  });


ipcRenderer.on("data-error", (event, errorMessage) => {
    console.error(errorMessage);
});
 



   })





