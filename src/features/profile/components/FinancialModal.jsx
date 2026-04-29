import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import IncomeExpenseForm from "../../../components/common/IncomeExpenseForm";
import { addIncome, addExpense } from "../../../store/profileSlice";
import { addAsset } from "../../corpus/corpusSlice";

const CorpusForm = ({ onSave, onCancel }) => {
  const [newAsset, setNewAsset] = useState({
    label: "",
    value: "",
    expectedReturn: "",
    category: "Equity",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleSave = () => {
    if (newAsset.label && newAsset.value && newAsset.expectedReturn) {
      onSave(newAsset);
    }
  };

  return (
    <>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="label"
          label="Asset Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newAsset.label}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="value"
          label="Current Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={newAsset.value}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <Typography>₹</Typography>,
          }}
        />
        <TextField
          margin="dense"
          name="expectedReturn"
          label="Expected Return"
          type="number"
          fullWidth
          variant="outlined"
          value={newAsset.expectedReturn}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: <Typography>%</Typography>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Add
        </Button>
      </DialogActions>
    </>
  );
};

export default function FinancialModal({ open, onClose, type }) {
  const dispatch = useDispatch();

  const getTitle = () => {
    switch (type) {
      case "income":
        return "Add New Income";
      case "expense":
        return "Add New Expense";
      case "corpus":
        return "Add New Asset";
      default:
        return "";
    }
  };

  const handleSave = (formData) => {
    const payload = { ...formData, id: Date.now() };
    switch (type) {
      case "income":
        dispatch(addIncome(payload));
        break;
      case "expense":
        dispatch(addExpense(payload));
        break;
      case "corpus":
        dispatch(
          addAsset(
            payload.label,
            payload.value,
            payload.expectedReturn,
            payload.category,
          ),
        );
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      {type === "corpus" ? (
        <CorpusForm onSave={handleSave} onCancel={onClose} />
      ) : (
        <DialogContent>
          <IncomeExpenseForm
            isExpense={type === "expense"}
            onSave={handleSave}
            onCancel={onClose}
            submitLabel="Add"
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
