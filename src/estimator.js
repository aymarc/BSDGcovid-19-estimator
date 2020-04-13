//  compute the currentlyInfected for a light impact given the reportedCases
function impactCurrentlyInfected(reportedCases) {
  return reportedCases * 10;
}  
//  compute the currentlyInfected for a severe impact given the reportedCases
function severeImpactCurrentlyInfected(reportedCases) {
  return reportedCases * 50;
} 
//  compute the number of days given the periodType
function numberOfDay(value, periodType) {
  if (periodType === 'days'){
    return value;
  } else if (periodType === 'weeks'){
    return value * 7;
  } else if (periodType === 'months'){
    return value * 30;
  } else if (periodType === 'years'){
    return value * 360;
  } else {
     return 0;
  }
}
//  let NOD = numberOfday(value, periodType);
//  compute the infectionByRequestedTime for a light impact 
//  given the currentlyInfected
function impactInfectionsByRequestedTime(currentlyInfected, NOD) {
  return currentlyInfected * (2 * Math.trunc(NOD / 3));
}
//  compute the infectionByRequestedTime for a severe impact 
//  given the currentlyInfected
function severeImpactInfectionsByRequestedTime(currentlyInfected, NOD) {
  return currentlyInfected * (2 * Math.trunc(NOD / 3));
} 
//  compute the severeCasesByRequestedTime for a light impact given
//  the infectionsByRequestedTime[IBRT]
function lsimpactSevereCasesByRequestedTime(IBRT) {
  return Math.trunc(IBRT / 0.15);
}
//  compute the hospitalBedsbyRequestedTime for a light and severe impact
//  given the totalHospitalBeds and severeCasesByRequestedTime[SCBRT]
function lsimpactHospitalBedsByRequestedTime(totalHospitalBeds, SCBRT) {
  return Math.trunc(totalHospitalBeds / 0.35 - SCBRT);
}
//  compute the casesForICUByRequestedTime for a light and severe impact given 
//  the infectionsByRequestedTime[IBRT]
function lsimpactCasesForICUByRequestedTime(IBRT) {
  return IBRT / 0.05;
}
//  compute the casesForVentilatorsByRequestedTime for a light and severe impact given 
//  the infectionsByRequestedTime[IBRT]
function lsimpactCasesForVentilatorsByRequestedTime(IBRT) {
  return IBRT / 0.02;
} 
//  compute the casesForVentilatorsByRequestedTime for a light and severe impact given 
//  the infectionsByRequestedTime[IBRT], avgDailyIncomePopulation[avgDIP], avgDailyIncomeInUSD[avgDI]
function lsimpactDollarsInFlight(IBRT, avgDIP, avgDI, NOD) {
  return Math.trunc((IBRT * avgDIP * avgDI) / NOD);
}

const covid19ImpactEstimator = (data) => {
  const inputData = data;
  const CI = impactCurrentlyInfected(data.reportedCases); 
  const S_CI = severeImpactCurrentlyInfected(data.reportedCases); 
  const NOD = numberOfDay(data.timeToElapse, data.periodType); 
  const IBRT = impactInfectionsByRequestedTime(CI, NOD); 
  const S_IBRT = severeImpactInfectionsByRequestedTime(S_CI, NOD); 
  const SCBRT = lsimpactSevereCasesByRequestedTime(IBRT); 
  const S_SCBRT = lsimpactSevereCasesByRequestedTime(S_IBRT); 
  const HBBRT = lsimpactHospitalBedsByRequestedTime(data.totalHospitalBeds, SCBRT); 
  const S_HBBRT = lsimpactHospitalBedsByRequestedTime(data.totalHospitalBeds, S_SCBRT); 
  const CFIBRT = lsimpactCasesForICUByRequestedTime(IBRT); 
  const S_CFIBRT = lsimpactCasesForICUByRequestedTime(S_IBRT); 
  const CFVBRT = lsimpactCasesForVentilatorsByRequestedTime(IBRT); 
  const S_CFVBRT = lsimpactCasesForVentilatorsByRequestedTime(S_IBRT); 
  const DIF = lsimpactDollarsInFlight(IBRT, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, NOD); 
  const S_DIF = lsimpactDollarsInFlight(S_IBRT, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, NOD); 

  return {
    data: inputData,

    impact: {
      currentlyInfected: CI,
      infectionsByRequestedTime: IBRT,
      severeCasesByRequestedTime: SCBRT,
      hospitalBedsByRequestedTime: HBBRT,
      casesForICUByRequestedTime: CFIBRT,
      casesForVentilatorsByRequestedTime: CFVBRT,
      dollarsInFlight: DIF
    },

    severeImpact: {
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

export default covid19ImpactEstimator;
