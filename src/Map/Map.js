import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Map.css';

let map;

class Map extends Component {
  componentDidMount() {
    const { locationPicked, center } = this.props;

    /* Load Map */
    const { maps } = window.google;
    map = new maps.Map(this.mapDiv, {
      center,
      zoom: 12,
    });

    /* Search Box */
    // Create the search box and link it to the UI element.
    const input = document.getElementById('pac-input');
    const searchBox = new maps.places.SearchBox(input, { type: '(regions)' });
    map.controls[maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    let markers = [];

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          return;
        }

        const icon = {
          url: place.icon,
          size: new maps.Size(71, 71),
          origin: new maps.Point(0, 0),
          anchor: new maps.Point(17, 34),
          scaledSize: new maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(new maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    /* Event Handlers */
    map.addListener('click', ({ latLng }) => {
      // Notifies the App component that a location was clicked
      // Triggers draw of graph div
      locationPicked({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { center } = nextProps;
    map.setCenter(center);
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <input
          id="pac-input"
          className="controls"
          type="text"
          placeholder="Search Box"
        />
        <div
          style={{ height: '100%', zIndex: 1 }}
          ref={(mapDiv) => { this.mapDiv = mapDiv; }}
        />
      </div>
    );
  }
}

Map.propTypes = {
  locationPicked: PropTypes.func.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default Map;
