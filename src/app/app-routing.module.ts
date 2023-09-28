import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login/login.page/login.page.component';
import { ChatGptPageComponent } from './chat-gpt-steaming-page/chat-gpt-page.component';
import { GroceryBotPageV1 } from './grocery-bot/grocery-bot.page';
import { GroceryBotPageV2 } from './grocery-bot-v2/grocery-bot.page';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'chat/login/callback', component: ChatGptPageComponent },
  { path: 'chat/signup/callback', component: ChatGptPageComponent },
  {
    path: 'chat', component: ChatGptPageComponent,
    //canActivate: [AuthGuard] 
  },
  { path: 'grocery-bot-v1', component: GroceryBotPageV1 },
  { path: 'grocery-bot', component: GroceryBotPageV2 },
  { path: '**', redirectTo: '/chat' },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
