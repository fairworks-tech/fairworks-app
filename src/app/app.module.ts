import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// pages
import { CreateProfileComponent } from "./pages/create-profile/create-profile.component";
import { ShareSalaryComponent } from "./pages/share-salary/share-salary.component";

// shared
import { HeaderComponent } from "./shared/components/header/header.component";
import { ComboboxComponent } from "./shared/components/combobox/combobox.component";

export const FW_PAGES: any[] = [CreateProfileComponent, ShareSalaryComponent];

export const FW_SHARED_COMPONENTS: any[] = [HeaderComponent, ComboboxComponent];

@NgModule({
  declarations: [AppComponent, FW_PAGES, FW_SHARED_COMPONENTS],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
