import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  showSignOut: boolean = false;
  constructor(private router: Router,private authService:AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/courses') {
          this.showSignOut = true;
        } else {
          this.showSignOut = false;
        }
      }
    });
  }

  ngOnInit(): void {

  }
  logOut(){
    this.authService.logout();
  }
}
