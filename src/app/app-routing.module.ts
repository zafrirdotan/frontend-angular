import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login/login.page/login.page.component';
import { ChatGptPageComponent } from './chat-gpt-page/chat-gpt-page.component';
import { GroceryBotPage } from './grocery-bot/grocery-bot.page';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'chat/login/callback', component: ChatGptPageComponent },
  { path: 'chat/signup/callback', component: ChatGptPageComponent },
  {
    path: 'chat',
    component: ChatGptPageComponent,
    //canActivate: [AuthGuard]
  },
  { path: 'grocery-bot', component: GroceryBotPage },
  { path: '**', redirectTo: '/chat' },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
