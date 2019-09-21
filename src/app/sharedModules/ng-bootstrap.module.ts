import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    NgbCollapseModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot()
  ],
  exports: [
    NgbModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ],
  declarations: []
})
export class NgBootstrapModule { }
