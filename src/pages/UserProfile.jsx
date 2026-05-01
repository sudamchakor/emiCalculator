import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Alert,
  Link,
  useTheme,
  alpha,
  Container,
  Stack,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  selectCurrentSurplus,
  selectDebtFreeCountdown,
} from "../store/profileSlice";
import { selectCurrency } from "../store/emiSlice";

// Feature Tabs
import PersonalProfileTab from "../features/profile/tabs/PersonalProfileTab";
import FutureGoalsTab from "../features/profile/tabs/FutureGoalsTab";
import WealthTab from "../features/profile/tabs/WealthTab";
import OnboardingModal from "../features/profile/tabs/OnboardingModal";
import FinancialModal from "../features/profile/components/FinancialModal";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function UserProfile() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Tab Logic
  const getTabIndex = (tabParam) => {
    const map = { goals: 1, wealth: 2 };
    return map[tabParam] || 0;
  };

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");

  const [tabValue, setTabValue] = useState(() => getTabIndex(tabParam));
  const [goalToEditId, setGoalToEditId] = useState(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Profile Status
  const [isProfileCreated, setIsProfileCreated] = useState(
    localStorage.getItem("isProfileCreated") === "true",
  );

  useEffect(() => {
    setTabValue(getTabIndex(tabParam));
    if (tabParam !== "goals") setGoalToEditId(null);
  }, [tabParam]);

  const handleTabChange = (event, newValue) => {
    const tabs = ["personal", "goals", "wealth"];
    navigate(`/profile?tab=${tabs[newValue]}`);
    setGoalToEditId(null);
  };

  const handleEditGoal = (goalId) => {
    setGoalToEditId(goalId);
    navigate(`/profile?tab=goals`);
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  // Data Selectors
  const investableSurplus = useSelector(selectCurrentSurplus);
  const debtFreeCountdown = useSelector(selectDebtFreeCountdown);
  const currency = useSelector(selectCurrency);

  const isDeficit = investableSurplus < 0;

  return (
    <Box sx={{ width: "100%", pb: 10 }}>
      {/* 1. Integrated Action Banner */}
      {!isProfileCreated && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "warning.main",
            bgcolor: alpha(theme.palette.warning.main, 0.05),
            fontWeight: 600,
          }}
        >
          Your dashboard is in preview mode.{" "}
          <Link
            component="button"
            onClick={() => setOnboardingOpen(true)}
            sx={{
              fontWeight: 800,
              color: "warning.dark",
              textDecoration: "underline",
            }}
          >
            Create your full profile
          </Link>{" "}
          to unlock wealth projections.
        </Alert>
      )}

      {/* 2. Command Center Navigation (Tabs) */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: alpha(theme.palette.divider, 0.1),
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2,
          mb: 1,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          sx={{
            minHeight: 48,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              backgroundColor: "primary.main",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          <Tab label="My Profile" />
          <Tab label="Financial Goals" />
          <Tab label="Wealth Dashboard" />
        </Tabs>
      </Box>

      {/* 3. Tab Content Area */}
      <Box>
        <CustomTabPanel value={tabValue} index={0}>
          <PersonalProfileTab
            onEditGoal={handleEditGoal}
            onOpenModal={handleModalOpen}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <FutureGoalsTab goalToEditId={goalToEditId} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <WealthTab />
        </CustomTabPanel>
      </Box>

      {/* Modals */}
      <OnboardingModal
        open={onboardingOpen}
        onClose={() => {
          setOnboardingOpen(false);
          setIsProfileCreated(
            localStorage.getItem("isProfileCreated") === "true",
          );
        }}
      />
      <FinancialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />

      {/* 4. High-End Sticky Status Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          p: 1.5,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ p: "0 !important" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-around",
              alignItems: "center",
              gap: { xs: 1, sm: 4 },
              py: 2,
              px: 4,
              borderRadius: { xs: 0, sm: 4 },
              // Glassmorphism + Themed Gradient
              background: isDeficit
                ? `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              backdropFilter: "blur(10px)",
              color: "white",
              boxShadow: `0 8px 32px ${alpha(isDeficit ? theme.palette.error.main : theme.palette.primary.main, 0.4)}`,
              border: `1px solid ${alpha("#fff", 0.2)}`,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Monthly Surplus
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                {currency}{" "}
                {Math.round(investableSurplus).toLocaleString("en-IN")}
              </Typography>
            </Stack>

            <Box
              sx={{
                width: "1px",
                height: "24px",
                bgcolor: alpha("#fff", 0.3),
                display: { xs: "none", sm: "block" },
              }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Debt-Free In
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                {debtFreeCountdown}
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
