import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MatSnackBar, MatDialog, MatBottomSheet } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DataService } from '../Services/data.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BottomsheetComponent } from '../bottomsheet/bottomsheet.component';

export class Building{
  lat: number;
  lng: number;
  sub_zone_id: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  API_URL = environment.API_URL

  map: L.Map
  mylocation: L.Marker
  mycircle: L.Circle
  newMarker: L.Marker
  bound: any
  building: Building
  buildingId: number
  json: any
  geobound:any;
  geojson:any

  latlng: any
  zoneId
  locationId:any

  permission = false
  isAddAllowed = false
  isLocation = false

  myMarker = L.icon({
    iconUrl: 'assets/mymarker.png',
    iconSize: [20, 20]
  });

  greenMarker = L.icon({
    iconUrl: 'assets/marker-green.png',
    iconSize: [15, 15]
  });

  blue = L.icon({
    iconUrl: 'assets/blue.png',
    iconSize: [15, 15]
  });

  redMarker = L.icon({
    iconUrl: 'assets/marker-red.png',
    iconSize: [15, 15]
  });

  yellowMarker = L.icon({
    iconUrl: 'assets/marker-yellow.png',
    iconSize: [15,15]
  });

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private dialog: MatDialog,
    private _bottomSheet: MatBottomSheet
  ) {
    this.building = new Building()
   }

  ngOnInit() {
    this.renderMap()
  }


  renderMap() {
    var sat = L.tileLayer('https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      minZoom: 9,
    });
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 9,
    });
    this.map = L.map('map',{
      center:[27.4712,89.64191],
      zoom: 13,
      maxZoom:20,
      minZoom:9,
      layers: [sat]
    });
    var baseMaps = {
      "Satellite Image": sat,
      "OSM base map": osm 
    };

    L.control.layers(baseMaps,null,{position:"topleft"}).addTo(this.map);
    this.onMapReady(this.map)

    this.map.on('locationerror',(err)=>{
          if (err.code === 0) {
            this.snackBar.open('Couldnot pull your location, please try again later', '', {
              verticalPosition: 'top',
              duration: 3000
            });
          }
          if (err.code === 1) {
            this.snackBar.open('Location service is disabled, please enable it and try again', '', {
              verticalPosition: 'top',
              duration: 3000
            });
          }
          if (err.code === 2) {
            this.snackBar.open('Your location couldnot be determined', '', {
              verticalPosition: 'top',
              duration: 3000
            });
          }
          if (err.code === 3) {
              this.snackBar.open('Couldnot get your location', '', {
                verticalPosition: 'top',
                duration: 3000
              });
            }
    });

    this.map.on('locationfound',(e)=>{
      if(this.isLocation){
        var radius = e.accuracy;
        this.latlng = e
        if(this.mylocation !== undefined){
          this.map.removeLayer(this.mylocation);
        }
        this.mylocation = L.marker(e.latlng,{icon: this.myMarker}).addTo(this.map);

        if(radius<100){
          if(this.mycircle !== undefined){
            this.map.removeLayer(this.mycircle);
          }
          this.mycircle = L.circle(e.latlng,radius).addTo(this.map);
        }
      }
    });


    this.map.on('click', <LeafletMouseEvent>($e) => {
      if (this.isAddAllowed) {
        if (this.newMarker !== undefined) {
          this.map.removeLayer(this.newMarker);
        }
        this.newMarker = L.marker($e.latlng, {icon: this.myMarker}).addTo(this.map);
        this.presentAlert($e.latlng);
      }
    });
  }

  toggleAdd() {
    this.snackBar.open('Tap on the structure/building you want to add', '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
    this.isAddAllowed = true;
  }

  getMyLocation(){
      this.isLocation = true
      if(this.locationId !== undefined){
        if(this.latlng !== undefined){
          this.map.setView(this.latlng.latlng,17)
          if(this.mylocation !== undefined){
            this.map.removeLayer(this.mylocation);
          }
          this.mylocation = L.marker(this.latlng.latlng,{icon: this.myMarker}).addTo(this.map);

          if(this.latlng.radius<100){
            if(this.mycircle !== undefined){
              this.map.removeLayer(this.mycircle);
            }
            this.mycircle = L.circle(this.latlng.latlng,this.latlng.radius).addTo(this.map);
          }
        }else{
          this.latlng = (navigator as any).geolocation.getCurrentPosition((e)=>{
            console.log(e)
            this.latlng = {
              latlng: L.latLng(e.coords.latitude,e.coords.longtitude)
            }
          })
        }
      }else{
        this.locationId = this.map.locate({watch:true,enableHighAccuracy:true});
      }
  }

  stopLocation(){
    this.isLocation = false
    if(this.mylocation !== undefined){
      this.map.removeLayer(this.mylocation);
      this.mylocation = undefined
    }
    if(this.mycircle !== undefined){
      this.map.removeLayer(this.mycircle);
      this.mycircle = undefined
    }
    // Dont know if we should be stopping this.
    // this.map.stopLocate()
  }

  onMapReady(map: L.Map) {
    this.zoneId = Number(sessionStorage.getItem('zone'));
    this.geobound= this.http.get(`/assets/geojson/conv_T${this.zoneId}.geojson`).subscribe((json:any)=>{
      this.bound= L.geoJSON(json,{
        style: (feature)=>{
          return {
            color:"red",
            fillOpacity:0
          }
        }
      }).addTo(this.map);
      this.map.fitBounds(this.bound.getBounds());
    })
    this.getBuilding(map)
  }

  getBuilding(map: L.Map){
    // Added buildings here
    this.http.get(`${this.API_URL}/get-str/${this.zoneId}`).subscribe((json: any) => {
      this.json = json;
      console.log(json);
      this.geojson = L.geoJSON(this.json, {
        onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.buildingId = feature.properties.structure_id;
              console.log(this.buildingId);
              this._bottomSheet.open(BottomsheetComponent,{
                data: this.buildingId
              })
              this._bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(()=>{
                console.log("reloaded")
                if(this.geobound !== undefined){
                  this.map.removeLayer(this.geobound)
                  this.geobound = undefined
                }

                if(this.geojson!== undefined){
                  this.map.removeLayer(this.geojson)
                  this.geojson= undefined
                }

                this.getBuilding(this.map)
              })
            });
          }, pointToLayer: (feature, latLng) => {
            if(feature.properties.status == 'INCOMPLETE'){
              return L.marker(latLng, {icon: this.redMarker});
            }else if(feature.properties.status == "PROGRESS"){
              return L.marker(latLng, {icon: this.blue});
            } else{
              return L.marker(latLng, {icon: this.greenMarker});
            }
          }
        }).addTo(map);
    });
  }

  checkPermission(){
    (navigator as any).permissions.query({name: 'geolocation'}).then((status)=>{
      if(status.state == "denied"){
          this.snackBar.open('Location permission needed to use GPS. Please grant location access to you browser by going to settings.', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['info-snackbar']
          });
          this.permission = false
      }else{
          this.permission = true 
        // permission granted
      }
      status.onchange = ()=>{
        if(status.state !== "denied"){
          this.permission = true 
          this.snackBar.open('Location permission has been successfully set', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['info-snackbar']
          });
        }
      }
    })
  }


  presentAlert(latlng) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to add the selected building?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.building.lat = latlng.lat;
        this.building.lng = latlng.lng;
        this.building.sub_zone_id = Number(sessionStorage.getItem('zone'));
        this.dataService.postNewBuilding(this.building).subscribe(response => {
          console.log(response);
          this.buildingId = response.data.id;

          this.snackBar.open('Building number ' + this.buildingId + ' has been successfully identified', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.isAddAllowed = false;
          if(this.geojson!== undefined){
            this.map.removeLayer(this.geojson)
            this.geojson= undefined
          }
          if(this.newMarker !== undefined){
            this.map.removeLayer(this.newMarker)
            this.newMarker = undefined
          }

          this.getBuilding(this.map)
        });
      }else{
        this.map.removeLayer(this.newMarker)
        this.isAddAllowed = false;
      }
    });
  }

}