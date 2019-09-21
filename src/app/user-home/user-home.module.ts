import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHomeComponent } from './user-home.component';
import { FormsModule } from '@angular/forms';
import { NgBootstrapModule } from '../sharedModules/ng-bootstrap.module';
import { CustomModule } from '../sharedModules/custom.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgBootstrapModule,
    CustomModule
  ],
  declarations: [UserHomeComponent]
})
export class UserHomeModule { }
