import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart, faRetweet, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/_service/cart.service';
import { CategoryService } from 'src/app/_service/category.service';
import { ProductService } from 'src/app/_service/product.service';
import { WishlistService } from 'src/app/_service/wishlist.service';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  providers: [MessageService]

})
export class ShopComponent implements OnInit {
  [x: string]: any;

  
  bag = faShoppingBag;
  retweet = faRetweet;

  id: number = 0;
  listProduct : any;
 
  listCategory : any;
  listProductNewest : any[] = [];

  rangeValues = [0,200000];
  sortOptions: any[];
  selectedSortOption: string | undefined;
  

  constructor(
    
    private categoryService:CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    public cartService:CartService,
    private messageService:MessageService,
    public wishlistService:WishlistService){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.sortOptions = [
      { label: 'Giá tăng dần', value: 'priceAsc' },
      { label: 'Giá giảm dần', value: 'priceDesc' },
      { label: 'Tên A-Z', value: 'nameAsc' },
      { label: 'Tên Z-A', value: 'nameDesc' }
    ];

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getListProductByCategory();
    this.getListCategoryEnabled();
    this.getNewestProduct();
    // this.getListProduct();
    
  
  }
  


  getListProductByCategory(){
    this.productService.getListByCategory(this.id).subscribe({
      next: res =>{
        this.listProduct = res;
        this.sortProducts();
      },error: err =>{
        console.log(err);
      } 
    })
    // this.productService.getListProductNewest(9).subscribe({
    //   next:res =>{
    //     this.listProductNewest = res;
    //     this.sortProducts();
    //   },error: err =>{
    //     console.log(err);
    //   }
    // })
  }

  getListCategoryEnabled(){
    this.categoryService.getListCategoryEnabled().subscribe({
      next: res =>{
        this.listCategory = res;
      },error: err=>{
        console.log(err);
      }
    })
  }

  getNewestProduct(){
    this.productService.getListProductNewest(4).subscribe({
      next:res =>{
        this.listProductNewest = res;
        this.sortProducts();
      },error: err =>{
        console.log(err);
      }
    })
  }
  
  getListProductByPriceRange(){
  
    this.productService.getListByPriceRange(this.id,this.rangeValues[0],this.rangeValues[1]).subscribe({
      next: res =>{
        this.listProduct = res;
        console.log(this.listProduct);
        
      },error: err =>{
        console.log(err);
      }
    })
  }
  sortProducts() {
    if (this.selectedSortOption === 'priceAsc') {
      this.listProduct.sort((a: any, b: any) => a.price - b.price);
    } else if (this.selectedSortOption === 'priceDesc') {
      this.listProduct.sort((a: any, b: any) => b.price - a.price);
    } else if (this.selectedSortOption === 'nameAsc') {
      this.listProduct.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (this.selectedSortOption === 'nameDesc') {
      this.listProduct.sort((a: any, b: any) => b.name.localeCompare(a.name));
    }
  }

  addToCart(item: any){
    this.cartService.getItems();
    this.showSuccess("Add to cart successfully")
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
