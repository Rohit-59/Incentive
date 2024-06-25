
module.exports =  (qualifiedRM, CDIdata, formData) => {

    function searchByID(data, id) {
        return data.find(item => item["DSE ID"] == id);
    }   
   
qualifiedRM.forEach(element => {

 const result = searchByID(CDIdata, element["DSE ID"]);
 element["CDI Score"] = result["CDI"];

 const cdiScore = parseFloat(element["CDI Score"]);
 let CDIIncentive; 

 
    for (const incentive of formData.CDI) {
        if (
            (incentive.type === 'greater' && cdiScore > incentive.cdiValue) ||
            (incentive.type === 'less' && cdiScore < incentive.cdiValue) ||
            (incentive.type === 'range' && cdiScore >= incentive.cdiMin && cdi <= incentive.cdiMax)
        ) {
            CDIIncentive = incentive.incentive;
        }
    }


    element["CDI Incentive"] = CDIIncentive;



});

return qualifiedRM;
}