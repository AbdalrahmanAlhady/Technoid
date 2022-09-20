import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CoreComponent } from './core/core.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { LoaderSpinnerComponent } from './shared/loader-spinner/loader-spinner.component';
import { RouterModule, Routes } from '@angular/router';
import { CourseIconComponent } from './shared/icons/course-icon/course-icon.component';
import { NgParticlesModule } from 'ng-particles';
import { SubCourseIconComponent } from './shared/icons/sub-course-icon/sub-course-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AuthInterceptor} from './auth/auth_interceptor.service';
import { AuthGuard } from './auth/auth.guard.service';
import { AuthPageGuard } from './auth/authPage.guard.service';
import { CourseComponent } from './courses-list/course/course.component';
import { QuestionComponent } from './core/question/question.component';
import { ConclusionIconComponent } from './shared/icons/conclusion-icon/conclusion-icon.component';
import { QuestionIconComponent } from './shared/icons/question-icon/question-icon.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RecommendationIconComponent } from './shared/icons/recommendation-icon/recommendation-icon.component';

const appRoutes: Routes = [
  {path:'',redirectTo: 'technoidWithYou', pathMatch: 'full'},
  { path: 'technoidWithYou', component: CoreComponent,canActivate:[AuthGuard] },
  { path: 'courses', component: CoursesListComponent,canActivate:[AuthGuard] },
  { path: 'auth', component: AuthComponent,canActivate:[AuthPageGuard] },
];
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavBarComponent,
    CoreComponent,
    CoursesListComponent,
    LoaderSpinnerComponent,
    CourseIconComponent,
    SubCourseIconComponent,
    LoaderSpinnerComponent,
    CourseComponent,
    QuestionComponent,
    ConclusionIconComponent,
    QuestionIconComponent,
    RecommendationIconComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgParticlesModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
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
