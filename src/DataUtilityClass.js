import Papa from "papaparse";

// Business logic for downloading .csv data, parsing and
// getting it into the format required by nivo.
// Also handling: adding and removing datapoints
// All class methods are pure functions and should remain so
export default class DataUtilityClass {
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
    const YEAR_START = 1950;
    const YEAR_END = 2017;
    let year = YEAR_START;

    while (year <= YEAR_END) {
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

  // data = {id: "Germany", data: {name: 123, putInWhatYouLike: 443, ...}}
  getDataPointParallelChart = (data, id) => {
    const result = data.filter((e) => e.id === id)[0];

    if (typeof result !== "object") throw new Error();

    // Filter out id field
    let newPoint = {};
    for (let key of Object.keys(result)) {
      if (key === "id") continue;

      newPoint = { ...newPoint, [key]: result[key] };
    }

    return { id, data: newPoint };
  };

  // data = {id: "Germany", data: [{x: 1, y: 2}, ...]}
  getDataPointLineChart = (data, id) => {
    const result = data.filter((e) => e.id === id);

    if (result.length !== 1) throw new Error();

    return result[0];
  };

  removeDataPointLineChart = (data, id) => {
    return data.filter((e) => e.id !== id);
  };

  removeDataPointParallelChart = (data, id) => {
    return data.filter((e) => e.id !== id);
  };
}
