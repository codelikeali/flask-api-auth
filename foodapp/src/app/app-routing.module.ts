import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChefGuard } from './chef.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChefComponent } from './views/chef/chef.component';
import { OrderComponent } from './views/order/order.component';

const routes: Routes = [
  { path: "", redirectTo: "auth", pathMatch: "full" },
  {
    path: "auth",
    loadChildren: () =>
      import("./views/authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },

  {
    path: "chef",
    // component: ChefComponent,
    canActivate: [ChefGuard],
    loadChildren: () =>
      import("./views/chef/chef.module").then(
        (m) => m.ChefModule
      ),
  },


  {
    path: "order",
    // component: OrderComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./views/order/order.module").then(
        (m) => m.OrderModule
      ),
  },

  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
