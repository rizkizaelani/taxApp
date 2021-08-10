var express = require('express');
var router = express.Router();
const taxationData = require("../data/taxationScheme.json");
const taxReliefData = require("../data/taxRelief.json");
const testCase = require("../data/testCase.json");

// const findTaxRelief = (code) => {
//   let mapTaxRelief = {};
//   for (const taxRelief of taxReliefData) {
//     mapTaxRelief[taxRelief.code] = taxRelief;
//   }

//   return mapTaxRelief[code];
// }

const calculateTax = (annualIncome, taxation, taxRelief) => {
  let arrTax = [];
  let income = Number(annualIncome) - Number(taxRelief.amount);
  let totalTaxes = 0;

  for (const interval of taxation) {
    let data = JSON.parse(JSON.stringify(interval));
    if (income < interval.amountEnd) {
      let amount = income - interval.amountStart;
      totalTaxes += amount * (interval.taxRate/100);
      data.amount = amount
      data.total = totalTaxes;
      arrTax.push(data);
      break;
    } else {
      let amount = interval.amountEnd - interval.amountStart;
      totalTaxes += amount * (interval.taxRate/100);
      data.amount = amount;
      data.total = totalTaxes;
      arrTax.push(data);
    }
  }

  const toReturn = {
    totalTax: totalTaxes,
    detail: arrTax
  }

  return toReturn;
}

router.post('/', (req, res, next) => {
  const data = req.body;

  // map tax relief
  let mapTaxRelief = {};
  for (const taxRelief of taxReliefData) {
    mapTaxRelief[taxRelief.code] = taxRelief;
  }

  const toReturn = data.map(val => {
    //calculate annual income
    const annualIncome = val.monthlySalary * 12;

    //get tax relief by marriage status
    const taxRelief = mapTaxRelief[val.marriageStatus];

    //calculate tax by taxationData
    const taxation = calculateTax(annualIncome, taxationData, taxRelief);

    return {
      ...val,
      ...taxation,
      annualIncome: annualIncome,
      taxRelief: taxRelief,
      // total: calculate
    }
  });

  return res.status(200).json({
    success: true,
    statusCode: 200,
    data: toReturn
  });
});

module.exports = router;
