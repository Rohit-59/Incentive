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

element["MGA Incentive"] = (element["Total Incentive"]*MGAIncentive)/100;
    

});

return qualifiedRM;
    
};



// });

// return qualifiedRM;
    
// };
