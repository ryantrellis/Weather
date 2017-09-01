# Rainfall Monitoring App

**Some Notes on Design Decisions**

- Create-react-app gives me a nice launching point for my development enviroment.  Test running, live reload, babel, webpack, linting all ready to go.
- Using AirBnb linting rules because they are very comprehensive.
- Adding redux to simplify getting data from the API and getting into a format to be easily consumed by my UI.
- Using https://openweathermap.org/api to get forecast data.  It's free and has all the information I need.  Supports lookup via coordinates, which is what I hope to use.
- Upon realizing that you need to pay for historical data from openweathermap, I decided to use http://developer.worldweatheronline.com/api for historical data.  It returns XML which is more difficult to parse, but it is the only free source of historical rainfall data that I could find.
- Use embedded Google Maps because people are used to interacting with their map interface, and it has location searching built in.
- I plan to keep the UI simple:
  - I don't think users will want the ability to see the rain data and the map at the same time, so I plan to display both in full screen.
  - When a user selects a location on the map, a full screen div will appear with the rain data.  There will be a back button to return to the map.
    - This design will work well for desktop and mobile with little effort.
    - Individual data points will be easy to see by mousing over the individual points on desktop.
- Using Moment.js to handle dates because it makes the code much more readable.
- Chose plotly.js for graphing because it offers a lot of cool feature with minimal configuration.  I found the zooming controls on mobile were really intuitive.
- Using inline CSS for styling components that only appear in one place.
- If a component appears in multiple places, I use a css file and give the component a class.
- Also use a css file for styling the google maps elements because the example they provide uses a css file.
