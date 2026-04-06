import React from "react";
import {
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./FAQ.scss";

const FAQ = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom className="faq-title">
        Frequently Asked Questions
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>How is the EMI calculated?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            EMI (Equated Monthly Installment) is calculated using the standard
            formula:
            <br />
            <code>E = P x r x (1 + r)^n / ((1 + r)^n - 1)</code>
            <br />
            Where:
            <ul>
              <li>
                <strong>E</strong> is EMI
              </li>
              <li>
                <strong>P</strong> is Principal Loan Amount
              </li>
              <li>
                <strong>r</strong> is rate of interest calculated on monthly
                basis (i.e., r = Rate of Annual interest/12/100)
              </li>
              <li>
                <strong>n</strong> is loan term / tenure / duration in number of
                months
              </li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            What are prepayments and how do they affect my loan?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Prepayments are extra payments made towards your loan principal over
            and above your regular EMI. By making prepayments, you reduce your
            outstanding principal faster, which in turn reduces the total
            interest you pay over the life of the loan. This can significantly
            shorten your loan tenure.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>What is Loan Margin or Down Payment?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The margin or down payment is the portion of the property's purchase
            price that you pay out of pocket, rather than financing through the
            loan. Typically, banks finance up to 80-90% of the property value,
            and the rest is paid as a down payment.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Does Home Loan Interest Rate vary?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, home loan interest rates can be fixed or floating. Floating
            interest rates change over time based on the lender's benchmark
            rate, whereas fixed rates remain constant for a specified period or
            the entire loan duration.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>What are property taxes and home insurance?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Property taxes are levied by your local government on your property.
            Home insurance protects your home against damages and is often
            required by lenders. Both can be substantial ongoing costs that
            should be factored into your budget.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Can I change my EMI amount later?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Generally, your regular EMI is fixed at the start of the loan.
            However, some banks offer step-up or step-down EMI options. Also, if
            the interest rate on a floating rate loan changes, you can request
            to alter your EMI or adjust the tenure.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default FAQ;
