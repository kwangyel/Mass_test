import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router 
  ) { }
  canActivate(): boolean {
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/'])
      return false
    }
    return true
  }
}
