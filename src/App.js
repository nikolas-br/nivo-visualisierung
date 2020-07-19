import React, { Component } from "react";
import Papa from "papaparse";
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

    // Fetch data
    this.fetchDataAndParseCSV(sources)
      .then((result) => {
        // console.log(result);

        // Get individual datasets
        const childMortality = result[0].data;
        const dataParallelChart = result[1].data;
        const dataScatterPlotPopulation = result[2].data;
        const dataScatterPlotGDP = result[3].data;

        // Convert objects to required format for charts
        const dataLineChart = this.prepareDataForLineChart(childMortality);

        const dataScatterPlot = this.prepareDataForScatterPlot(
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

  fetchDataAndParseCSV = async (sources) => {
    let promiseChain = [];

    for (let source of sources) {
      const promise = new Promise((resolve, reject) => {
        Papa.parse(source, {
          download: true,
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            // console.log(`results for ${source}`, results);
            resolve({ source, data: results.data });
          },
          error: (error) => {
            console.error("Error loading csv", error.message);
            reject(error.message);
          },
        });
      });
      promiseChain.push(promise);
    }

    return Promise.all(promiseChain);
  };

  prepareDataForScatterPlot = (population, gdp) => {
    let result = []; // [ { year: [year], data: { id: country, data: [{ x: valueOfYear, y: valueofYear2 }] }, etc. ]
    let yearStart = 1950;
    let yearEnd = 2017;
    let year = yearStart;

    while (year <= yearEnd) {
      for (let populationEntry of population) {
        const country = populationEntry.country;
        const valueOfYear = populationEntry[year] / 1000000; // get population in million
        const gdpObj = gdp.filter((e) => e.country === country)[0];

        // Check if country is in other dataset
        if (!gdpObj) continue;

        const valueofYear2 = gdpObj[year];

        if (!valueOfYear || !valueofYear2) continue;

        const newPoint = {
          year: year,
          data: { id: country, data: [{ x: valueOfYear, y: valueofYear2 }] },
        };

        result.push(newPoint);
      }
      year++;
    }

    return result;
  };

  prepareDataForLineChart = (results) => {
    let data = [];
    for (let result of results) {
      const entries = Object.entries(result);

      let newPoint = {
        id: "",
        data: [], // {x: 2, y: 2}
      };

      // Last entry in object is always id
      const [key, id] = entries.pop();
      newPoint.id = id;

      // Rest of object is years in ascending order
      for (let entry of entries) {
        let [year, value] = entry;
        if (Number.isNaN(Number(year)))
          console.error("Problem parsing CSV: NaN");

        // if (!value) value = 0; // null unproblematic for nivo
        newPoint.data.push({ x: Number(year), y: value });
      }
      data.push(newPoint);
    }

    return data;
  };

  addCountry = (country) => {
    if (
      this.state.countryAndColor.filter(
        (element) => element.country === country
      ).length
    )
      return;

    this.setState({
      countryAndColor: [
        ...this.state.countryAndColor,
        { country, color: colorGenerator().hexString() },
      ],
    });
    this.addDataPointLineChart(country);
    this.addDataPointParallelChart(country);
  };

  // id equals country
  addDataPointParallelChart = (id) => {
    const result = this.state.dataParallelChart.filter(
      (e) => e.country === id
    )[0];

    const country = result.country;

    // Filter out country field
    let newPoint = {};
    for (let key of Object.keys(result)) {
      if (key === "country") continue;

      newPoint = { ...newPoint, [key]: result[key] };
    }

    this.setState({
      showDataParallelChart: [
        ...this.state.showDataParallelChart,
        { id: country, data: newPoint },
      ],
    });
  };

  // id equals country
  addDataPointLineChart = (id) => {
    const newPoint = this.state.dataLineChart.filter(
      (element) => element.id === id
    );
    if (newPoint.length < 1) return;

    this.setState({
      showDataLineChart: [...this.state.showDataLineChart, newPoint[0]],
    });
  };

  // id equals country
  removeDataPoint = (id) => {
    const showDataLineChart = this.state.showDataLineChart.filter(
      (element) => element.id !== id
    );
    if (showDataLineChart.length < 1) return;

    const showDataParallelChart = this.state.showDataParallelChart.filter(
      (element) => element.id !== id
    );

    const countryAndColor = this.state.countryAndColor.filter(
      (element) => element.country !== id
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

  // Removes missing data (null) to get optimal scaling for line chart
  resizeData = (data) => {
    let shortest = 10000;

    for (let element of data) {
      let index = 0;

      for (let entry of element.data) {
        if (entry.y) {
          if (index < shortest) shortest = index;
          break;
        }

        index++;
      }
    }

    return shortest;
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
          resizeData={this.resizeData}
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
