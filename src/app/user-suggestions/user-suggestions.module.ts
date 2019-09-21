import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSuggestionComponent } from './user-suggestion/user-suggestion.component';
import { UserSuggestionsComponent } from './user-suggestions.component';
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
  declarations: [UserSuggestionComponent, UserSuggestionsComponent]
})
export class UserSuggestionsModule { }
