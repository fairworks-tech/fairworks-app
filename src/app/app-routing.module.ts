import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Pages
import { CreateProfileComponent } from "src/app/pages/create-profile/create-profile.component";
import { ShareSalaryComponent } from "src/app/pages/share-salary/share-salary.component";

const routes: Routes = [
  { path: "create-profile", component: CreateProfileComponent },
  { path: "share-salary", component: ShareSalaryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
