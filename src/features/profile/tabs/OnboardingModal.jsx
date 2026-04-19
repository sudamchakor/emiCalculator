import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel,
  Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid, IconButton, List, ListItem, ListItemText, Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { addIncome, addExpense, addTemplateGoal, addGoal } from "../../../store/profileSlice";
import SliderInput from "../../../components/common/SliderInput";
import GoalForm from "../components/GoalForm";

const steps = ["Add Income", "Add Expenses", "Set Goals"];

export default function OnboardingModal({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  
  const currentYear = new Date().getFullYear();

  const [income, setIncome] = useState({ name: "", amount: "", frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
  const [incomesList, setIncomesList] = useState([]);

  const [expense, setExpense] = useState({ name: "", amount: "", category: "basic", frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
  const [expensesList, setExpensesList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [showCustomGoalForm, setShowCustomGoalForm] = useState(false);
  const [customGoalData, setCustomGoalData] = useState({ name: "", targetAmount: 0, targetYear: currentYear + 5, category: "general", investmentPlans: [] });


  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinish = () => {
    incomesList.forEach((inc) =>
      dispatch(addIncome({ ...inc, id: Date.now() + Math.random() }))
    );
    expensesList.forEach((exp) =>
      dispatch(addExpense({ ...exp, id: Date.now() + Math.random() }))
    );
    goalsList.forEach((goal) => {
      if (goal.isCustom) {
        dispatch(addGoal({ ...goal, id: Date.now() + Math.random() }));
      } else {
        dispatch(addTemplateGoal(goal));
      }
    });
    localStorage.setItem("isProfileCreated", "true");
    onClose();
  };

  const handleAddIncome = () => {
    if (income.name && income.amount) {
      setIncomesList([...incomesList, { ...income, amount: Number(income.amount) }]);
      setIncome({ name: "", amount: "", frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
    }
  };

  const handleAddExpense = () => {
    if (expense.name && expense.amount) {
      setExpensesList([...expensesList, { ...expense, amount: Number(expense.amount) }]);
      setExpense({ name: "", amount: "", category: "basic", frequency: "monthly", startYear: currentYear, endYear: currentYear + 10 });
    }
  };

  const handleAddPredefinedGoal = (type, expensesAmt) => {
    if (!goalsList.some(g => g.type === type)) {
      setGoalsList([...goalsList, { type, monthlyExpenses: expensesAmt || 30000 }]);
    }
  };

  const handleAddCustomGoal = (goalData) => {
    setGoalsList([...goalsList, { ...goalData, isCustom: true }]);
    setShowCustomGoalForm(false);
    setCustomGoalData({ name: "", targetAmount: 0, targetYear: currentYear + 5, category: "general", investmentPlans: [] });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Add your main income sources to get started.</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Income Source (e.g., Salary)" value={income.name} onChange={(e) => setIncome({ ...income, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Amount" value={Number(income.amount) || 0} onChange={(val) => setIncome({ ...income, amount: val })} min={0} max={10000000} step={1000} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select value={income.frequency} label="Frequency" onChange={(e) => setIncome({ ...income, frequency: e.target.value })}>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <SliderInput label="Start Year" value={income.startYear} onChange={(val) => setIncome({ ...income, startYear: val })} min={currentYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SliderInput label="End Year" value={income.endYear} onChange={(val) => setIncome({ ...income, endYear: val })} min={income.startYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" fullWidth onClick={handleAddIncome} disabled={!income.name || !income.amount}>Add</Button>
              </Grid>
            </Grid>
            {incomesList.length > 0 && (
              <List dense sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {incomesList.map((inc, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => setIncomesList(incomesList.filter((_, i) => i !== index))}><DeleteIcon /></IconButton>
                  }>
                    <ListItemText primary={inc.name} secondary={`${inc.amount} (${inc.frequency})`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Add your monthly expenses to calculate your investable surplus.</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Expense Name" value={expense.name} onChange={(e) => setExpense({ ...expense, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Amount" value={Number(expense.amount) || 0} onChange={(val) => setExpense({ ...expense, amount: val })} min={0} max={1000000} step={500} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={expense.category} label="Category" onChange={(e) => setExpense({ ...expense, category: e.target.value })}>
                    <MenuItem value="basic">Basic Need</MenuItem>
                    <MenuItem value="discretionary">Discretionary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select value={expense.frequency} label="Frequency" onChange={(e) => setExpense({ ...expense, frequency: e.target.value })}>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="Start Year" value={expense.startYear} onChange={(val) => setExpense({ ...expense, startYear: val })} min={currentYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SliderInput label="End Year" value={expense.endYear} onChange={(val) => setExpense({ ...expense, endYear: val })} min={expense.startYear} max={currentYear + 50} step={1} showInput={true} />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" fullWidth onClick={handleAddExpense} disabled={!expense.name || !expense.amount}>Add</Button>
              </Grid>
            </Grid>
            {expensesList.length > 0 && (
              <List dense sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {expensesList.map((exp, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => setExpensesList(expensesList.filter((_, i) => i !== index))}><DeleteIcon /></IconButton>
                  }>
                    <ListItemText primary={exp.name} secondary={`${exp.amount} (${exp.category})`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );
      case 2:
        const basicExpenses = expensesList
          .filter((exp) => exp.category === "basic")
          .reduce((sum, exp) => sum + Number(exp.amount), 0);

        return (
          <Box sx={{ mt: 3 }}>
            {showCustomGoalForm ? (
              <Box>
                 <GoalForm
                   goal={customGoalData}
                   currentYear={currentYear}
                   onSave={setCustomGoalData}
                 />
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                   <Button onClick={() => setShowCustomGoalForm(false)}>Cancel</Button>
                   <Button variant="contained" onClick={() => handleAddCustomGoal(customGoalData)} disabled={!customGoalData.name || !customGoalData.targetAmount}>Add Custom Goal</Button>
                 </Box>
              </Box>
            ) : (
              <>
                <Typography variant="subtitle1" gutterBottom>Select a predefined goal or create a custom one.</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={3}>
                    <Button variant="outlined" fullWidth onClick={() => handleAddPredefinedGoal("retirement")} sx={{ height: "100%", py: 2 }}>
                      🎯 Retirement
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button variant="outlined" fullWidth onClick={() => handleAddPredefinedGoal("education")} sx={{ height: "100%", py: 2 }}>
                      🎓 Child's Education
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button variant="outlined" fullWidth onClick={() => handleAddPredefinedGoal("emergencyFund", basicExpenses || 30000)} sx={{ height: "100%", py: 2 }}>
                      🛟 Emergency Fund
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button variant="contained" color="secondary" fullWidth onClick={() => setShowCustomGoalForm(true)} sx={{ height: "100%", py: 2 }}>
                      ➕ Custom Goal
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}

            {goalsList.length > 0 && (
              <List dense sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                {goalsList.map((goal, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => setGoalsList(goalsList.filter((_, i) => i !== index))}><DeleteIcon /></IconButton>
                  }>
                    <ListItemText primary={goal.isCustom ? goal.name : goal.type === 'retirement' ? 'Retirement' : goal.type === 'education' ? "Child's Education" : goal.type === 'emergencyFund' ? 'Emergency Fund' : 'Vacation Goal'} secondary={goal.isCustom ? `Target: ${goal.targetAmount}` : `Estimate: ${goal.monthlyExpenses || 30000}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Welcome! Let's Setup Your Profile</DialogTitle>
      <Divider />
      <DialogContent sx={{ minHeight: 280, pb: showCustomGoalForm ? 10 : 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>{steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}</Stepper>
        {renderStepContent(activeStep)}
      </DialogContent>
      {!showCustomGoalForm && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Skip</Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep > 0 && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
          {activeStep === steps.length - 1 ? (<Button onClick={handleFinish} variant="contained" color="primary">Finish</Button>) : (<Button onClick={handleNext} variant="contained">Next</Button>)}
        </DialogActions>
      )}
    </Dialog>
  );
}