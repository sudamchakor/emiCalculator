import React, { useState } from "react";
import {
  Grid,
} from "@mui/material";
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
} from "../../../store/profileSlice";
import { selectCalculatedValues } from "../../emiCalculator/utils/emiCalculator";
import IncomeSection from "../components/IncomeSection";
import ExpenseSection from "../components/ExpenseSection";
import CashFlowDonutChart from "../components/CashFlowDonutChart";
import ProjectedCashFlowChart from "../components/ProjectedCashFlowChart";

export default function PersonalProfileTab({ onEditGoal }) {
  const dispatch = useDispatch();

  const expenses = useSelector(selectProfileExpenses) || [];
  const incomes = useSelector(selectIncomes) || [];
  const currentAge = useSelector(selectCurrentAge) || 30;
  const retirementAge = useSelector(selectRetirementAge) || 60;
  const careerGrowthRaw = useSelector(selectCareerGrowthRate);
  const careerGrowthRate = typeof careerGrowthRaw === 'object' ? careerGrowthRaw.value : (careerGrowthRaw || 0);
  const careerGrowthType = typeof careerGrowthRaw === 'object' ? careerGrowthRaw.type : 'percentage';

  const { emi: monthlyEmi } = useSelector(selectCalculatedValues);
  const emiState = useSelector((state) => state.emi || state.emiCalculator || {});

  const totalMonthlyGoalContributions = useSelector(selectTotalMonthlyGoalContributions);
  const individualGoalInvestments = useSelector(selectIndividualGoalInvestmentContributions);
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

  const handleSaveBasicInfo = (newCurrentAge, newRetirementAge) => {
    dispatch(setCurrentAge(newCurrentAge));
    dispatch(setRetirementAge(newRetirementAge));
    setEditingBasicInfo(false);
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
      <Grid item xs={12} md={6}>
        <IncomeSection />
      </Grid>
      <Grid item xs={12} md={6}>
        <CashFlowDonutChart donutData={donutData} />
      </Grid>
      <ExpenseSection onEditGoal={onEditGoal} />
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
        />
      </Grid>
    </Grid>
  );
}
