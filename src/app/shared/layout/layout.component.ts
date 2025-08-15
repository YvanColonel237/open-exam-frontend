import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  isLoggedIn$: Observable<boolean>;
  userType$: Observable<'ADMINISTRATEUR' | 'PROFESSEUR' | 'CANDIDAT' | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userType$ = this.authService.userType$;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns, {});

    const sidenavs = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavs);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
