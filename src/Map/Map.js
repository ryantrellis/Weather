import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Map.css';

class Map extends Component {
  componentDidMount() {
    const { locationPicked } = this.props;

    /* Load Map */
    const { maps } = window.google;
    const map = new maps.Map(this.mapDiv, {
      center: { lat: 33.7490, lng: -84.3880 },
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
      locationPicked({
        lat: latLng.lat().toFixed(2),
        lng: latLng.lng().toFixed(2),
      });
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <input id="pac-input" className="controls" type="text" placeholder="Search Box" />
        <div className="Map" ref={(mapDiv) => { this.mapDiv = mapDiv; }} />
      </div>
    );
  }
}

Map.propTypes = {
  locationPicked: PropTypes.func.isRequired,
};

export default Map;
