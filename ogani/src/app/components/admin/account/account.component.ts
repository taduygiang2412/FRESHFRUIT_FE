import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  listAccount : any;
  constructor(private userService: UserService){

  }
  ngOnInit(): void {
    this.getListUser();
  }
  getListUser(){
    this.userService.getListUser().subscribe({
      next: res=>{
        this.listAccount = res;
        console.log(this.listAccount);
      },error: err =>{
        console.log(err);
      } 
    })
  }

}
