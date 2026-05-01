import React, { useState } from "react";
import {
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ReadOnlyItem = (props) => {
  const {
    item,
    currency, // FIXED: Added currency to destructuring
    onDelete,
    onConfirmDelete,
    deletionImpactMessage,
    isExpense = false,
    isIncome = false,
    isBudgetExceeded = false,
    budgetWarning = "",
    totalIncome = 0,
    expenseRatio,
    getExpenseColor,
    formatCurrency,
    isReadOnly = false,
    isGoal = false,
    onEditGoal,
    onEdit, // Added a generic onEdit prop for non-goal items
    onClick,
    subItems = [],
  } = props;

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleEditClick = (event) => {
    event.stopPropagation();
    if (isGoal && onEditGoal) {
      onEditGoal(item.id);
    } else if (onEdit) { // If it's not a goal, and onEdit is provided, call it
      onEdit(item.id); // Assuming onEdit will take the item's ID
    }
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleConfirmDelete = () => {
    if (onConfirmDelete) {
      onConfirmDelete(item.id);
    } else if (onDelete) {
      onDelete(item.id);
    }
    handleCloseConfirmDelete();
  };

  const getItemColor = () => {
    if (isIncome) return "#2e7d32";
    if (item.id === "home-loan-emi") return "#d32f2f";
    if (item.category === "basic") return "#0288d1";
    if (item.category === "discretionary") return "#ed6c02";
    return "#7b1fa2"; // Goals color
  };

  const itemColor = getItemColor();

  const renderItemContent = () => (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 800, color: "#333", lineHeight: 1.2 }}
        >
          {item.name || item.label}
          {isGoal && subItems.length > 0 && ` (${subItems.length} plans)`}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color:
                isExpense && getExpenseColor
                  ? getExpenseColor()
                  : "primary.main",
            }}
          >
            {formatCurrency(item.amount)}
            <Typography
              component="span"
              variant="caption"
              color="textSecondary"
              sx={{ fontWeight: 600, ml: 0.5 }}
            >
              / {item.frequency || "monthly"}
            </Typography>
          </Typography>

          {isExpense && totalIncome > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                bgcolor: "#f5f5f5",
                px: 0.8,
                borderRadius: 1,
              }}
            >
              {expenseRatio ? expenseRatio.toFixed(1) : 0}% of income
            </Typography>
          )}
        </Stack>
      </Box>

      <Stack direction="row" spacing={0.5} alignItems="center">
        {((!isReadOnly && onEdit) || (isGoal && onEditGoal)) && (
          <IconButton
            size="small"
            onClick={handleEditClick}
            sx={{ bgcolor: "#f0f7ff", color: "primary.main" }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
        {(item.id === "home-loan-emi" ||
          (!isReadOnly && (onConfirmDelete || onDelete))) && (
          <IconButton
            size="small"
            onClick={handleDeleteClick}
            sx={{ bgcolor: "#fff0f0", color: "error.main" }}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );

  const tileStyle = {
    borderRadius: "4px 8px 8px 4px !important",
    bgcolor: isBudgetExceeded ? "#fff5f5" : "white",
    border: isBudgetExceeded ? "1px solid #ffcdd2" : "1px solid #f0f0f0",
    borderLeft: `5px solid ${itemColor} !important`,
    boxShadow: "none",
    transition: "0.2s",
    "&:hover": { bgcolor: "#f8faff" },
    "&:before": { display: "none" },
  };

  return (
    <>
      {isGoal ? (
        <Accordion elevation={0} sx={tileStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ p: 1.5, "& .MuiAccordionSummary-content": { m: 0 } }}
          >
            {renderItemContent()}
          </AccordionSummary>
          <AccordionDetails
            sx={{ bgcolor: "#fafafa", p: 1.5, borderTop: "1px solid #f0f0f0" }}
          >
            <Stack spacing={1.5}>
              {subItems.length > 0 ? (
                subItems.map((sub) => (
                  <ReadOnlyItem
                    key={sub.id}
                    item={sub}
                    currency={currency} // currency is now defined
                    isExpense={true}
                    totalIncome={totalIncome}
                    expenseRatio={
                      totalIncome > 0 ? (sub.amount / totalIncome) * 100 : 0
                    }
                    formatCurrency={formatCurrency}
                    isReadOnly={true}
                    onClick={() => onEditGoal(sub.goalId)}
                  />
                ))
              ) : (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ p: 1 }}
                >
                  No linked plans found.
                </Typography>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Box sx={{ ...tileStyle, p: 1.5, display: "flex" }} onClick={onClick}>
          {renderItemContent()}
        </Box>
      )}

      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary", fontWeight: 500 }}>
            Are you sure you want to delete "{item.name || item.label}"?
            <br />
            <br />
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#fff4f4",
                borderRadius: 2,
                borderLeft: "4px solid #d32f2f",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: "#d32f2f",
                  display: "block",
                  mb: 0.5,
                }}
              >
                IMPACT
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {deletionImpactMessage ||
                  "This item will be permanently removed from calculations."}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseConfirmDelete}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Delete Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReadOnlyItem;
