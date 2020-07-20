import React, { Component } from "react";
import ComboBox from "./components/comboBox";
import ChipArray from "./components/chipArray";
import { MyResponsiveLine } from "./components/myResponsiveLine";
import { MyResponsiveScatterPlot } from "./components/myScatterPlot";
import { MyResponsiveParallelCoordinates } from "./components/parallelChart";
import { LoadingScreen } from "./components/loadingScreen";
import { MyAccordion } from "./components/accordion";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import Paper from "@material-ui/core/Paper";

import DataUtilityClass from "./DataUtilityClass";
import {
  lineChartDescription,
  scatterPlotDescription,
  parallelChartDescription,
  SERVER_ENDPOINT,
  CSV_CHILD_MORTALITY,
  CSV_PARALLEL_DATA,
  CSV_SCATTERPLOT_POPULATION,
  CSV_SCATTERPLOT_GPD,
} from "./constants";

import "./App.css";

const colorGenerator = require("color-generator");

// Utility class contains business logic for downloading .csv data, parsing and
// getting it into the format required by nivo
const dataUtilityClass = new DataUtilityClass();

class App extends Component {
  state = {
    selectedCountries: [],
    dataParallelChart: [],
    showDataParallelChart: [],
    dataLineChart: [],
    showDataLineChart: [],
    countryAndColor: [], // {country: "Germany", color: "blue"}
    dataScatterPlot: [],
    showDataScatterPlot: [],
    showScatterPlotYear: 2010,
    showScatterPlotScale: 0.2,
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    // Declare sources for data
    let sources = [
      CSV_CHILD_MORTALITY,
      CSV_PARALLEL_DATA,
      CSV_SCATTERPLOT_POPULATION,
      CSV_SCATTERPLOT_GPD,
    ].map((e) => SERVER_ENDPOINT + e);

    dataUtilityClass
      .fetchDataAndParseCSV(sources)
      .then((result) => {
        // console.log(result);

        // Get individual datasets
        const childMortality = result[0].data;
        const dataParallelChart = result[1].data;
        const dataScatterPlotPopulation = result[2].data;
        const dataScatterPlotGDP = result[3].data;

        // Convert objects to required format for charts
        const dataLineChart = dataUtilityClass.prepareDataForLineChart(
          childMortality
        );

        const dataScatterPlot = dataUtilityClass.prepareDataForScatterPlot(
          dataScatterPlotPopulation,
          dataScatterPlotGDP
        );

        this.setState({
          dataLineChart,
          dataParallelChart,
          dataScatterPlot,
          showDataScatterPlot: dataScatterPlot
            .filter((e) => e.year === this.state.showScatterPlotYear)
            .map((e) => e.data),
        });

        // Set a couple of countries to be displayed by default
        [
          "Germany",
          "United States",
          "China",
          "South Africa",
          "Mexico",
          "Nigeria",
        ].forEach((e) => {
          this.addCountry(e);
        });

        this.setState({ isLoading: false });
      })
      .catch(() => {
        console.error("Error loading data");
        this.setState({ error: "Error loading data" });
      });
  }

  addCountry = (country) => {
    if (this.state.countryAndColor.filter((e) => e.country === country).length)
      return;

    const newPoint1 = dataUtilityClass.getDataPointLineChart(
      this.state.dataLineChart,
      country
    );
    const newPoint2 = dataUtilityClass.getDataPointParallelChart(
      this.state.dataParallelChart,
      country
    );

    this.setState({
      countryAndColor: [
        ...this.state.countryAndColor,
        { country, color: colorGenerator().hexString() },
      ],
      showDataLineChart: [...this.state.showDataLineChart, newPoint1],
      showDataParallelChart: [...this.state.showDataParallelChart, newPoint2],
    });
  };

  removeDataPoint = (country) => {
    const showDataLineChart = dataUtilityClass.removeDataPointLineChart(
      this.state.showDataLineChart,
      country
    );
    const showDataParallelChart = dataUtilityClass.removeDataPointParallelChart(
      this.state.showDataParallelChart,
      country
    );

    const countryAndColor = this.state.countryAndColor.filter(
      (element) => element.country !== country
    );

    this.setState({
      showDataLineChart,
      showDataParallelChart,
      countryAndColor,
    });
  };

  removeAllDataPoints = () => {
    if (!this.state.showDataLineChart.length) return;
    this.setState({
      showDataLineChart: this.state.showDataLineChart.slice(0, 1),
      showDataParallelChart: this.state.showDataParallelChart.slice(0, 1),
      countryAndColor: this.state.countryAndColor.slice(0, 1),
    });
  };

  onComboBoxChange = ({ event, value, reason }) => {
    if (reason === "select-option") {
      this.addCountry(value);
    }
  };

  onSliderChangeYear = (event, newValue) => {
    if (newValue === this.state.showScatterPlotYear) return;

    const showDataScatterPlot = this.state.dataScatterPlot
      .filter((e) => e.year === newValue)
      .map((e) => e.data);

    this.setState({ showDataScatterPlot, showScatterPlotYear: newValue });
  };

  onSliderChangeScale = (event, newValue) => {
    if (newValue === this.state.showScatterPlotScale) return;

    this.setState({ showScatterPlotScale: newValue });
  };

  render() {
    return (
      <div>
        <LoadingScreen isOn={this.state.isLoading} />

        <Header
          dataLineChart={this.state.dataLineChart}
          countryAndColor={this.state.countryAndColor}
          removeDataPoint={this.removeDataPoint}
          removeAllDataPoints={this.removeAllDataPoints}
          onComboBoxChange={this.onComboBoxChange}
        />

        <ParallelCoordinatesChart
          countryAndColor={this.state.countryAndColor}
          showDataParallelChart={this.state.showDataParallelChart}
          parallelChartDescription={parallelChartDescription}
        />

        <LineChart
          countryAndColor={this.state.countryAndColor}
          lineChartDescription={lineChartDescription}
          resizeData={dataUtilityClass.resizeData}
          showDataLineChart={this.state.showDataLineChart}
        />

        <ScatterPlotChart
          onSliderChangeScale={this.onSliderChangeScale}
          onSliderChangeYear={this.onSliderChangeYear}
          scatterPlotDescription={scatterPlotDescription}
          showDataScatterPlot={this.state.showDataScatterPlot}
          showScatterPlotScale={this.state.showScatterPlotScale}
          showScatterPlotYear={this.state.showScatterPlotYear}
        />

        <Typography variant="subtitle2" gutterBottom className="copyright">
          © Nikolas Brücher
        </Typography>
      </div>
    );
  }
}

export default App;

/////////////////////////////////////////////////////////////////////////////
// Various stateless components for the App class render
/////////////////////////////////////////////////////////////////////////////

const Header = ({
  dataLineChart,
  countryAndColor,
  removeDataPoint,
  removeAllDataPoints,
  onComboBoxChange,
}) => (
  <Paper className="paper" elevation={3}>
    <Typography variant="h5" gutterBottom>
      Add or remove countries
    </Typography>
    <Divider />

    <div className="card">
      <ComboBox
        options={dataLineChart.map((e) => e.id)}
        onComboBoxChange={(e) => onComboBoxChange(e)}
      />

      <ChipArray
        list={countryAndColor.map((e, i) => ({
          key: i,
          label: e.country,
          color: e.color,
        }))}
        removeDataPoint={removeDataPoint}
        removeAllDataPoints={removeAllDataPoints}
      />
    </div>
  </Paper>
);

const ParallelCoordinatesChart = ({
  showDataParallelChart,
  countryAndColor,
  parallelChartDescription,
}) => (
  <Paper className="paper">
    <div className="wrapper">
      <MyResponsiveParallelCoordinates
        data={showDataParallelChart.map((e) => e.data)}
        colors={countryAndColor.map((e) => e.color)}
      />
    </div>

    <MyAccordion
      title={
        "Parallel chart: Correlation between GDP per capita, annual hours worked, military expenditure as share of GDP, share of internet users, access to improved water and the death rate from air pollution per 100 000"
      }
      text={parallelChartDescription}
    />
  </Paper>
);

const LineChart = ({
  showDataLineChart,
  countryAndColor,
  lineChartDescription,
  resizeData,
}) => (
  <Paper className="paper">
    <div className="wrapper">
      <MyResponsiveLine
        data={showDataLineChart}
        resizeData={resizeData}
        colors={countryAndColor.map((e) => e.color)}
      />
    </div>
    <MyAccordion
      title={"Line chart: Mortality of children under 5 (per 1000)"}
      text={lineChartDescription}
    />
  </Paper>
);

const ScatterPlotChart = ({
  showScatterPlotYear,
  showDataScatterPlot,
  showScatterPlotScale,
  onSliderChangeScale,
  onSliderChangeYear,
  scatterPlotDescription,
}) => (
  <Paper className="paper" elevation={3}>
    <Typography variant="h5" gutterBottom style={{ marginTop: 10 }}>
      Year {showScatterPlotYear}: Population by country vs. GDP per capita
    </Typography>
    <div className="wrapperScatterPlot">
      <MyResponsiveScatterPlot
        data={Object.values(showDataScatterPlot)}
        scale={showScatterPlotScale}
      />
    </div>
    <Typography
      gutterBottom
      variant="button"
      display="block"
      className="slider"
    >
      Year
      <Slider
        defaultValue={2010}
        min={1950}
        max={2017}
        valueLabelDisplay="auto"
        step={5}
        marks
        onChange={onSliderChangeYear}
      />
    </Typography>

    <Typography
      gutterBottom
      variant="button"
      display="block"
      className="slider"
    >
      Scale
      <Slider
        defaultValue={0.2}
        min={0.1}
        max={1}
        valueLabelDisplay="auto"
        step={0.1}
        marks
        onChange={onSliderChangeScale}
      />
    </Typography>
    <MyAccordion
      title={"Scatter plot: Population by country vs. GDP per capita"}
      text={scatterPlotDescription}
    />
  </Paper>
);
