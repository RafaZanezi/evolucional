import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlunosComponent } from './alunos/alunos.component';
import { HomeComponent } from './home/home.component';
import { ProfessoresComponent } from './professores/professores.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'alunos', component: AlunosComponent },
  { path: 'professores', component: ProfessoresComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
