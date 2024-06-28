module.exports = (qualifiedRM, MGADataSheet, salesExcelDataSheet, formData) => {

    qualifiedRM.forEach(element => {
        const userID = element["DSE ID"];

        element["Super Car Incentive"] = 0;
        const specialCar = "Ertiga";

        salesExcelDataSheet.forEach((data) => {
            let superCarMGAStatus = false;



            if (data.hasOwnProperty(userID)) {
                data[userID].forEach((record) => {
                    const mappedObject = {}

                    // let superCarEWStatus = false;
                    // let superCarDiscountStatus = false;
                    // let superCarInsuranceStatus = false;
                    // let superCarCCPStatus = false;
                    // let superCarMSRStatus = false;

                    formData.superCar.superCarCriteria.forEach(key => {
                        mappedObject[key] = false;
                    });

                    // MGA check and update 
                    if (formData.superCar.superCarCriteria.hasOwnProperty("MGASaleGT30K")) {
                        MGADataSheet.forEach((record) => {
                            if (record["DSE ID"] === DSE_ID && record['MGA/VEH'] >= 30000) {
                                mappedObject.MGASaleGT30K = true;
                            }
                        });
                    }


                    if (!(formData.SpecialCarIncentive.hasOwnProperty(record["Model Name"]))) {
                        //discount check amd update
                        if (formData.superCar.superCarCriteria.hasOwnProperty("zerodiscountOnVehicle")) {
                            if (record["Final DISCOUNT"] <= 0) {
                                mappedObject.zerodiscountOnVehicle = true;
                            }
                        }

                        //EW check amd update
                        if (formData.superCar.superCarCriteria.hasOwnProperty("royalPlatinum")) {
                            if (record['Extended Warranty'] > 0) {
                                mappedObject.royalPlatinum = true;
                            }
                        }
                        //insurance check and update
                        if (formData.superCar.superCarCriteria.hasOwnProperty("insurance")) {
                            if (record["Insurance"] > 0) {
                                mappedObject.insurance = true;
                            }
                        }

                        //ccp check and update 
                        if (formData.superCar.superCarCriteria.hasOwnProperty("CCP")) {
                            if (record["CCP PLUS"] > 0) {
                                mappedObject.CCP = true;
                            }
                        }
                        //AutoCard / MSR check and update
                        if (formData.superCar.superCarCriteria.hasOwnProperty("MSR")) {
                            if (record["Autocard"] === 'yes' || record["Autocard"] === 'YES') {
                                mappedObject.MSR = true;
                            }
                        }
                        let superCarStatus = true;
                        for (let i in mappedObject) {
                            if (mappedObject[i] == false) {
                                superCarStatus = false;
                            }
                        }
                        console.log('superCarStatus')
                        console.log(superCarStatus)
                        const superCarIncentive = formData.superCar.superCarIncentive;
                        if(superCarStatus){
                            element["Super Car Incentive"] += superCarIncentive;
                            console.log('element["Super Car Incentive"]')
                            console.log(element["Super Car Incentive"])
                        }
                        


                    }
                })
            }
        })

    });

    return qualifiedRM;
}