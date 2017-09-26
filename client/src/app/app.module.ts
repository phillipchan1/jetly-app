// application-wide modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { AuthService } from './services/auth/auth.service';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { NavComponent } from './components/nav/nav.component';
import { AuthComponent } from './components/auth/auth.component';


const appRoutes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'board',
    component: BoardComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    NavComponent,
    AuthComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
