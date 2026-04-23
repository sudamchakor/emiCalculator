import React from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SliderInput from "../../../components/common/SliderInput"; // Corrected path

const InvestmentPlanInput = ({ plan, index, handlePlanChange, handleRemovePlan, isRemovable }) => {
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        p: 2,
        mb: 2,
        position: "relative",
        display: "flex", // Added for responsiveness
        flexDirection: "column", // Added for responsiveness
        gap: 1.5, // Added for consistent spacing between elements
      }}
    >
      <Typography variant="subtitle1">
        Plan {index + 1}
      </Typography>
      {isRemovable && (
        <IconButton
          aria-label="remove plan"
          onClick={() => handleRemovePlan(plan.id)}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <RemoveCircleOutlineIcon color="error" />
        </IconButton>
      )}
      <FormControl size="small" fullWidth>
        <InputLabel>Investment Type</InputLabel>
        <Select
          value={plan.type}
          label="Investment Type"
          onChange={(e) =>
            handlePlanChange(plan.id, "type", e.target.value)
          }
        >
          <MenuItem value="sip">Standard SIP</MenuItem>
          <MenuItem value="lumpsum">Lumpsum</MenuItem>
          <MenuItem value="stepUpSip">Step-Up SIP</MenuItem> {/* Corrected type name */}
          <MenuItem value="swp">SWP</MenuItem>
          <MenuItem value="fd">Fixed Deposit</MenuItem>
        </Select>
      </FormControl>

      {/* Common inputs for most plans */}
      {(plan.type === "sip" || plan.type === "lumpsum" || plan.type === "stepUpSip" || plan.type === "swp") && (
        <SliderInput
          label="Expected Return Rate"
          value={Number(plan.expectedReturnRate) || 0}
          onChange={(val) => handlePlanChange(plan.id, "expectedReturnRate", val)}
          min={0}
          max={30}
          step={0.1}
          showInput={true}
          unit="%"
        />
      )}

      {(plan.type === "sip" || plan.type === "lumpsum" || plan.type === "stepUpSip" || plan.type === "swp" || plan.type === "fd") && (
        <SliderInput
          label="Time Period"
          value={Number(plan.timePeriod) || 0}
          onChange={(val) => handlePlanChange(plan.id, "timePeriod", val)}
          min={1}
          max={50}
          step={1}
          showInput={true}
          unit="years"
        />
      )}

      {/* Specific inputs based on plan type */}
      {plan.type === "sip" && (
        <SliderInput
          label="Monthly Contribution"
          value={Number(plan.monthlyContribution) || 0}
          onChange={(val) => handlePlanChange(plan.id, "monthlyContribution", val)}
          min={0}
          max={1000000}
          step={500}
          showInput={true}
          unit="₹"
        />
      )}

      {plan.type === "lumpsum" && (
        <SliderInput
          label="Total Investment"
          value={Number(plan.totalInvestment) || 0}
          onChange={(val) => handlePlanChange(plan.id, "totalInvestment", val)}
          min={0}
          max={100000000}
          step={1000}
          showInput={true}
          unit="₹"
        />
      )}

      {plan.type === "stepUpSip" && (
        <>
          <SliderInput
            label="Monthly Contribution"
            value={Number(plan.monthlyContribution) || 0}
            onChange={(val) => handlePlanChange(plan.id, "monthlyContribution", val)}
            min={0}
            max={1000000}
            step={500}
            showInput={true}
            unit="₹"
          />
          <SliderInput
            label="Annual Step-Up Percentage"
            value={Number(plan.stepUpPercentage) || 0}
            onChange={(val) => handlePlanChange(plan.id, "stepUpPercentage", val)}
            min={0}
            max={20}
            step={0.5}
            showInput={true}
            unit="%"
          />
        </>
      )}

      {plan.type === "swp" && (
        <>
          <SliderInput
            label="Total Investment (Corpus)"
            value={Number(plan.totalInvestment) || 0}
            onChange={(val) => handlePlanChange(plan.id, "totalInvestment", val)}
            min={0}
            max={100000000}
            step={1000}
            showInput={true}
            unit="₹"
          />
          <SliderInput
            label="Monthly Withdrawal"
            value={Number(plan.withdrawalPerMonth) || 0}
            onChange={(val) => handlePlanChange(plan.id, "withdrawalPerMonth", val)}
            min={0}
            max={1000000}
            step={100}
            showInput={true}
            unit="₹"
          />
        </>
      )}

      {plan.type === "fd" && (
        <>
          <SliderInput
            label="Principal Amount"
            value={Number(plan.principalAmount) || 0}
            onChange={(val) => handlePlanChange(plan.id, "principalAmount", val)}
            min={0}
            max={100000000}
            step={1000}
            showInput={true}
            unit="₹"
          />
          <SliderInput
            label="Interest Rate"
            value={Number(plan.interestRate) || 0}
            onChange={(val) => handlePlanChange(plan.id, "interestRate", val)}
            min={0}
            max={15}
            step={0.1}
            showInput={true}
            unit="%"
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Compounding Frequency</InputLabel>
            <Select
              value={plan.compoundingFrequency}
              label="Compounding Frequency"
              onChange={(e) =>
                handlePlanChange(plan.id, "compoundingFrequency", e.target.value)
              }
            >
              <MenuItem value="annually">Annually</MenuItem>
              <MenuItem value="semi-annually">Semi-Annually</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={plan.isSafe}
            onChange={(e) =>
              handlePlanChange(plan.id, "isSafe", e.target.checked)
            }
            name={`isSafe-${plan.id}`}
            color="primary"
          />
        }
        label="Safe Investment Option"
      />
    </Box>
  );
};

export default InvestmentPlanInput;
