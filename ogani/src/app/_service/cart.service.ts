import { EventEmitter, Injectable } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Observable, of, Subject } from 'rxjs';
import { SharedService } from 'src/app/_service/shared.service';



@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: any[] = [];
  totalPrice = 0;
  total = 0;
  discountedPercentage: number = 0;
  discountedPrice: number = 0;
  couponCode: string = '';

  constructor(private sharedService: SharedService) {}

  setDiscountedPrice(discountedPrice: number, discountedPercentage: number) {
    this.discountedPrice = discountedPrice;
    this.discountedPercentage = discountedPercentage;
  }

  getDiscountedPrice(): number {
    return this.discountedPrice;
  }

  getDiscountedPercentage(): number {
    return this.discountedPercentage;
  }

  clearDiscounts() {
    this.discountedPrice = 0;
    this.discountedPercentage = 0;
    this.couponCode = '';
    this.sharedService.changeCouponCode('');
  }

  saveCart(): void {
    localStorage.setItem('cart_items', JSON.stringify(this.items));
  }

  addToCart(item: any, quantity: number) {
    this.loadCart();
    if (!this.productInCart(item)) {
      item.quantity = quantity;
      item.subTotal = item.quantity * item.price;
      this.items.push(item);
    } else {
      this.items.forEach(res => {
        if (res.id === item.id) {
          res.quantity += quantity;
          res.subTotal = res.quantity * res.price;
        }
      });
    }
    this.saveCart();
    this.getTotalPrice();
  }

  updateCart(item: any, quantity: number) {
    this.items.forEach(res => {
      if (res.id === item.id) {
        res.quantity = quantity;
        res.subTotal = res.quantity * res.price;
      }
    });
    this.saveCart();
    this.getTotalPrice();
  }

  productInCart(item: any): boolean {
    return this.items.findIndex((x: any) => x.id === item.id) > -1;
  }

  loadCart(): void {
    this.items = JSON.parse(localStorage.getItem('cart_items') as any) || [];
    this.getTotalPrice();
  }

  getItems() {
    return this.items;
  }

  getTotalPrice() {
    this.totalPrice = 0;
    this.items.forEach(res => {
      this.totalPrice += res.subTotal;
      this.total = this.totalPrice;
    });
    return this.totalPrice;
  }

  getTotalPriceWithDiscount() {
    let totalPrice = this.getTotalPrice();
    if (this.discountedPrice !== null) {
      return this.discountedPrice;
    }
    return totalPrice;
  }

  remove(item: any) {
    const index = this.items.findIndex((o: any) => o.id === item.id);
    if (index > -1) {
      this.items.splice(index, 1);
      this.saveCart();
    }
    this.getTotalPrice();
  }

  clearCart() {
    this.items = [];
    this.getTotalPrice();
    localStorage.removeItem('cart_items');
  }
  getCartItemDetailsById(itemId: any) {
    return this.items.find(item => item.id === itemId);
  }


}
