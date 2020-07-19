import React from "react";
import { ResponsiveLine } from "@nivo/line";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const theme = {
  axis: {
    textColor: "#eee",
    fontSize: "14px",
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
        fontSize: 14,
        // fontWeight: 400,
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

export const MyResponsiveLine = ({ data, resizeData, colors }) => {
  const tmp = resizeData(data);

  return (
    <React.Fragment>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 150, bottom: 80, left: 60 }}
        xScale={{
          // type: "point" ,
          type: "linear",
          min: 1960 + tmp,
          max: "auto",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          // legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          // legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={true}
        // colors={{ scheme: "nivo" }}
        colors={colors}
        enablePoints={false}
        lineWidth={4}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        enableCrosshair={false}
        useMesh={true}
        theme={theme}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 130,
            translateY: 0,
            itemsSpacing: 15,
            itemDirection: "left-to-right",
            itemWidth: 120,
            itemHeight: 15,

            itemOpacity: 1,
            symbolSize: 15,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            // onClick={},
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </React.Fragment>
  );
};

// const data = [
//   {
//     id: "japan",
//     color: "hsl(345, 70%, 50%)",
//     data: [
//       {
//         x: "plane",
//         y: 225,
//       },
//       {
//         x: "helicopter",
//         y: 4,
//       },
