import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// pages
import { CreateProfileComponent } from './pages/create-profile/create-profile.component';

// shared
import { HeaderComponent } from './shared/components/header/header.component';
import { ComboboxComponent } from './shared/components/combobox/combobox.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateProfileComponent,
    HeaderComponent,
    ComboboxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
