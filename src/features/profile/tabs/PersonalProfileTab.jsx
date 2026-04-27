import React, { useState } from "react";
import {
  Grid,
  Fab,
  Modal,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BasicInfoDisplay from "../components/BasicInfoDisplay";
import BasicInfoEdit from "../components/BasicInfoEdit";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProfileExpenses,
  selectCurrentAge,
  selectRetirementAge,
  setCurrentAge,
  setRetirementAge,
  selectTotalMonthlyGoalContributions,
  selectIndividualGoalInvestmentContributions,
  selectGoals,
  selectCurrentSurplus,
  selectCareerGrowthRate,
  selectIncomes,
  selectGeneralInflationRate,
} from "../../../store/profileSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";
import IncomeSection from "../components/IncomeSection";
import ExpenseSection from "../components/ExpenseSection";
import CashFlowDonutChart from "../components/CashFlowDonutChart";
import ProjectedCashFlowChart from "../components/ProjectedCashFlowChart";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "50%" },
  maxHeight: "90vh",
  overflowY: "auto",
  // Removed bgcolor, boxShadow, p, borderRadius from here
};

export default function PersonalProfileTab({ onEditGoal }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const expenses = useSelector(selectProfileExpenses) || [];
  const incomes = useSelector(selectIncomes) || [];
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);
  const careerGrowthRate =
    typeof careerGrowthRaw === "object"
      ? careerGrowthRaw.value
      : careerGrowthRaw || 0;
  const careerGrowthType =
    typeof careerGrowthRaw === "object" ? careerGrowthRaw.type : "percentage";
  const generalInflationRate = useSelector(selectGeneralInflationRate) || 0.06;

  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);
  const emiState = useSelector(
    (state) => state.emi || state.emiCalculator || {},
  );

  const totalMonthlyGoalContributions = useSelector(
    selectTotalMonthlyGoalContributions,
  );
  const individualGoalInvestments = useSelector(
    selectIndividualGoalInvestmentContributions,
  );
  const investableSurplus = useSelector(selectCurrentSurplus);
  const goals = useSelector(selectGoals) || [];

  const needsValue = expenses
    .filter((e) => e.category === "basic")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const wantsValue = expenses
    .filter((e) => e.category === "discretionary")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const donutData = [
    {
      name: "Needs",
      value: needsValue,
    },
    {
      name: "Wants",
      value: wantsValue,
    },
    { name: "Loan EMIs", value: monthlyEmi || 0 },
    {
      name: "Future Wealth (Goals)",
      value: totalMonthlyGoalContributions,
    },
    {
      name: "Surplus",
      value: investableSurplus > 0 ? investableSurplus : 0,
    },
  ].filter((item) => item.value > 0);

  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'income' or 'expense'
  const [anchorEl, setAnchorEl] = useState(null); // For the FAB menu

  const handleSaveBasicInfo = (newCurrentAge, newRetirementAge) => {
    dispatch(setCurrentAge(newCurrentAge));
    dispatch(setRetirementAge(newRetirementAge));
    setEditingBasicInfo(false);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpenModal(true);
    handleCloseMenu(); // Close the FAB menu when a modal is opened
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalType(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {editingBasicInfo ? (
          <BasicInfoEdit
            currentAge={currentAge}
            retirementAge={retirementAge}
            onSave={handleSaveBasicInfo}
            onCancel={() => setEditingBasicInfo(false)}
          />
        ) : (
          <BasicInfoDisplay
            currentAge={currentAge}
            retirementAge={retirementAge}
            onEdit={() => setEditingBasicInfo(true)}
          />
        )}
      </Grid>

      {/* Always render IncomeSection and ExpenseSection for their lists and forms on larger screens */}
      {/* On small screens, these sections will only display their lists, and forms will be in modals */}
      <Grid item xs={12} md={6}>
        <IncomeSection isSmallScreen={isSmallScreen} />
      </Grid>
      <Grid item xs={12} md={6}>
        <CashFlowDonutChart donutData={donutData} />
      </Grid>
      <Grid item xs={12}>
        <ExpenseSection onEditGoal={onEditGoal} isSmallScreen={isSmallScreen} />
      </Grid>
      <Grid item xs={12}>
        <ProjectedCashFlowChart
          currentAge={currentAge}
          retirementAge={retirementAge}
          careerGrowthRate={careerGrowthRate}
          careerGrowthType={careerGrowthType}
          monthlyEmi={monthlyEmi}
          emiState={emiState}
          individualGoalInvestments={individualGoalInvestments}
          goals={goals}
          expenses={expenses}
          incomes={incomes}
          inflationRate={generalInflationRate}
        />
      </Grid>

      {isSmallScreen && (
        <>
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 99999, // Added zIndex
            }}
            onClick={handleOpenMenu}
          >
            <AddIcon />
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleOpenModal("income")}>
              Add Income
            </MenuItem>
            <MenuItem onClick={() => handleOpenModal("expense")}>
              Add Expense
            </MenuItem>
          </Menu>
        </>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-item-modal-title"
        aria-describedby="add-item-modal-description"
      >
        <Box sx={modalStyle}>
          {/* The Typography and Button are still direct children of the Box,
              but the IncomeSection/ExpenseSection will now handle their own Paper styling. */}
          <Typography
            id="add-item-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            {modalType === "income" ? "Add New Income" : "Add New Expense"}
          </Typography>
          {modalType === "income" && (
            <IncomeSection isModal={true} onCloseModal={handleCloseModal} />
          )}
          {modalType === "expense" && (
            <ExpenseSection
              isModal={true}
              onCloseModal={handleCloseModal}
              onEditGoal={onEditGoal}
            />
          )}
          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
}
