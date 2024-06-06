import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/_service/order.service';
import { StorageService } from 'src/app/_service/storage.service';
import { CartService } from 'src/app/_service/cart.service';
import { checkoutService } from 'src/app/_service/checkout.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { OrderDetail } from 'src/app/_class/order-detail';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {

  // listOrder: any[]; // Assuming listOrder is populated with your orders
  listOrder: any[] = [];
  selectedOrder: any;
  productDialogVisible: boolean = false;
  // productDialogVisible: boolean = false;
  // selectedOrder: any;
  items : any[] =[];
  selectedProducts: any[] = [];

  // listOrder:any;
  username: any;
  statuses = [
    { label: 'Chờ Xác nhận ', value: '1' },
    { label: 'Chuẩn bị hàng', value: '2' },
    { label: 'Đang giao hàng', value: '3' },
    { label: 'Giao thành công', value: '4' },
    { label: 'Đã hủy', value: '5' }
    
  ];
  constructor(private orderService: OrderService,
    private storageService: StorageService,
    public cartService: CartService,
    private CheckoutService: checkoutService,
    
  )
  {this.fetchOrders();}
  

  ngOnInit(): void {
    this.username = this.storageService.getUser().username;
    this.getListOrder();
    this.cartService.getItems();
    this.loadOrders();
  }
  fetchOrders() {
    // Fetch your orders from the service
    this.orderService.getListOrder().subscribe(data => {
      this.listOrder = data;
    });
  }
  getItems() {
    return this.items;
    
  }
  getCartItems() {
    return this.cartService.getItems();
  }
  loadOrders() {
    // Load orders from your data source, e.g., a service or API
    // For demonstration, we will load from localStorage
    this.listOrder = JSON.parse(localStorage.getItem('orders') as string) || [];
  }

  getListOrder(){
    this.orderService.getListOrderByUser(this.username).subscribe({
      next: res=>{
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
          const storedOrdersParsed = JSON.parse(storedOrders);
          this.listOrder = res.map((order: { id: any; status: string; }) => {
            const storedOrder = storedOrdersParsed.find((storedOrder: any) => storedOrder.id === order.id);
            if (storedOrder) {
              order.status = storedOrder.status;
            } else {
              order.status = '1'; // Giá trị mặc định là 'Chuẩn bị hàng'
            }
            return order;
          });
        } else {
          this.listOrder = res.map((order: { status: string; }) => {
            order.status = '1'; // Giá trị mặc định là 'Chuẩn bị hàng'
            return order;
          });
        }
        // this.filterCancelledOrders();
        this.saveOrdersToLocalStorage();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  filterCancelledOrders() {
    this.listOrder = this.listOrder.filter((order: { status: string; }) => order.status !== '5');
  }
  
  // showProductDetails(order: any) {
  //   this.selectedOrder = order;
  //   this.productDialogVisible = true;
  // }
  // showProductDetails(order: any) {
  //   this.selectedOrder = order;
  //   this.selectedOrder.orderDetails = this.selectedOrder.orderDetails.map((detail: any) => {
  //     const productDetails = this.cartService.getCartItemDetailsById(detail.productId);
  //     return { ...detail, ...productDetails };
  //   });
  //   this.productDialogVisible = true;
  // }
  showProductDetails(event: Event, orderId: number, overlaypanel: OverlayPanel): void {
    this.orderService.getOrderDetailsByOrderId(orderId).subscribe(
      (data: OrderDetail[]) => {
        this.selectedProducts = data;
        overlaypanel.toggle(event);
      },
      error => {
        console.error('Error fetching order details', error);
      }
    );
  }
  saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(this.listOrder));
  }
  getStatusLabel(status: string): string {
    const foundStatus = this.statuses.find(s => s.value === status);
    return foundStatus ? foundStatus.label : 'Chờ Xác nhận ';
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
  requestCancelOrder(order: any) {
    if (order.status != '1') {
        alert('order not delete.');
        return;
    }

    if (confirm(`you want delete order #${order.id}?`)) {
        order.status = '5'; // Set status to 'Yêu cầu hủy'
        
        this.saveOrdersToLocalStorage();
    }
}

}
