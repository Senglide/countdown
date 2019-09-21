import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { NgBootstrapModule } from './ng-bootstrap.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgBootstrapModule,
    FormsModule
  ],
  exports: [
    CountdownTimerComponent,
  ],
  declarations: [CountdownTimerComponent]
})
export class CustomModule { }
