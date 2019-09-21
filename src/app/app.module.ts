import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgBootstrapModule } from './sharedModules/ng-bootstrap.module';
import { NavbarComponent } from './navbar/navbar.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LoginModule } from './login/login.module';
import { UserHomeModule } from './user-home/user-home.module';
import { HomeComponent } from './home/home.component';
import { CustomModule } from './sharedModules/custom.module';
import { ProfileComponent } from './profile/profile.component';
import { UserSuggestionsModule } from './user-suggestions/user-suggestions.module';
import { RegisterModule } from './register/register.module';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    AboutComponent,
  ],
  imports: [
    AppRoutingModule,
    NgBootstrapModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    HttpClientModule,
    CustomModule,
    LoginModule,
    UserHomeModule,
    UserSuggestionsModule,
    RegisterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
