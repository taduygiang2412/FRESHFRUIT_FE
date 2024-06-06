import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const PAYMENT_API = "http://localhost:8080/api/payment/";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class checkoutService {

  constructor(private http:HttpClient) { }

  urlVNPay = new BehaviorSubject<string>('')
  
  
  
  createPayment(total_price:number):Observable<any>{
    return this.http.get(PAYMENT_API + 'create_payment/'+total_price,httpOptions);
  }

  

  
  


}
