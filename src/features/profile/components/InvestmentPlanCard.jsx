import React, { useCallback } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SipCalculatorForm from "../../investment/components/SipCalculatorForm";
import LumpsumCalculatorForm from "../../investment/components/LumpsumCalculatorForm";
import StepUpSipCalculatorForm from "../../investment/components/StepUpSipCalculatorForm";
import SwpCalculatorForm from "../../investment/components/SwpCalculatorForm";
import FdCalculatorForm from "../../investment/components/FdCalculatorForm";

const InvestmentPlanCard = ({
  plan,
  handlePlanChange,
  handleRemovePlan,
  formatAmount,
  targetAmount, // Add targetAmount to props
}) => {
  const handleCalculate = useCallback(
    (results) => {
      if (!results) return;

      const investedAmount =
        results.totalInvestment ??
        results.principal ??
        results.investedAmount ??
        0;
      const estimatedReturns =
        results.totalReturns ??
        results.totalInterest ??
        results.estimatedReturns ??
        0;
      const totalValue =
        results.futureValue ??
        results.maturityAmount ??
        results.totalValue ??
        0;

      let monthlyContribution = 0;
      if (plan.type === "sip" || plan.type === "stepUpSip") {
        monthlyContribution =
          plan.monthlyInvestment ??
          plan.amount ??
          results.monthlyInvestment ??
          0;
      }

      if (plan.investedAmount !== investedAmount) {
        handlePlanChange(plan.id, "investedAmount", investedAmount);
      }
      if (plan.estimatedReturns !== estimatedReturns) {
        handlePlanChange(plan.id, "estimatedReturns", estimatedReturns);
      }
      if (plan.totalValue !== totalValue) {
        handlePlanChange(plan.id, "totalValue", totalValue);
      }
      if (plan.monthlyContribution !== monthlyContribution) {
        handlePlanChange(plan.id, "monthlyContribution", monthlyContribution);
      }
    },
    [
      plan.id,
      plan.type,
      plan.monthlyInvestment,
      plan.amount,
      plan.investedAmount,
      plan.estimatedReturns,
      plan.totalValue,
      plan.monthlyContribution,
      handlePlanChange,
    ]
  );

  return (
    <Box sx={{ border: "1px solid #ddd", p: 2, mb: 2, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item xs={10} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Plan Type</InputLabel>
            <Select
              value={plan.type}
              label="Plan Type"
              onChange={(e) => handlePlanChange(plan.id, "type", e.target.value)}
            >
              <MenuItem value="sip">SIP</MenuItem>
              <MenuItem value="lumpsum">Lumpsum</MenuItem>
              <MenuItem value="stepUpSip">Step-Up SIP</MenuItem>
              <MenuItem value="swp">SWP</MenuItem>
              <MenuItem value="fd">Fixed Deposit</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <IconButton
            aria-label="delete"
            onClick={() => handleRemovePlan(plan.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold">
                {plan.details}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Invested:{" "}
                <Typography component="span" fontWeight="bold" color="primary">
                  ₹{formatAmount(plan.investedAmount)}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Returns:{" "}
                <Typography
                  component="span"
                  fontWeight="bold"
                  color="success.main"
                >
                  ₹{formatAmount(plan.estimatedReturns)}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Total Value:{" "}
                <Typography
                  component="span"
                  fontWeight="bold"
                  color="text.primary"
                >
                  ₹{formatAmount(plan.totalValue)}
                </Typography>
              </Typography>
            </Grid>
            {targetAmount && ( // Display target amount if available
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Target Amount:{" "}
                  <Typography
                    component="span"
                    fontWeight="bold"
                    color="info.main"
                  >
                    ₹{formatAmount(targetAmount)}
                  </Typography>
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ mt: 2 }}>
        {plan.type === "sip" && (
          <SipCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
          />
        )}
        {plan.type === "lumpsum" && (
          <LumpsumCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
          />
        )}
        {plan.type === "stepUpSip" && (
          <StepUpSipCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
          />
        )}
        {plan.type === "swp" && (
          <SwpCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
          />
        )}
        {plan.type === "fd" && (
          <FdCalculatorForm
            sharedState={plan}
            onSharedStateChange={(field, value) =>
              handlePlanChange(plan.id, field, value)
            }
            onCalculate={handleCalculate}
          />
        )}
      </Box>
    </Box>
  );
};

export default InvestmentPlanCard;
