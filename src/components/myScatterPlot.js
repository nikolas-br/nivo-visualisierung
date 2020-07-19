import React from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyResponsiveScatterPlot = ({ data, scale }) => (
  <ResponsiveScatterPlot
    data={data}
    margin={{ top: 60, right: 60, bottom: 80, left: 80 }}
    xScale={{ type: "linear", min: "auto", max: 1500 * scale }}
    xFormat={function (e) {
      return e + " million people\n";
    }}
    yScale={{ type: "linear", min: 0, max: 100000 * scale }}
    yFormat={function (e) {
      return e + " $GDP/capita";
    }}
    colors={{ scheme: "category10" }}
    nodeSize={12}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "inhabitans (million)",
      legendPosition: "middle",
      legendOffset: 46,
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "$GDP / capita",
      legendPosition: "middle",
      legendOffset: -60,
    }}
    // legends={[
    //   {
    //     anchor: "bottom-right",
    //     direction: "column",
    //     justify: false,
    //     translateX: 130,
    //     translateY: 0,
    //     itemWidth: 100,
    //     itemHeight: 12,
    //     itemsSpacing: 5,
    //     itemDirection: "left-to-right",
    //     symbolSize: 12,
    //     symbolShape: "circle",
    //     effects: [
    //       {
    //         on: "hover",
    //         style: {
    //           itemOpacity: 1,
    //         },
    //       },
    //     ],
    //   },
    // ]}
  />
);

// [
//     {
//       "id": "group A",
//       "data": [
//         {
//           "x": 16,
//           "y": 55
//         },
//         {
//           "x": 38,
//           "y": 75
//         },
