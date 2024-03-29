import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MatSnackBar, MatDialog, MatBottomSheet, throwToolbarMixedModesError } from '@angular/material';
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
  isDisabled = true

  testCenters:any; 

  //globals
  dzongkhagId:any;

  //controls
  overlayMaps = {};
  mapLayerControl: L.Control;

  showedit = false 


  testCenterSvg = `<?xml version="1.0" encoding="iso-8859-1"?> <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 280.028 280.028" style="enable-background:new 0 0 280.028 280.028;" xml:space="preserve"> <g> <path style="fill:#EBEBEB;" d="M140.014,0c77.323,0,140.014,62.691,140.014,140.014c0,77.314-62.691,140.014-140.014,140.014 S0,217.336,0,140.014S62.682,0,140.014,0z"/> <path style="fill:#E2574C;" d="M78.749,113.787h35.135V78.749c0-4.83,3.912-8.751,8.742-8.751h34.968 c4.822,0,8.733,3.92,8.733,8.751v35.03h34.951c4.839,0,8.751,3.912,8.751,8.751v35.012c0,4.848-3.912,8.768-8.751,8.768h-34.951 v34.933c0,4.839-3.912,8.751-8.733,8.751h-34.968c-4.83,0-8.742-3.912-8.742-8.751V166.31H78.749c-4.839,0-8.76-3.92-8.76-8.768 V122.53C69.989,117.699,73.91,113.787,78.749,113.787z"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>`;

  testCenterMarker = 'data:image/svg+xml;base64,' + btoa(this.testCenterSvg);
  
  // testCenterIcon = L.icon({
  //   iconUrl: this.testCenterMarker
  // });
 testCenterIcon = L.divIcon({
   html:this.testCenterSvg,
   className:"",
   iconSize:[40,40],
   iconAnchor:[10,10]
 }) 

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

  selectedBuilding;

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
    if(sessionStorage.getItem('dzo') !== null){
      this.dzongkhagId = sessionStorage.getItem('dzo')
    }
    this.renderMap()
    let role = sessionStorage.getItem('role')
    if(role === "VIEW"){
      this.showedit = false
    }
    if(role === 'EDIT'){
      this.showedit = true
    }

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
            this.isDisabled = true
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
        this.isDisabled = false
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
    this.isDisabled = true
    
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

  renderCheckPoint(){
    console.log(this.dzongkhagId)
    if(this.dzongkhagId !== undefined){
      this.http.get(`https://zhichar-pling.ddnsfree.com/cdrs/api/shapefile/get-test-center/${this.dzongkhagId}`).subscribe((json:any)=>{
        console.log("sdfsdfsdf")
        console.log(json)
        this.testCenters = L.geoJSON(json,{
          onEachFeature:(feature,layer)=>{
            layer.on('click', (e) => {
              layer.bindPopup(
                '<p style:"color:tomtato"> <span style="font-weight:bold;">Test Center Name: </span> ' + feature.properties.name+ '</p>'
              )
            })
          },
          pointToLayer:(feature,latlng)=>{
            return L.marker(latlng,{
              icon: this.testCenterIcon,
            });
          }
        }).addTo(this.map);
        this.overlayMaps = {
          "Testing Center": this.testCenters
        };
        this.mapLayerControl = L.control.layers(null, this.overlayMaps).addTo(this.map);
      })

    }
  }

  onMapReady(map: L.Map) {
    this.zoneId = Number(sessionStorage.getItem('zone'));
    this.geobound = this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getzone/${this.zoneId}`).subscribe((json:any)=>{
      this.bound = L.geoJSON(json.data, {
        style: (feature) => {
          return {
            color: "yellow",
            fillOpacity: 0,
            weight: 2
          }
        }
      }).addTo(this.map);
      // this.map.fitBounds(this.bound.getBounds());
      this.http.get(`${this.API_URL}/get-str/${this.zoneId}`).subscribe((json: any) => {
        this.json = json;
        this.geojson = L.geoJSON(this.json, {
          onEachFeature: (feature, layer) => {
              layer.on('click', (e) => {
                this.buildingId = feature.properties.structure_id;
                this._bottomSheet.open(BottomsheetComponent,{
                  data: {building_id: this.buildingId, remarks:feature.properties.remarks, showEdit: this.showedit}
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
                return new L.Circle(latLng, {radius:5, color:"red", fillColor:"red",fillOpacity:1});
              }else if(feature.properties.status == "PROGRESS"){
                return new L.Circle(latLng, {radius:5, color:"#0ACAF5",fillColor:"#0ACAF5",fillOpacity:1});
              } else{
                return new L.Circle(latLng, {radius:5, color:"#00E826",fillColor:"#00E826",fillOpacity:1});
              }
            }
          }).addTo(map);
          this.map.fitBounds(this.geojson.getBounds());
      });
    })
    this.getBuilding(map)
    this.renderCheckPoint();
  }

  getBuilding(map: L.Map){
    // Added buildings here
    this.http.get(`${this.API_URL}/get-str/${this.zoneId}`).subscribe((json: any) => {
      this.json = json;
      this.geojson = L.geoJSON(this.json, {
        onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.buildingId = feature.properties.structure_id;
              this._bottomSheet.open(BottomsheetComponent,{
                data: {building_id: this.buildingId, remarks:feature.properties.remarks, showEdit: this.showedit}
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
              return new L.Circle(latLng, {radius:5, color:"red", fillColor:"red",fillOpacity:1});
            }else if(feature.properties.status == "PROGRESS"){
              return new L.Circle(latLng, {radius:5, color:"#0ACAF5",fillColor:"#0ACAF5",fillOpacity:1});
            } else{
              return new L.Circle(latLng, {radius:5, color:"#00E826",fillColor:"#00E826",fillOpacity:1});
            }
          }
        }).addTo(map);
        // this.map.fitBounds(this.geojson.getBounds());
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

  goToZoneSelection(){
    console.log("ok")
    this.router.navigate(['select'])
  }

}