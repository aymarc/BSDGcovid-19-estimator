
/*------------------------------------------/
        SET OF FUNCTIONS FOR CHALLENGE1
/ -----------------------------------------*/
//compute the currentlyInfected for a light impact given the reportedCases
function impact_currentlyInfected(reportedCases){
    return reportedCases * 10;
}  
//compute the currentlyInfected for a severe impact given the reportedCases
function severeimpact_currentlyInfected(reportedCases){
    return reportedCases * 50;
} 
//compute the number of days given the periodType
function numberOfday(value, periodType){
    if(periodType === "days"){
        return value;
    } else if(periodType === "weeks"){
        return value * 7;
    } else if(periodType === "months"){
        return value * 30;
    } else if(periodTypes === "years"){
        return value * 360;
    }
}
//let NOD = numberOfday(value, periodType);
//compute the infectionByRequestedTime for a light impact given the currentlyInfected
function impact_infectionsByRequestedTime(currentlyInfected, NOD){
    return currentlyInfected * ( 2 * Math.trunc(NOD/3));
}
//compute the infectionByRequestedTime for a severe impact given the currentlyInfected
function severeimpact_infectionsByRequestedTime(currentlyInfected, NOD){
    return currentlyInfected * ( 2 * Math.trunc(NOD/3));
} 

/*------------------------------------------/
      END OF SET OF FUNCTIONS FOR CHALLENGE1
/ -----------------------------------------*/


/*------------------------------------------/
        SET OF FUNCTIONS FOR CHALLENGE2
/ -----------------------------------------*/

//compute the severeCasesByRequestedTime for a light impact given the infectionsByRequestedTime[IBRT]
function LSimpact_severeCasesByRequestedTime(IBRT){
    return Math.trunc(IBRT / 0.15);
}

//compute the hospitalBedsbyRequestedTime for a light and severe impact given the totalHospitalBeds and severeCasesByRequestedTime[SCBRT]
function LSimpact_hospitalBedsByRequestedTime(totalHospitalBeds, SCBRT){
    return Math.trunc(totalHospitalBeds / 0.35 - SCBRT);
}

/*------------------------------------------/
       END SET OF FUNCTIONS FOR CHALLENGE2
/ -----------------------------------------*/


/*------------------------------------------/
        SET OF FUNCTIONS FOR CHALLENGE3
/ -----------------------------------------*/

//compute the casesForICUByRequestedTime for a light and severe impact given the infectionsByRequestedTime[IBRT]
function LSimpact_casesForICUByRequestedTime(IBRT){
    return IBRT / 0.05;
}

//compute the casesForVentilatorsByRequestedTime for a light and severe impact given the infectionsByRequestedTime[IBRT]
function LSimpact_casesForVentilatorsByRequestedTime(IBRT){
    return IBRT / 0.02;
} 

//compute the casesForVentilatorsByRequestedTime for a light and severe impact given the infectionsByRequestedTime[IBRT], avgDailyIncomePopulation[avgDIP], avgDailyIncomeInUSD[avgDI]
function LSimpact_dollarsInFlight(IBRT, avgDIP, avgDI, NOD){
    return Math.trunc((IBRT * avgDIP * avgDI) / NOD);
}


/*------------------------------------------/
       END SET OF FUNCTIONS FOR CHALLENGE3
/ -----------------------------------------*/

const covid19ImpactEstimator = (data) => {
    let inputData = data;
    let CI = impact_currentlyInfected(data.reportedCases); 
    let S_CI = severeimpact_currentlyInfected(data.reportedCases); 

    let NOD = numberOfday(data.timeToElapse, data.periodType); 
    let IBRT = impact_infectionsByRequestedTime(CI, NOD); 
    let S_IBRT = severeimpact_infectionsByRequestedTime(S_CI, NOD); 

    let SCBRT = LSimpact_severeCasesByRequestedTime(IBRT); 
    let S_SCBRT = LSimpact_severeCasesByRequestedTime(S_IBRT); 

    let HBBRT = LSimpact_hospitalBedsByRequestedTime(data.totalHospitalBeds, SCBRT); 
    let S_HBBRT = LSimpact_hospitalBedsByRequestedTime(data.totalHospitalBeds, S_SCBRT); 

    let CFIBRT = LSimpact_casesForICUByRequestedTime(IBRT); 
    let S_CFIBRT = LSimpact_casesForICUByRequestedTime(S_IBRT); 

    let CFVBRT = LSimpact_casesForVentilatorsByRequestedTime(IBRT); 
    let S_CFVBRT = LSimpact_casesForVentilatorsByRequestedTime(S_IBRT); 

    let DIF = LSimpact_dollarsInFlight(IBRT, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, NOD); 
    let S_DIF = LSimpact_dollarsInFlight(S_IBRT, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, NOD); 

    return {
        data:inputData,
        impact:{
            currentlyInfected: CI,
            infectionsByRequestedTime: IBRT,
            severeCasesByRequestedTime: SCBRT,
            hospitalBedsByRequestedTime: HBBRT,
            casesForICUByRequestedTime: CFIBRT,
            casesForVentilatorsByRequestedTime: CFVBRT,
            dollarsInFlight: DIF
        },
        severeImpact:{
            currentlyInfected: S_CI,
            infectionsByRequestedTime: S_IBRT,
            severeCasesByRequestedTime: S_SCBRT,
            hospitalBedsByRequestedTime: S_HBBRT,
            casesForICUByRequestedTime: S_CFIBRT,
            casesForVentilatorsByRequestedTime: S_CFVBRT,
            dollarsInFlight: S_DIF
        }
    };

};

    
// data ={
//     region:{
//         name:"Africa",
//         avgAge: 19.7,
//         avgDailyIncomeInUSD: 5,
//         avgDailyIncomePopulation: 0.71
//     },
//     periodType: "days",
//     timeToElapse: 58,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
// }

// let testRun = covid19ImpactEstimator(data);
// console.log(testRun);
export default covid19ImpactEstimator;
