import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const COUPON_API = "http://localhost:8080/api/coupon/";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(private http: HttpClient) { }


  calculateCouponValue(couponCode: string, totalAmount: number): Observable<number> {
    let params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount.toString());

    return this.http.get<number>(COUPON_API + 'calculate', { params: params });
  }


  
}
