import React from "react";
import { ResponsiveParallelCoordinates } from "@nivo/parallel-coordinates";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const theme = {
  axis: {
    textColor: "#eee",
    fontSize: "15px",
    tickColor: "#eee",
    domain: {
      line: {
        strokeWidth: 1,
        stroke: "#889eae",
      },
      ticks: {
        line: {
          stroke: "#bbb",
        },
        text: {
          fill: "#F00",
        },
      },
    },
    legend: {
      text: {
        fontSize: 15,
        fontWeight: 400,
      },
    },
  },
  legends: {
    text: {
      fill: "#999999",
      color: "#999999",
      fontSize: 11,
      fontWeight: 300,
    },
  },
};

export const MyResponsiveParallelCoordinates = ({ data, colors }) => (
  <ResponsiveParallelCoordinates
    data={data}
    variables={
      data.length < 1
        ? []
        : data
            .map((e) => Object.keys(e))[0]
            .map((e) => ({
              key: e,
              type: "linear",
              min: "auto",
              max: "auto",
              ticksPosition: "before",
              legend: e,
              legendPosition: "start",
              legendOffset: 20,
            }))
    }
    margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
    // colors={{ scheme: "category10" }}
    colors={colors}
    lineOpacity={0.8}
    theme={theme}
    strokeWidth={3}
    animate={true}
    motionStiffness={90}
    motionDamping={12}
  />
);

// const data2 = [
//   {
//     temp: 40,
//     cost: 222897,
//     volume: 1.5555461881642503,
//   },
//   {
//     temp: 15,
//     cost: 41852,
//     volume: 6.4609599777632205,
//   },
//   {
//     temp: 40,
//     cost: 71681,
//     volume: 1.8650857295380203,
//   },
// ];
