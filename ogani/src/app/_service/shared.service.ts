import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private couponCodeSource = new BehaviorSubject<string>('');
  currentCouponCode = this.couponCodeSource.asObservable();
  

  constructor() {}

  changeCouponCode(code: string) {
    this.couponCodeSource.next(code);
  }
  clearCouponCode() {
    this.couponCodeSource.next('');
  }
  
}