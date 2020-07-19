import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function ComboBox({ options, onComboBoxChange }) {
  return (
    <Autocomplete
      id="combo-box"
      size="small"
      options={options}
      onChange={(event, value, reason) =>
        onComboBoxChange({ event, value, reason })
      }
      getOptionLabel={(options) => options}
      style={{ width: 400 }}
      renderInput={(params) => (
        <TextField {...params} label="Add country" variant="outlined" />
      )}
    />
  );
}
