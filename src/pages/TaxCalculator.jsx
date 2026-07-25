import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, CssBaseline } from '@mui/material';
import SuspenseFallback from '../components/common/SuspenseFallback';

const TaxDashboard = lazy(() => import('./TaxDashboard'));

const TaxCalculator = () => {
  return (
    <>
      <Helmet>
        <title>Income Tax Planner Old vs New Regime 2025-26 | SmartFund Manager</title>
        <meta
          name="description"
          content="Compare the old and new income tax regimes for 2025-26 and plan deductions with SmartFund Manager."
        />
        <meta
          name="keywords"
          content="Income Tax Planner, Old vs New Regime 2025-26, Tax Saving Calculator"
        />
      </Helmet>
      <Box>
        <CssBaseline />
        <Suspense fallback={<SuspenseFallback />}>
          <TaxDashboard />
        </Suspense>
      </Box>
    </>
  );
};

export default TaxCalculator;
