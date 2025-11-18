import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment.production';
import { switchMap, catchError } from 'rxjs/operators';
import { from } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, JsonPipe, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private base = environment.apiBase;
  isLoggingIn = false;
  isLoggedIn = false;

  username = '';
  password = '';
  out: any;
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(private auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.onMe();
  }

  onLogin() {
    if (this.isLoggingIn) return;

    this.isLoggingIn = true;

    this.auth
      .login(this.username, this.password)
      .pipe(
        switchMap(() => from(this.router.navigate(['/myblog']))),
        catchError((err) => {
          alert(err?.error?.message ?? '로그인/초기화 중 오류');
          throw err;
        })
      )
      .subscribe({
        next: () => {
          this.isLoggingIn = false;
          this.isLoggedIn = true;
        },
        error: () => {
          this.isLoggingIn = false;
        },
      });
  }

  onMe() {
    this.auth.me().subscribe({
      next: () => (this.isLoggedIn = true),
      error: () => (this.isLoggedIn = false),
    });
  }

  onLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.out = { ok: true };
        this.isLoggedIn = false;
      },
      error: (err) => (this.out = err?.error ?? err),
    });
  }

  onLoginSuccess() {
    const redirectUrl =
      this.route.snapshot.queryParamMap.get('redirectUrl') || '/';
    this.router.navigateByUrl(redirectUrl);
  }
}
