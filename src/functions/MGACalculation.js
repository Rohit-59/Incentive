module.exports =  (qualifiedRM, MGAdata, formData) => {

    function searchByID(data, id) {
        return data.find(item => item.ID == id);
    }   
   
qualifiedRM.forEach(element => {

 const result = searchByID(MGAdata, element["DSE ID"]);

 element["MGA"] = result["MGA/VEH"];


    const mgaValue = parseFloat(element["MGA"]);
   let MGAIncentive;    

    for (const range of formData["MGAIncentive"]) {
        if (range.type === 'lessThan' && mgaValue < range.value) {
            MGAIncentive = range.incentive;
            break;
        } else if (range.type === 'greaterThan' && mgaValue > range.value) {
            MGAIncentive = range.incentive;
            break;
        } else if (range.type === 'between' && mgaValue >= range.from && mgaValue <= range.to) {
            MGAIncentive = range.incentive;
            break;
        }
    }

    element["Total Incentive"] = element["Total Incentive"] + element["EW Incentive"] + element["CCP Incentive"]+ element["MSSF Incentive"] + element["CDI Incentive"];

  element["MGA Incentive"] = (element["Total Incentive"]*MGAIncentive)/100;

    element["Total Incentive"] = element["Total Incentive"] + element["MGA Incentive"];

});

return qualifiedRM;
    
};



// });

// return qualifiedRM;
    
// };
