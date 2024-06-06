import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { OrderDetail } from 'src/app/_class/order-detail';
import { OrderService } from 'src/app/_service/order.service';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [MessageService]
})
export class OrderComponent implements OnInit {

  listOrder: any[] = [];
  selectedProducts: any[] = [];
  statuses = [
    { label: 'Xác nhận đơn hàng', value: '1' },
    { label: 'Chuẩn bị hàng', value: '2' },
    { label: 'Đang giao hàng', value: '3' },
    { label: 'Giao thành công', value: '4' },
    { label: 'Hủy', value: '5' }
    
  ];
  

  constructor(private orderService: OrderService,
    private messageService:MessageService 
  ){
    

  }

  ngOnInit(): void {
    this.getListOrder();
    
  }
  getListOrder() {
    this.orderService.getListOrder().subscribe({
      next: res => {
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
  
  filterCancelledOrders() {
    this.listOrder = this.listOrder.filter(order => order.status !== '5');
  }

  saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(this.listOrder));
  }

  cancelOrder(order: any) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      order.status = '5'; // Set status to 'Hủy'
      // this.listOrder = this.listOrder.filter(o => o.id !== order.id); // Remove order from list
      this.saveOrdersToLocalStorage();
      this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đơn hàng đã được hủy' });
    }
  }
  getStatusLabel(status: string): string {
    const foundStatus = this.statuses.find(s => s.value === status);
    return foundStatus ? foundStatus.label : 'Unknown';
  }
  
  changeStatus(order: any) {
    const currentIndex = this.statuses.findIndex(s => s.value === order.status);
    const nextIndex = (currentIndex + 1) % this.statuses.length;
    order.status = this.statuses[nextIndex].value;
    this.saveOrdersToLocalStorage();
  }

  
  getButtonLabel(order: any): string {
    const foundStatus = this.statuses.find(s => s.value === order.status);
    return foundStatus ? foundStatus.label : 'Xác nhận đơn hàng';
    
  }
  



}
