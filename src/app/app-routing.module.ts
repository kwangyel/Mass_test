import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { SelectZoneComponent } from './select-zone/select-zone.component';
import { GuardService } from './Services/guard.service';
import { RoleGuard } from './Services/role.guard';
import { SummaryDashComponent } from './summary-dash/summary-dash.component';
import { UnitDetailsComponent } from './unit-details/unit-details.component';


const routes: Routes = [
  {path: '',component: LoginComponent},
  {path: 'select',component: SelectZoneComponent,canActivate:[GuardService]},
  {path: 'map',component: MapComponent,canActivate:[GuardService]},
  {path: 'dashboard/:id',component: DashboardComponent,canActivate:[GuardService]},
  {path: 'unit-details/:id',component: UnitDetailsComponent,canActivate:[GuardService]},
  {path: 'summary',component: SummaryDashComponent,canActivate:[RoleGuard], data:{ expectedRole: 'VIEW'}},
  {path: '**' , redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
