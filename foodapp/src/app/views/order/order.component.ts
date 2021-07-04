import { Component, OnInit, Renderer2 } from '@angular/core';
import {FormControl, Validators,FormGroup,FormBuilder} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CommonserviceService } from 'src/services/commonservice/commonservice.service';
import { MessageService } from 'src/services/message/message.service';

import { Router } from "@angular/router";
import { OrdersService } from 'src/services/orders/orders.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderForm:FormGroup;
  myOrders:any=[];

  order() {
    this.orderForm = this.fb.group({
    order :new FormControl('', Validators.required),
    givenPayment :new FormControl('', Validators.required),

    })
  }
  constructor(
    private fb: FormBuilder,private CookieService:CookieService,private OrdersService:OrdersService,private router:Router,private renderer: Renderer2,private MessageService:MessageService,private CommonService:CommonserviceService
  ) {

    this.order();
  }

  ngOnInit(): void {
    this.CommonService.myOrdersSockets().subscribe((data)=>{

       this.myOrders = data.myOrders
     })
  }


  createOrder(value){
    let data = {
      'email':value.order,
      'givenPayment':value.givenPayment,
    }


    this.OrdersService.orderBook(data).subscribe((data)=>{

      console.log('dasda',data);
      debugger;
      if(data.code==200){
        this.MessageService.successSound();
        this.MessageService.success('Success','Login Successfully.');
       if(data.user_token=='chef'){
        this.CookieService.set('user_token',data.user_token);
        this.CookieService.set('token',data.token);
        this.router.navigateByUrl("/chef");
       }else if(data.user_token=='user'){
        this.CookieService.set('user_token',data.user_token);
        this.CookieService.set('token',data.token);
        this.router.navigateByUrl("/order");
       }
      }
      // this.CookieService.set('role', 'Hello World' );
      // this.CookieService.set('token', 'Hello World' );
      // if(data.success==true){
      //   this.ToastMessageService.success('Success','Category Added Successfully');
      //   this.ToastMessageService.successSound();
      //   this.getCategory();
      //   this.table.renderRows();
      // }else{
      //   this.ToastMessageService.error('Error','Something went wrong.');
      // }

    },
    error => {
      this.MessageService.cancelSound();
      this.MessageService.error('Error','Email Already Exist.');
      // if(error.status==422){
      //   console.log('errr',error);
      //   this.ToastMessageService.error(error.error.errors.category_name,'Error');
      // }else{
      //   this.ToastMessageService.error('Some Server Error!','Error!');
      // }

    },

    );
  }

}
