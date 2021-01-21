import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { SelectZoneComponent } from './select-zone/select-zone.component';


const routes: Routes = [
  {path: '',component: SelectZoneComponent},
  {path: 'map',component: MapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
