import { Component } from '@angular/core';
import { faBars, faHeart, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/_service/cart.service';
import { OrderService } from 'src/app/_service/order.service';
import { CouponService } from 'src/app/_service/coupon.service';
import { SharedService } from 'src/app/_service/shared.service';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  bars = faBars;
  

  showDepartment = false;
  orderService: any;
  couponCode: string = '';
  discountedPrice: number | null = null;
  discountedPercentage: number = 0;
  errorMessage: string = '';

  constructor(public cartService: CartService,
     private couponService: CouponService,
     private sharedService: SharedService,private messageService:MessageService,){

  }

  showDepartmentClick(){
    this.showDepartment = !this.showDepartment;
  }


  removeFromCart(item:any){
    this.cartService.remove(item);
  }

  updateQuantity(item: any,event: any){
    let quantity : number = event.target.value;
    this.cartService.updateCart(item,quantity);
  }

  plusQuantity(item:any){
    let quantity = Number(item.quantity);
    this.cartService.updateCart(item,quantity+=1);
  } 
  subtractQuantity(item: any){
    if(item.quantity > 1){
      let quantity = Number(item.quantity);
      this.cartService.updateCart(item,quantity-=1);
    }
  }
  applyCoupon() {
    const totalAmount = this.cartService.getTotalPrice();
    this.couponService.calculateCouponValue(this.couponCode, totalAmount)
      .subscribe(
        (discountedPrice: number) => {
          this.discountedPrice = discountedPrice;
          this.discountedPercentage = ((totalAmount - discountedPrice) / totalAmount) * 100;
          this.cartService.setDiscountedPrice(discountedPrice, this.discountedPercentage);
          this.errorMessage = '';
          this.sharedService.changeCouponCode(this.couponCode);
          this.showSuccess("Apply Coupon successfully");
          
        },
        (error: any) => {
          this.errorMessage = 'Invalid coupon code';
          this.cartService.setDiscountedPrice(totalAmount, 0);// Đặt lại giá trị nếu mã không hợp lệ
          console.error('Error applying coupon', error);
          this.showError("Coupon not found");
        }
      );
  }
  // clearDiscounts() {
  //   this.discountedPercentage = 0;
  //   this.discountedPrice = 0;
    
  // }
  showSuccess(text: string) {
    this.messageService.add({severity:'success', summary: 'Success', detail: text});
  }
  showError(text: string) {
    this.messageService.add({severity:'error', summary: 'Error', detail: text});
  }

  showWarn(text: string) {
    this.messageService.add({severity:'warn', summary: 'Warn', detail: text});
  }

  
  



}
