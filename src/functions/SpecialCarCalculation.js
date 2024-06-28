
module.exports =  (qualifiedRM, CDIdata, formData) => {

 
    qualifiedRM.forEach(element => {
    
    
    element["SpecialCar Incentive"] = 0;
    
    let specialCarIncentive = 0;
    
    for (const model in formData.SpecialCarIncentive[0]) {
        if (element.hasOwnProperty(model) && element[model] > 0) {
             specialCarIncentive += element[model] * formData.SpecialCarIncentive[0][model];
        }
    }
    
    element["SpecialCar Incentive"] =   specialCarIncentive;
    
    });
    
    return qualifiedRM;
    }
    