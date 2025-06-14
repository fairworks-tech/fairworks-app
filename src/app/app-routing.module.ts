import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Pages
import { CreateProfileComponent } from "./pages/create-profile/create-profile.component";
import { ShareSalaryComponent } from "./pages/share-salary/share-salary.component";

export const routes: Routes = [
  { path: "", redirectTo: "create-profile", pathMatch: "full" },
  { path: "create-profile", component: CreateProfileComponent },
  { path: "share-salary", component: ShareSalaryComponent },
  { path: "**", redirectTo: "create-profile" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
