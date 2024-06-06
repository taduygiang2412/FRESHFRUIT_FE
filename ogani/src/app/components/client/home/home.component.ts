import { Component, OnInit } from '@angular/core';
import { faBars, faHeart, faPhone, faRetweet, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/_service/cart.service';
import { ProductService } from 'src/app/_service/product.service';
import { WishlistService } from 'src/app/_service/wishlist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]

})
export class HomeComponent implements OnInit {
  

  heart = faHeart;
  bag = faShoppingBag;
  retweet = faRetweet;

  listProductNewest : any;
  listProductPrice: any;
  listProduct: any;

  showDepartment = true;
  sortOptions: any[];
  selectedSortOption: string | undefined;

  



constructor(private productSerive:ProductService,
  private cartService: CartService,
   private wishlistService: WishlistService,
   private messageService: MessageService){
    this.sortOptions = [
      { label: 'Giá tăng dần', value: 'priceAsc' },
      { label: 'Giá giảm dần', value: 'priceDesc' },
      { label: 'Tên A-Z', value: 'nameAsc' },
      { label: 'Tên Z-A', value: 'nameDesc' }
    ];
   }
   

ngOnInit(): void {
  this.getListProduct();  
}


getListProduct(){
  this.productSerive.getListProductNewest(12).subscribe({
    next: res =>{
      this.listProductNewest = res;
      
    },error: err =>{
      console.log(err);
    }
  })
  this.productSerive.getListProductByPrice().subscribe({
    next:res =>{
      this.listProductPrice =res;
      this.sortProducts();
    },error: err=>{
      console.log(err);
    }
  })
}
sortProducts() {
  if (this.selectedSortOption === 'priceAsc') {
    this.listProductNewest.sort((a: any, b: any) => a.price - b.price);
  } else if (this.selectedSortOption === 'priceDesc') {
    this.listProductNewest.sort((a: any, b: any) => b.price - a.price);
  } else if (this.selectedSortOption === 'nameAsc') {
    this.listProductNewest.sort((a: any, b: any) => a.name.localeCompare(b.name));
  } else if (this.selectedSortOption === 'nameDesc') {
    this.listProductNewest.sort((a: any, b: any) => b.name.localeCompare(a.name));
  }
}


addToCart(item: any){
  this.cartService.getItems();
  this.showSuccess("Add to cart successfully!")
  this.cartService.addToCart(item,1);
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
