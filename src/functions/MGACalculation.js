module.exports =  (qualifiedRM, MGAdata, formData) => {

    function searchByID(data, id) {
        return data.find(item => item.ID == id);
    }   
   
qualifiedRM.forEach(element => {

 const result = searchByID(MGAdata, element["DSE ID"]);

 element["MGA"] = result["MGA/VEH"];


    const mgaValue = parseFloat(element["MGA"]);
   let MGAIncentive = 0; 
//    element["MGA Incentive"] = 0;
   

    for (const range of formData["MGAIncentive"]) {
        // if (range.type === 'lessThan' && mgaValue < range.value) {
        //     MGAIncentive = range.incentive;
        //     break;
        // } else if (range.type === 'greaterThan' && mgaValue > range.value) {
        //     MGAIncentive = range.incentive;
        //     break;
        // } else if (range.type === 'between' && mgaValue >= range.from && mgaValue <= range.to) {
        //     MGAIncentive = range.incentive;
        //     break;
        // }

        if (range.max === null) {
            if (mgaValue >= range.min) {
               MGAIncentive = parseFloat(range.incentive);
                break;
            }
        } else {
            if (mgaValue >= range.min && mgaValue < range.max) {
                MGAIncentive = parseFloat(range.incentive);
                break;
            }
        }
    
    }

    element["Total Incentive"] = element["Total Incentive"] + element["EW Incentive"] + element["CCP Incentive"]+ element["MSSF Incentive"] + element["CDI Incentive"] + parseFloat(element["Discount Incentive"]) + parseFloat(element["Exchange Incentive"]);

  element["MGA Incentive"] = ((element["Total Incentive"]*parseFloat(MGAIncentive)))/100;

    element["Total Incentive"] = element["Total Incentive"] + element["MGA Incentive"];

});

return qualifiedRM;
    
};



// });

// return qualifiedRM;
    
// };
