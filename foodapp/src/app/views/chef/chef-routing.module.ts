import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefComponent } from './chef.component';
import { MenueComponent } from './menue/menue.component';

const routes: Routes = [
  { path: "", redirectTo: "chef", pathMatch: "full" },
  {path: 'chef',
  component: ChefComponent,},
  {path: 'menue',
  component: MenueComponent,}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefRoutingModule { }
