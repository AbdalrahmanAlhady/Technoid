import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CoreComponent } from './core/core.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoursesComponent } from './courses/courses.component';
import { LoaderSpinnerComponent } from './shared/loader-spinner/loader-spinner.component';
import { RouterModule, Routes } from '@angular/router';
import { CourseIconComponent } from './shared/icons/course-icon/course-icon.component';
import { NgParticlesModule } from 'ng-particles';
import { SubCourseIconComponent } from './shared/icons/sub-course-icon/sub-course-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AuthInterceptor} from './auth/auth_interceptor.service';
import { AuthGuard } from './auth/auth.guard.service';
import { AuthPageGuard } from './auth/authPage.guard.service';
const appRoutes: Routes = [
  {path:'',redirectTo: 'technoidWithYou', pathMatch: 'full'},
  { path: 'technoidWithYou', component: CoreComponent,canActivate:[AuthGuard] },
  { path: 'courses', component: CoursesComponent,canActivate:[AuthGuard] },
  { path: 'auth', component: AuthComponent,canActivate:[AuthPageGuard] },
];
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavBarComponent,
    CoreComponent,
    CoursesComponent,
    LoaderSpinnerComponent,
    CourseIconComponent,
    SubCourseIconComponent,
    LoaderSpinnerComponent,


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgParticlesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
  },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
