import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { SelectZoneComponent } from './select-zone/select-zone.component';
import { GuardService } from './Services/guard.service';


const routes: Routes = [
  {path: '',component: LoginComponent},
  {path: 'select',component: SelectZoneComponent,canActivate:[GuardService]},
  {path: 'map',component: MapComponent,canActivate:[GuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
