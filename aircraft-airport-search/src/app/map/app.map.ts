import { Component, Input, OnInit } from '@angular/core';

import { flightInfo, coordinates } from '../interfaces/flightInfo';

import { Map, View, Feature  } from 'ol';
import { fromLonLat } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style, Stroke, Text, Fill } from 'ol/style';


import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

@Component({
  selector: 'app-map',
  template: `
  <div id="map" class="map flightMap"></div>
  `,
  styleUrls: ['./app.map.css']
})
export class MapComponent implements OnInit {
  public map!: Map
  @Input() flightCoords!: flightInfo[];

  ngOnInit(): void {
    console.log("Generating map!");

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 3
      })
    });

    this.drawLines();
    this.drawMarker();
  }

  private drawLines() {
    console.log("Drawing map lines!");
    var line_vsrc = new VectorSource({
      features: this.getLines(),
      wrapX: false
    });

    var lineStyle = new Style({
      stroke: new Stroke({
        color: [255, 0, 0],
        width: 2,
        lineCap: "butt"
      })
    });

    var veclay_line = new VectorLayer({
      source: line_vsrc,
      style: lineStyle
    });

    this.map.addLayer(veclay_line);

    // fit map zoom depending on flights
    if (veclay_line.getSource() && this.map) {
      if (veclay_line.getSource()!.getFeatures().length > 0) {
        console.log(veclay_line.getSource()!.getExtent());
        this.map.getView().fit(veclay_line.getSource()!.getExtent()!);

        if (this.flightCoords.length === 1 && this.flightCoords[0].start.name === this.flightCoords[0].end.name) {
          console.log("Single Point Zoom");
          this.map.getView().animate({
            zoom: this.map.getView()!.getZoom()! - 14,
            duration: 500
          })
        } else {
          console.log("Multi Point Zoom");
          this.map.getView().animate({
            zoom: this.map.getView()!.getZoom()! - 0.3,
            duration: 500
          })
        }
      }
    }
  }

  private drawMarker() {
    let uniqueLocation: any[] = [];

    // get list of unique locations
    this.flightCoords.forEach((element: flightInfo) => {
      if (!uniqueLocation.some(entry => entry['name'] === element.start.name)) {
        uniqueLocation.push(element.start);
      };
      if (!uniqueLocation.some(entry => entry['name'] === element.end.name)) {
        uniqueLocation.push(element.end);
      };
    });

    console.log(uniqueLocation);

    uniqueLocation.forEach((element: coordinates) => {
      var markers = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          image: new Icon({
            anchor: [0.5, 0.8],
            scale: 0.05,
            src: '../assets/images/airportMarker.png'
          }),
          text: new Text({
            text: element.name,
            offsetY: 7,
            scale: 1.5,
            fill: new Fill({
              color: [200, 200, 200]
            }),
            stroke: new Stroke({
              color: [0, 0, 0],
              width: 2
            })
          })
        })
      });

      var marker = new Feature(new Point(fromLonLat([element.longitude, element.latitude])));
      markers.getSource()!.addFeature(marker);

      this.map.addLayer(markers);
    });
  }

  private getLines() : Feature[] {
    console.log("Getting map lines!");

    let lineArrFeature: Feature[] = [];
    this.flightCoords.forEach((element: flightInfo) => {
      let startLong = element.start.longitude;
      let endLong = element.end.longitude;

      // console.log("Start Long: ", startLong, " End Long: ", endLong);

      // adjust line direction to more accuratly show direction around planet a plane might fly
      if (Math.abs(startLong - endLong) > 180) {
        if (startLong > 0) {
          startLong -= 360;
        } else if (endLong > 0) {
          endLong -= 360;
        }
      }

      var lonLat1 = fromLonLat([startLong, element.start.latitude]);
      var lonLat2 = fromLonLat([endLong, element.end.latitude]);

      var points = [lonLat1, lonLat2];
      var line_feat = new Feature({
        geometry: new LineString(points),
        name: element.call
      });

      lineArrFeature.push(line_feat);
    });

    return lineArrFeature
  }
}
