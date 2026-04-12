import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setCurrentAge,
  setRetirementAge,
  setConsiderInflation,
  resetProfile,
} from "../store/profileSlice";
import { selectCalculatedValues, selectCurrency } from "../store/emiSlice";
import PersonalProfileTab from "../components/profile/PersonalProfileTab";
import FutureGoalsTab from "../components/profile/FutureGoalsTab";
import Settings from "../components/Settings";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfile() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabIndex = (tabParam) => {
    if (tabParam === "goals") return 1;
    if (tabParam === "settings") return 2;
    return 0; // Default is personal
  };

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");

  const [tabValue, setTabValue] = useState(() => getTabIndex(tabParam));

  useEffect(() => {
    setTabValue(getTabIndex(tabParam));
  }, [tabParam]);

  const handleTabChange = (event, newValue) => {
    let newTabName = "personal";
    if (newValue === 1) newTabName = "goals";
    if (newValue === 2) newTabName = "settings";
    navigate(`/profile?tab=${newTabName}`);
  };

  const { tenureInMonths, emi, schedule, taxesYearlyInRs } = useSelector(
    selectCalculatedValues,
  );
  const currency = useSelector(selectCurrency);

  // Get profile data for footer calculations
  const incomes = useSelector((state) => state.profile?.incomes) || [];
  const expenses = useSelector((state) => state.profile?.expenses) || [];
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMonthlyPayment =
    schedule?.length > 0
      ? schedule[0].totalPayment + (taxesYearlyInRs || 0) / 12
      : emi || 0;

  const investableSurplus = totalIncome - (totalExpenses + totalMonthlyPayment);
  const formatCurrency = (val) =>
    `${currency}${Number(val).toLocaleString("en-IN")}`;

  return (
    <Box sx={{ width: "100%", pb: 8 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
        >
          <Tab label="Personal Profile" />
          <Tab label="Future Goals" />
          <Tab label="Settings" />
        </Tabs>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => {
            dispatch(resetProfile());
            dispatch(setCurrentAge(30));
            dispatch(setRetirementAge(60));
            dispatch(setConsiderInflation(false));
          }}
          sx={{ mr: 2 }}
        >
          Reset to Defaults
        </Button>
      </Box>

      {/* Tab 1: Personal Profile */}
      <CustomTabPanel value={tabValue} index={0}>
        <PersonalProfileTab />
      </CustomTabPanel>

      {/* Tab 2: Future Goals */}
      <CustomTabPanel value={tabValue} index={1}>
        <FutureGoalsTab />
      </CustomTabPanel>

      {/* Tab 3: Settings */}
      <CustomTabPanel value={tabValue} index={2}>
        <Settings />
      </CustomTabPanel>

      {/* Persistent Impact Banner */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: investableSurplus < 0 ? "#b71c1c" : "primary.main",
          color: "white",
          p: 2,
          display: "flex",
          justifyContent: "space-around",
          zIndex: 1000,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6">
          Current Surplus:{" "}
          <strong>
            {formatCurrency(investableSurplus.toFixed(0))} / month
          </strong>
        </Typography>
        <Typography variant="h6">
          Debt-Free Countdown:{" "}
          <strong>{Math.ceil(tenureInMonths / 12)} years</strong>
        </Typography>
      </Box>
    </Box>
  );
}
