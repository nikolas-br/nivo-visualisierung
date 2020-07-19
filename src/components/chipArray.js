import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function ChipsArray({
  list,
  removeDataPoint,
  removeAllDataPoints,
}) {
  const classes = useStyles();

  const [chipData, setChipData] = React.useState(list);
  React.useEffect(() => setChipData(list), [list]);

  const handleDelete = (chipToDelete) => () => {
    const newChips = chipData.filter((chip) => chip.key !== chipToDelete.key);
    if (newChips.length < 1) return;

    setChipData(newChips);

    removeDataPoint(chipToDelete.label);
  };

  return (
    <div className="chipWrapper">
      {chipData.map((data) => {
        return (
          <li key={data.key}>
            <Chip
              style={{
                backgroundColor: data.color,
              }}
              label={data.label}
              onDelete={handleDelete(data)}
              className={classes.chip}
            />
          </li>
        );
      })}
      <li>
        <Chip
          variant="outlined"
          label="Remove all"
          color="secondary"
          onClick={removeAllDataPoints}
          className={classes.chip}
        />
      </li>
    </div>
  );
}
