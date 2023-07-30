import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login/login.page/login.page.component';
import { ChatGptPageComponent } from './chat-gpt-steaming-page/chat-gpt-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'chat/login/callback', component: ChatGptPageComponent },
  { path: 'chat/signup/callback', component: ChatGptPageComponent },
  {
    path: 'chat', component: ChatGptPageComponent,
    //canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
