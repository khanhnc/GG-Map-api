import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps/';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild(GoogleMap, { static: false }) map:GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  markerPositions: google.maps.LatLngLiteral[] = [];
  loButton: any; 
  infoWindowContent = '';
  zoom = 12;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  constructor(httpClient: HttpClient, private renderer: Renderer2, private el: ElementRef,
    @Inject(DOCUMENT) private document: Document) { 

    this.loButton = this.document.createElement('button');
    this.loButton.textContent = "Pan to Current Location";
    this.loButton.classList.add("custom-map-control-button");
    this.loButton.addEventListener("click", () => {
      this.navigateToCurrentLocation();
    })
  }

  ngOnInit(): void {
  }

  navigateToCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.infoWindowContent = "Location found!";  
          this.infoWindow.position = pos;
          this.openInfoWindow();
          this.map.center = pos;
        },
        () => {
          this.handleLocationError(true, this.infoWindow, this.map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, this.infoWindow, this.map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation: any, infoWindow: google.maps.InfoWindow, pos: google.maps.LatLng) {
    this.infoWindowContent = "Location not found!";  
    this.openInfoWindow();
    infoWindow.position = pos;
  }

  ngAfterViewInit()	{
    console.log(this.map)
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.loButton);

  }


}
