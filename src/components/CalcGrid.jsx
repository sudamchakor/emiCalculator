import React from "react";
import { Grid, Typography } from "@mui/material";

const CalcGrid = ({ label, currency, value, variant, color = "" }) => {
  return (
    <>
      <Grid item xs={8}>
        <Typography variant={variant}>{label}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant={variant} align="right" color={color}>
          {currency}
          {value}
        </Typography>
      </Grid>
    </>
  );
};

export default CalcGrid;
