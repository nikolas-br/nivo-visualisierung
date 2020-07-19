export const lineChartDescription = `Under-five mortality rate is the probability per 1,000 that a newborn baby will die before reaching age five, if subject to age-specific mortality rates of the specified year.
Source: https://ourworldindata.org/grapher/child-mortality-igme`;

export const scatterPlotDescription = `GDP per capita: Adjusted for price changes over time (inflation) and for price differences between countries to allow comparisons – it is measured in international-$ in 2011 prices. 
Source: https://ourworldindata.org/grapher/real-gdp-per-capita-pwt?tab=map

Source for population data: https://ourworldindata.org/grapher/population?tab=table&country=BRA~CHN~Europe~IND~IDN~NGA~USA`;

export const parallelChartDescription = `GDP per capita based on purchasing power parity (PPP). PPP GDP is gross domestic product converted to international dollars using purchasing power parity rates. An international dollar has the same purchasing power over GDP as the U.S. dollar has in the United States. GDP at purchaser's prices is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in constant 2011 international dollars.
Source: https://ourworldindata.org/grapher/gdp-per-capita-worldbank


Estimates of working hours involve serious measurement problems and international comparability is difficult. Even individual countries often provide differing estimates, which are variously based on labor force surveys or establishment surveys. An advantage of estimates based on labor force surveys is that they are usually quite comprehensive. These estimates include adjustments for overtime, sickness, etc. A disadvantage, however, is that often they slightly overestimate actual hours worked. Figures based on establishment surveys usually only cover hours paid (which may include overtime), and require further adjustments to account for various types of absence.
The measure used in TED is hours actually worked, so it includes paid overtime and excludes paid hours that are not worked due to sickness, vacation and holidays, etc.
Source: https://ourworldindata.org/grapher/annual-hours-worked-per-worker?country=CRI~CZE~DEU~LTU~MLT~NLD~GBR~USA


Military expenditures data from SIPRI are derived from the NATO definition, which includes all current and capital expenditures on the armed forces, including peacekeeping forces; defense ministries and other government agencies engaged in defense projects; paramilitary forces, if these are judged to be trained and equipped for military operations; and military space activities. Such expenditures include military and civil personnel, including retirement pensions of military personnel and social services for personnel; operation and maintenance; procurement; military research and development; and military aid (in the military expenditures of the donor country). Excluded are civil defense and current expenditures for previous military activities, such as for veterans' benefits, demobilization, conversion, and destruction of weapons. This definition cannot be applied for all countries, however, since that would require much more detailed information than is available about what is included in military budgets and off-budget military expenditure items. (For example, military budgets might or might not cover civil defense, reserves and auxiliary forces, police and paramilitary forces, dual-purpose forces such as military and civilian police, military grants in kind, pensions for military personnel, and social security contributions paid by one part of government to another.)
Source: https://ourworldindata.org/grapher/military-expenditure-as-share-of-gdp


Internet users are individuals who have used the Internet (from any location) in the last 3 months. The Internet can be used via a computer, mobile phone, personal digital assistant, games machine, digital TV etc.
Source: https://ourworldindata.org/grapher/share-of-individuals-using-the-internet


Access to an improved water source refers to the percentage of the population using an improved drinking water source. The improved drinking water source includes piped water on premises (piped household water connection located inside the user’s dwelling, plot or yard), and other improved drinking water sources (public taps or standpipes, tube wells or boreholes, protected dug wells, protected springs, and rainwater collection).
Source: https://ourworldindata.org/grapher/share-of-the-population-with-access-to-improved-drinking-water


Age-standardised death rate from exposure to air pollution (indoor and ambient outdoor) per 100,000 individuals.
Source: https://ourworldindata.org/grapher/death-rate-from-air-pollution-per-100000`;

// export const SERVER_ENDPOINT = "http://localhost/";
export const SERVER_ENDPOINT = "./csv/";
export const CSV_CHILD_MORTALITY = "child-mortality.csv";
export const CSV_PARALLEL_DATA = "parallelCoordinatesData.csv";
export const CSV_SCATTERPLOT_POPULATION = "plotterChart-population.csv";
export const CSV_SCATTERPLOT_GPD = "plotterChart-real-gdp-per-capita-PWT.csv";
