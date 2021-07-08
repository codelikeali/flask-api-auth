import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChefRoutingModule } from './chef-routing.module';
import { ChefComponent } from './chef.component';
import { MenueComponent } from './menue/menue.component';
import { AddComponent } from './menue/dialog/add/add.component';
import { EditComponent } from './menue/dialog/edit/edit.component';
import { DeleteComponent } from './menue/dialog/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ChefComponent,
    MenueComponent,
    AddComponent,
    EditComponent,
    DeleteComponent
  ],
  imports: [
    CommonModule,
    ChefRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class ChefModule { }
