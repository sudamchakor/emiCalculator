import React from "react";
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Grid,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useSelector } from "react-redux";
import {
  selectName,
  selectOccupation,
  selectRiskTolerance,
  selectCareerGrowthRate,
  selectGeneralInflationRate,
} from "../../../store/profileSlice";

const InfoItem = ({ label, value, icon, tooltip }) => (
  <Grid item xs={6}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        textTransform: "uppercase",
        fontWeight: 500,
      }}
    >
      {icon}
      {label}
      {tooltip && (
        <Tooltip title={tooltip}>
          <InfoIcon fontSize="inherit" sx={{ opacity: 0.6 }} />
        </Tooltip>
      )}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      {value}
    </Typography>
  </Grid>
);

const RiskToleranceBadge = ({ riskTolerance }) => {
  const getRiskColor = (risk) => {
    const lowerRisk = risk?.toLowerCase();
    if (lowerRisk === "low") {
      return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
    }
    if (lowerRisk === "medium") {
      return { backgroundColor: "#fff3e0", color: "#ef6c00" };
    }
    if (lowerRisk === "high") {
      return { backgroundColor: "#ffebee", color: "#c62828" };
    }
    return { backgroundColor: "#f5f5f5", color: "#616161" };
  };

  const style = getRiskColor(riskTolerance);

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          textTransform: "uppercase",
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        Risk Tolerance
      </Typography>
      <Chip
        label={riskTolerance || "N/A"}
        sx={{ ...style, fontWeight: "bold", borderRadius: "6px" }}
      />
    </Box>
  );
};

const RetirementTimeline = ({ currentAge, retirementAge }) => {
  const yearsLeft = retirementAge - currentAge;
  const careerStartAge = 25;
  const totalCareerSpan = retirementAge - careerStartAge;
  const yearsCompleted = currentAge - careerStartAge;
  const progress =
    totalCareerSpan > 0 ? (yearsCompleted / totalCareerSpan) * 100 : 0;

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Current Age: <strong>{currentAge}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Retirement: <strong>{retirementAge}</strong>
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", textAlign: "center", mt: 1.5 }}
      >
        {yearsLeft} Years Left to Retire
      </Typography>
    </Box>
  );
};

export default function BasicInfoDisplay({
  currentAge,
  retirementAge,
  onEdit,
}) {
  const name = useSelector(selectName) || "Sudam Chakor";
  const occupation = useSelector(selectOccupation) || "Salaried Professional";
  const riskTolerance = useSelector(selectRiskTolerance);
  const careerGrowthRate = useSelector(selectCareerGrowthRate);
  const generalInflationRate = useSelector(selectGeneralInflationRate);

  return (
    <>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {occupation}
        </Typography>
      </Box>

      <RetirementTimeline
        currentAge={currentAge}
        retirementAge={retirementAge}
      />

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RiskToleranceBadge riskTolerance={riskTolerance} />
        </Grid>
        <InfoItem
          label="Career Growth"
          value={`${(careerGrowthRate * 100).toFixed(1)}%`}
          icon={<TrendingUpIcon fontSize="inherit" />}
        />
        <InfoItem
          label="Inflation Rate"
          value={`${(generalInflationRate * 100).toFixed(1)}%`}
          icon={<GraphicEqIcon fontSize="inherit" />}
        />
      </Grid>
    </>
  );
}
