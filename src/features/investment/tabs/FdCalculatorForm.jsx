import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { calculateFD } from "../../../utils/investmentCalculations";
import FdCalculatorInputs from "../components/FdCalculatorInputs"; // Import the new input component

const FdCalculator = ({ onCalculate, sharedState, onSharedStateChange }) => {
  const { principalAmount, interestRate, timePeriod, compoundingFrequency } = sharedState || {};

  useEffect(() => {
    handleCalculate();
  }, [principalAmount, interestRate, timePeriod, compoundingFrequency]);

  const handleCalculate = () => {
    if (principalAmount > 0 && interestRate > 0 && timePeriod > 0) {
      try {
        const result = calculateFD(principalAmount, interestRate, timePeriod, compoundingFrequency);
        if (typeof onCalculate === "function") {
          onCalculate({
            investedAmount: principalAmount,
            estimatedReturns: result.totalValue - principalAmount,
            totalValue: result.totalValue,
            chartData: result.chartData,
          });
        }
      } catch (error) {
        console.error("Error calculating FD:", error);
      }
    } else {
      if (typeof onCalculate === "function") {
        onCalculate({
          investedAmount: 0,
          estimatedReturns: 0,
          totalValue: 0,
          chartData: [],
        });
      }
    }
  };

  return (
    <Box>
      <FdCalculatorInputs
        principalAmount={principalAmount}
        interestRate={interestRate}
        timePeriod={timePeriod}
        compoundingFrequency={compoundingFrequency}
        onSharedStateChange={onSharedStateChange}
      />
    </Box>
  );
};

export default FdCalculator;
