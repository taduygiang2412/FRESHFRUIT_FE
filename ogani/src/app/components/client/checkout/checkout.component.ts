import { Component, OnInit } from '@angular/core';
import { faBars, faHeart, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/_class/order';
import { OrderDetail } from 'src/app/_class/order-detail';

import { CartService } from 'src/app/_service/cart.service';
import { checkoutService } from 'src/app/_service/checkout.service';
import { OrderService } from 'src/app/_service/order.service';
import { StorageService } from 'src/app/_service/storage.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { CouponService } from 'src/app/_service/coupon.service';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';





@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],

  providers: [MessageService]

})
export class CheckoutComponent implements OnInit {
  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  bars = faBars;
  showDepartment = false;
  order = new Order();
  listOrderDetail: any[] =[];
  username !: string;
  paymentCash: boolean = true;
  selectedPaymentMethod: string | undefined;
  total_pricePayment =0;
  couponCode: string = '';
  discountedPercentage: number = 0;
  discountedPrice: number = 0;
  errorMessage: string = '';
  productDialogVisible: boolean = false;
  selectedOrder: Order | null = null;
  selectedProducts: any[] = [];
  
  
  updateForm: any ={
    firstname: null,
    lastname: null,
    email: null,
    country: null,
    state:null,
    address: null,
    phone: null,
    town : null,
    postCode: null,
    note: null
    
  }
  user :any;
  
  orderForm :any ={
    firstname: null,
    lastname : null,
    country : null,
    address : null,
    town : null,
    state : null,
    postCode: null,
    email: null,
    phone: null,
    note: null,
    totalPrice:null

  }

  constructor(public cartService: CartService,
    private orderService:OrderService,
    private storageService: StorageService,
    private messageService:MessageService,
    private checkoutService:checkoutService,
    private couponService: CouponService,
    private sharedService: SharedService,
    private userService: UserService,
    public http: HttpClient,){
    
  }
  ngOnInit(): void {
    this.username = this.storageService.getUser().username;
    this.cartService.getItems();
    console.log(this.username);
    this.discountedPercentage = this.cartService.getDiscountedPercentage();
    this.discountedPrice = this.cartService.getDiscountedPrice();
    this.sharedService.currentCouponCode.subscribe(code => this.couponCode = code);
    this.getUser();
    
  }
  getUser(){
    this.userService.getUser(this.username).subscribe({
      next: res=>{
        this.user = res;
        this.updateForm.firstname = res.firstname;
        this.updateForm.lastname = res.lastname;
        this.updateForm.email = res.email;
        this.updateForm.country = res.country;
        this.updateForm.state = res.state;
        this.updateForm.address = res.address;
        this.updateForm.phone = res.phone;
      },error : err =>{
        console.log(err);
      }
    })
  }
  updateProfile(){
    const{firstname,lastname,email,country,state,address,phone} = this.updateForm;
    this.userService.updateProfile(this.username,firstname,lastname,email,country,state,address,phone).subscribe({
      next: res =>{
        this.getUser();
        this.showSuccess("UpdateProfile Successfully!")

      },error: err=>{
        console.log(err);
      }
    })
  }

  showDepartmentClick(){
    this.showDepartment = !this.showDepartment;
  }
  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
  }
  
  placeOrder() {
    if (this.cartService.items.length === 0) {
      this.showError("Shopping cart is empty");
      return; // Return early to prevent order processing
    }
    this.clearDiscounts();
   
    this.cartService.items.forEach(res => {
      let orderDetail: OrderDetail = new OrderDetail();
      orderDetail.name = res.name;
      orderDetail.price = res.price;
      orderDetail.quantity = res.quantity;
      orderDetail.subTotal = res.subTotal;
      this.listOrderDetail.push(orderDetail);
    });
    this.selectedProducts = this.listOrderDetail;

    const totalPrice1 = this.cartService.getDiscountedPrice() || this.cartService.getTotalPrice();
    
    if (this.selectedPaymentMethod === 'cash') {
      this.showSuccess("Payment success!");
    }
    else if (this.selectedPaymentMethod === 'vnpay'){
    
        this.getUrlVNPay(totalPrice1); 
    }
    else{
      // this.showError("Chưa chọn phương thức thanh toán")
    }

    const{firstname,lastname,email,country,state,address,phone,town,postCode,note} = this.updateForm;
    this.orderService.placeOrder(firstname,lastname,country,address,town,state,postCode,phone,email,note,this.listOrderDetail,this.username,this.couponCode).subscribe({
      next: res =>{
      
        this.cartService.clearCart();
        this.clearDiscounts();
        this.updateProfile;
      },error: err=>{
        console.log(err);
      }
    })
    

  }
  clearDiscounts() {
    this.discountedPercentage = 0;
    this.discountedPrice = 0;
    
  }
  getUrlVNPay(Price: number) {
    
     this.checkoutService.createPayment(Price).subscribe({
      next: (res) => {
          this.checkoutService.urlVNPay.next(res.url);
          console.log(this.checkoutService.urlVNPay.value);
          window.open(this.checkoutService.urlVNPay.value);
      },
      
  });
     
  }
  getOrderDetails(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe({
      next: res => {
        this.selectedOrder = res;
        this.productDialogVisible = true;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  
  
  
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
