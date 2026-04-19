import React from "react";
import styled from "styled-components";
import { Box, Paper, Typography, Grid } from "@mui/material"; // Removed Divider
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import {
  updateLoanDetails,
  updateExpenses,
  changeLoanUnit,
  changeExpenseUnit,
  selectLoanDetails,
  selectExpenses,
  selectCurrency,
} from "../../../store/emiSlice"; // Import Redux actions and selectors
import { selectCalculatedValues } from "../utils/emiCalculator"; // Import selectCalculatedValues from emiCalculator
import { AmountInput, AmountWithUnitInput, DatePickerInput } from "../../../components/common/CommonComponents";
import {
  convertAmount,
  convertTenure,
  convertYearlyPaymentIncrease,
} from "../utils/emiCalculator"; // Import conversion helpers

const StyledPaper = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const HomeLoanForm = () => {
  const dispatch = useDispatch(); // Initialize useDispatch
  const loanDetails = useSelector(selectLoanDetails); // Use useSelector for loanDetails
  const expenses = useSelector(selectExpenses); // Use useSelector for expenses
  const calculatedValues = useSelector(selectCalculatedValues); // Use useSelector for calculatedValues
  const currency = useSelector(selectCurrency); // Use useSelector for currency

  const handleUnitChange = (unitField, amountField, event) => {
    const newUnit = event.target.value;
    const oldUnit = loanDetails[unitField];
    const currentAmount = loanDetails[amountField];
    let convertedAmount; // Removed redundant initialization

    if (unitField === "tenureUnit") {
      convertedAmount = convertTenure(currentAmount, oldUnit, newUnit);
    } else if (unitField === "yearlyPaymentIncreaseUnit") {
      convertedAmount = convertYearlyPaymentIncrease(
        currentAmount,
        oldUnit,
        newUnit,
        calculatedValues.emi // Pass the calculated EMI
      );
    } else {
      let baseValue = loanDetails.homeValue;
      if (unitField === "feesUnit") {
        baseValue = calculatedValues.loanAmount;
      }
      convertedAmount = convertAmount(currentAmount, oldUnit, newUnit, baseValue);
    }

    dispatch(changeLoanUnit({ unitField, amountField, newUnit, convertedAmount })); // Dispatch Redux action
  };

  const handleChange = (field, event) => {
    let value = parseFloat(event.target.value);
    if (isNaN(value)) value = 0;
    dispatch(updateLoanDetails({ key: field, value })); // Dispatch Redux action
  };

  const handleExpenseUnitChange = (unitField, amountField, event) => {
    const newUnit = event.target.value;
    const oldUnit = expenses[unitField];
    const currentAmount = expenses[amountField];
    const baseValue = loanDetails.homeValue; // Expenses are typically based on home value

    const convertedAmount = convertAmount(currentAmount, oldUnit, newUnit, baseValue);

    dispatch(changeExpenseUnit({ unitField, amountField, newUnit, convertedAmount })); // Dispatch Redux action
  };

  const handleExpenseChange = (field, event) => {
    let value = parseFloat(event.target.value);
    if (isNaN(value)) value = 0;
    dispatch(updateExpenses({ key: field, value })); // Dispatch Redux action
  };

  return (
    <>
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "text.primary" }}>
        Home Loan Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountInput
            label="Home Value (HV)"
            value={loanDetails.homeValue}
            onChange={(e) => handleChange("homeValue", e)}
            currency={currency}
            placeholder="Enter home value"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountWithUnitInput
            label="Margin / Down Payment"
            value={loanDetails.marginAmount}
            onAmountChange={(e) => handleChange("marginAmount", e)}
            unitValue={loanDetails.marginUnit}
            onUnitChange={(e) => handleUnitChange("marginUnit", "marginAmount", e)}
            unitOptions={[
              { value: "Rs", label: currency },
              { value: "%", label: "%" },
            ]}
            placeholder="Enter margin amount"
          />
          <Typography variant="caption" color="textSecondary">
            Value in {currency}: {(calculatedValues?.marginInRs ?? 0).toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountInput
            label="Loan Insurance (LI)"
            value={loanDetails.loanInsurance}
            onChange={(e) => handleChange("loanInsurance", e)}
            currency={currency}
            placeholder="Enter loan insurance"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountInput
            label="Loan Amount"
            value={(calculatedValues?.loanAmount ?? 0).toFixed(2)}
            disabled={true}
            currency={currency}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountInput
            label="Interest Rate"
            value={loanDetails.interestRate}
            onChange={(e) => handleChange("interestRate", e)}
            currency="%"
            placeholder="Enter interest rate"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountWithUnitInput
            label="Loan Tenure"
            value={loanDetails.loanTenure}
            onAmountChange={(e) => handleChange("loanTenure", e)}
            unitValue={loanDetails.tenureUnit}
            onUnitChange={(e) => handleUnitChange("tenureUnit", "loanTenure", e)}
            unitOptions={[
              { value: "years", label: "Y" },
              { value: "months", label: "M" },
            ]}
            placeholder="Enter tenure"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountWithUnitInput
            label="Loan Fees & Charges"
            value={loanDetails.loanFees}
            onAmountChange={(e) => handleChange("loanFees", e)}
            unitValue={loanDetails.feesUnit}
            onUnitChange={(e) => handleUnitChange("feesUnit", "loanFees", e)}
            unitOptions={[
              { value: "Rs", label: currency },
              { value: "%", label: "%" },
            ]}
            placeholder="Enter fees"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <DatePickerInput
            label="Start Month & Year"
            value={loanDetails.startDate}
            onChange={(newValue) => dispatch(updateLoanDetails({ key: "startDate", value: newValue }))} // Dispatch Redux action
          />
        </Grid>
      </Grid>
    </StyledPaper>

    <StyledPaper elevation={3}>
      <SectionHeader>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>Yearly Payment Increment</Typography>
      </SectionHeader>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Plan how much you want to increase your payment on a yearly basis. This helps you close your loan earlier and saves on interest.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountWithUnitInput
            label="Yearly Payment Increase"
            value={loanDetails.yearlyPaymentIncreaseAmount}
            onAmountChange={(e) => handleChange("yearlyPaymentIncreaseAmount", e)}
            unitValue={loanDetails.yearlyPaymentIncreaseUnit}
            onUnitChange={(e) => handleUnitChange("yearlyPaymentIncreaseUnit", "yearlyPaymentIncreaseAmount", e)}
            unitOptions={[
              { value: "Rs", label: currency },
              { value: "%", label: "%" },
            ]}
            placeholder="Enter yearly increase"
          />
           <Typography variant="caption" color="textSecondary">
            Value in {currency}: {(calculatedValues?.yearlyIncreaseAmountRs ?? 0).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </StyledPaper>

    <StyledPaper elevation={3}>
      <SectionHeader>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>Homeowner Expenses</Typography>
      </SectionHeader>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountWithUnitInput
            label="One-time Expenses"
            value={expenses.oneTimeExpenses}
            onAmountChange={(e) => handleExpenseChange("oneTimeExpenses", e)}
            unitValue={expenses.oneTimeUnit}
            onUnitChange={(e) => handleExpenseUnitChange("oneTimeUnit", "oneTimeExpenses", e)}
            unitOptions={[
              { value: "Rs", label: currency },
              { value: "%", label: "%" },
            ]}
            placeholder="Enter one-time expenses"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountWithUnitInput
            label="Property Taxes / year"
            value={expenses.propertyTaxes}
            onAmountChange={(e) => handleExpenseChange("propertyTaxes", e)}
            unitValue={expenses.taxesUnit}
            onUnitChange={(e) => handleExpenseUnitChange("taxesUnit", "propertyTaxes", e)}
            unitOptions={[
              { value: "Rs", label: currency },
              { value: "%", label: "%" },
            ]}
            placeholder="Enter property taxes"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountWithUnitInput
            label="Home Insurance / year"
            value={expenses.homeInsurance}
            onAmountChange={(e) => handleExpenseChange("homeInsurance", e)}
            unitValue={expenses.homeInsUnit}
            onUnitChange={(e) => handleExpenseUnitChange("homeInsUnit", "homeInsurance", e)}
            unitOptions={[
              { value: "Rs", label: currency },
              { value: "%", label: "%" },
            ]}
            placeholder="Enter home insurance"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <AmountInput
            label="Maintenance / month"
            value={expenses.maintenance}
            onChange={(e) => handleExpenseChange("maintenance", e)}
            currency={currency}
            placeholder="Enter maintenance cost"
          />
        </Grid>
      </Grid>
    </StyledPaper>
    </>
  );
};

export default HomeLoanForm;
