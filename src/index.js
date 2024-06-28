const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const XLSX = require('xlsx');
const writeXlsxFile = require('write-excel-file/node');
const { isContext } = require('node:vm');
if (require('electron-squirrel-startup')) {
  app.quit();
}


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

//Separate Calculation Functions
const MGAfunc = require('./functions/MGACalculation');
const CDIfunc = require('./functions/CDICalculation');
const EWfunc = require('./functions/EWCalculation');
const CCPfunc = require('./functions/CCPCalculation');
const MSSFfunc = require('./functions/MSSFCalculation');
const DiscountFunc = require('./functions/DiscountCalculation')
const ExchangeFunc = require('./functions/ExchangeStatusCalculation')
const ComplaintFunc = require('./functions/ComplaintCalculation');
const PerModelCarFunc = require('./functions/PerModelCalculation');
const SpecialCarFunc = require('./functions/SpecialCarCalculation');
const PerCarFunc = require('./functions/PerCarCalculation');
const MSRFunc = require('./functions/MSRCalculation');
const SuperCarFunc = require('./functions/SuperCarCalculation');

// Global Variables
let MGAdata = [];
let CDIdata = [];
let salesExcelDataSheet = [];
let employeeStatusDataSheet = [];
let qualifiedRM = [];
let nonQualifiedRM = [];



const checkQualifingCondition = (formData) => {
  console.log("checkQualifingCondition");
  salesExcelDataSheet.forEach((item) => {

    let numberCheck = 0;
    let Discount = 0;
    let ComplaintCheck = 0;
    let EWCheck = 0;
    let EWPCheck = 0;
    let ExchangeStatusCheck = 0;
    let TotalNumberCheck = 0;
    let CCPcheck = 0;
    let MSSFcheck = 0;
    let autoCardCheck = 0;
    let obj = {};
    let MSRcheck = 0;

    let carObj = {
      "ALTO": 0,
      "K-10": 0,
      "S-Presso": 0,
      "CELERIO": 0,
      "WagonR": 0,
      "BREZZA": 0,
      "DZIRE": 0,
      "EECO": 0,
      "Ertiga": 0,
      "SWIFT": 0
    }

    const DSE_NoOfSoldCarExcelDataArr = Object.values(item)[0]; 

    obj = {
      "DSE ID": DSE_NoOfSoldCarExcelDataArr[0]['DSE ID'],
      "DSE Name": DSE_NoOfSoldCarExcelDataArr[0]['DSE Name'],
      "BM AND TL NAME": DSE_NoOfSoldCarExcelDataArr[0]['BM AND TL NAME'],
      "Focus Model Qualification": "No",
      "Grand Total": 0

    }

    DSE_NoOfSoldCarExcelDataArr.forEach((sold) => {

     Discount = Discount + parseInt(sold["FINAL DISCOUNT"]); 

     carObj[sold["Model Name"]]++;

     if(parseInt(sold["CCP PLUS"]) >0){
      CCPcheck++;
     }
     if(sold["Financer REMARK"] == "MSSF"){
      MSSFcheck++;
     }
     if(parseInt(sold["Extended Warranty"]) >0){
      EWPCheck++;
     }
     if(sold["Exchange Status"] == 'YES' || sold["Exchange Status"] == 'yes'  ){
      ExchangeStatusCheck++;
     }
     if(sold["Complaint Status"] == 'YES' || sold["Complaint Status"] == 'yes'  ){
      ComplaintCheck++;
     }
     if(sold["Autocard"] == 'YES' || sold["Autocard"] == 'yes'){
      MSRcheck++;
     }

  TotalNumberCheck++;
     
 if (formData.QC.focusModel.includes(sold["Model Name"])) {
        numberCheck++;
        // carObj[sold["Model Name"]]++;
      }
      if (formData.QC.autoCard == "yes") {
        if (sold["Autocard"] == "YES") {
          autoCardCheck++;
        }
      }
      if (formData.QC.EW == "yes") {
        if (sold["Extended Warranty"] > 0) {
          EWCheck++;
        }
      }
    })

    //for EW and auto card check
    if (numberCheck >= formData.QC.numOfCars) {
      let EWFlag = true;
      let autoCardFlag = true;

      //checking autocard from the excel [form ] 
      if (formData.QC.autoCard === "yes" && (EWCheck >= DSE_NoOfSoldCarExcelDataArr.length))
        autoCardFlag = true;
      else {
        if (formData.QC.autoCard === "yes")
          autoCardFlag = false;
      }
      if (formData.QC.EW === "yes" && (EWCheck >= DSE_NoOfSoldCarExcelDataArr.length))
        EWFlag = true;
      else {
        if (formData.QC.EW === "yes")
          EWFlag = false;
      }
      if (EWFlag && autoCardFlag) {
        // console.log("sdfghgfcvhjkjhv  :  ", obj);
        obj = {
          ...obj,
          ...carObj,
          "Focus Model Qualification": "YES",
          "Discount": Discount,
          "Exchange Status" : ExchangeStatusCheck,
          "Complaints":ComplaintCheck,
          "EW Penetration" : (EWPCheck/TotalNumberCheck)*100,
          "MSR": (MSRcheck/TotalNumberCheck)*100,
          "CCP":  (CCPcheck/TotalNumberCheck)*100,
          "MSSF": (MSSFcheck/TotalNumberCheck)*100,
          "Grand Total": TotalNumberCheck
        }
        qualifiedRM.push(obj)
      } else {
        obj = {
          ...obj,
          ...carObj,
          "Focus Model Qualification": "No",
          "Discount": Discount,
          "Exchange Status" : ExchangeStatusCheck,
          "Complaints":ComplaintCheck,
          "EW Penetration" : (EWPCheck/TotalNumberCheck)*100,
          "MSR": (MSRcheck/TotalNumberCheck)*100,
          "CCP":  (CCPcheck/TotalNumberCheck)*100,
          "MSSF": (MSSFcheck/TotalNumberCheck)*100,
          "Grand Total": TotalNumberCheck
        }
        nonQualifiedRM.push(obj)
      }
    }
  })
  console.log("qualifiedRM : ", qualifiedRM)
// console.log("nonQualifiedRM : ", nonQualifiedRM)
  

}




ipcMain.on('form-submit', (event, formData) => {
 
  console.log("Form Data Input", formData);
  checkQualifingCondition(formData);
  qualifiedRM = PerCarFunc(qualifiedRM,formData);
  qualifiedRM = SpecialCarFunc(qualifiedRM,formData);
  qualifiedRM = PerModelCarFunc(qualifiedRM,formData);
  qualifiedRM = CDIfunc(qualifiedRM,CDIdata,formData);
  qualifiedRM = SuperCarFunc(qualifiedRM,MGAdata,salesExcelDataSheet,formData)
  qualifiedRM = EWfunc(qualifiedRM, formData);
  qualifiedRM = CCPfunc(qualifiedRM,formData);
  qualifiedRM = MSSFfunc(qualifiedRM, formData);
  qualifiedRM = MSRFunc(qualifiedRM,formData);
  qualifiedRM = DiscountFunc(qualifiedRM,formData);
  qualifiedRM = ExchangeFunc(qualifiedRM,formData);
  qualifiedRM = ComplaintFunc(qualifiedRM,formData);
  qualifiedRM = MGAfunc(qualifiedRM, MGAdata, formData);
  

   console.log(qualifiedRM);

  event.reply("dataForExcel", qualifiedRM);

  
});





ipcMain.on('file-selected-salesExcel', (event, path) => {


  const workbook = XLSX.readFile(path);
  const salesSheetName = workbook.SheetNames[0];
  const salesSheet = workbook.Sheets[salesSheetName];
  const salesSheetData = XLSX.utils.sheet_to_json(salesSheet);

  const MGAsheetName = workbook.SheetNames[2];
  const MGAsheet = workbook.Sheets[MGAsheetName];
 
  const options = {         
    range: 3           
  };

  const MGAsheetData = XLSX.utils.sheet_to_json(MGAsheet, options);

  MGAsheetData.forEach((MGArow)=>{
  
    if(MGArow.hasOwnProperty("ID")){
     MGAdata.push(MGArow);
    }
  })


  console.log("MGA", MGAdata);




  // const employeeStatusSheetName = workbook.SheetNames[3];
  // const employeeStatusSheet = workbook.Sheets[employeeStatusSheetName];
  // employeeStatusDataSheet = XLSX.utils.sheet_to_json(employeeStatusSheet);
  // console.log("Object inside array employeeStatus", JSON.stringify(employeeStatusDataSheet));


  salesSheetData.shift();
  let groupedData = {};
  salesSheetData.forEach(row => {
    const dseId = row['DSE ID'];
    if (!groupedData[dseId]) {
      groupedData[dseId] = [];
    }
    groupedData[dseId].push(row);
  });
  for (const key in groupedData) {
    if (groupedData.hasOwnProperty(key)) {
      const obj = {};
      obj[key] = groupedData[key];
      salesExcelDataSheet.push(obj);
    }
  }
  console.log("Object inside array Sales excel", JSON.stringify(salesExcelDataSheet));
});




ipcMain.on('file-selected-CDIScore', (event, path) => {

  const workbook = XLSX.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const CDIsheetData = XLSX.utils.sheet_to_json(sheet);

CDIdata = CDIsheetData;

  // console.log("Object inside array CDI Score", CDIdata);
});



app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});