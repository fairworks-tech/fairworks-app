import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// pages
import { CreateProfileComponent } from "./pages/create-profile/create-profile.component";
import { ShareSalaryComponent } from "./pages/share-salary/share-salary.component";

// shared
import { HeaderComponent } from "./shared/components/header/header.component";
import { ComboboxComponent } from "./shared/components/combobox/combobox.component";

const PAGES = [CreateProfileComponent, ShareSalaryComponent] as const;
const SHARED_COMPONENTS = [HeaderComponent, ComboboxComponent] as const;

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES,
    ...SHARED_COMPONENTS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
