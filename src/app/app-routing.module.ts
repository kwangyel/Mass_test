import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectZoneComponent } from './select-zone/select-zone.component';


const routes: Routes = [
  {path: '',component: SelectZoneComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
