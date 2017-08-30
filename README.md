# Rainfall Monitoring App

**Design decisions**

- Create-react-app gives me a nice launching point for my development enviroment.  Test running, live reload, babel, webpack, linting all ready to go.
- Using AirBnb linting rules because they are very comprehensive.
- Adding redux to simplify getting data from the API and getting into a format to be easily consumed by my UI.
- Using https://openweathermap.org/api to get rainfall data.  It's free and has all the information I need.  Supports lookup via coordinates, which is what I hope to use.
- Use embedded Google Maps because people are used to interacting with their map interface, and it has location searching built in.
- I plan to keep the UI simple:
  - I don't think users will want the ability to see the rain data and the map at the same time, so I plan to display both in full screen.
  - When a user selects a location on the map, a full screen div will appear with the rain data.  There will be a back button to return to the map.
    - This design will work well for desktop and mobile with little effort.
    - Individual data points will be easy to see by mousing over the individual points on desktop.
    - Maybe on mobile the users can press the data point, and a header will appear with the point data.
    - Alternatively, there could be one tab for the graph and another for the data in a table.
