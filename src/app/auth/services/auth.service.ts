import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService) {}

  login(username: string, password: string) {
    return this.api.post('/login', { username, password });
  }

  me() {
    return this.api.get('/me');
  }

  logout() {
    return this.api.post('/logout', {});
  }
}
