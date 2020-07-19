import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

export const MyAccordion = ({ title, text }) => (
  <React.Fragment>
    <Accordion className="accordion">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1a-header">
        <Typography variant="subtitle1">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{text}</Typography>
      </AccordionDetails>
    </Accordion>
  </React.Fragment>
);
