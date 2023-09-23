import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Pages
import { CreateProfileComponent } from 'src/app/pages/create-profile/create-profile.component';


const routes: Routes = [
  { path: 'create-profile', component: CreateProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
