import { Component, OnInit,ViewChild, ElementRef,HostListener, Renderer2 } from '@angular/core';
import {FormControl, Validators,FormGroup,FormBuilder} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/services/authentication/authentication.service';
import { Router } from "@angular/router";
import { MessageService } from 'src/services/message/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('rec_prism') rec_prism: ElementRef;
  roles = [
    {'name':'Employee','id':'3'},
    {'name':'Cheff','id':'2'}
  ]
  loginForm:FormGroup;
  registerForm:FormGroup;
  constructor(private fb: FormBuilder,private AuthenticationService:AuthenticationService,private CookieService:CookieService,private router:Router,private renderer: Renderer2,private MessageService:MessageService) {
    this.login();
    this.register();
  }
  // @ViewChild("wrapper") private wrapper: ElementRef<HTMLElement>;
  public showLogin() {
    this.renderer.setStyle(this.rec_prism.nativeElement, 'transform', `translateZ(-100px)`);
  //   const parentElement = this.wrapper.nativeElement;
  //   const rec_prism = parentElement.querySelector(".rec-prism");

  //   console.log(rec_prism);
  }
  public showSignup(){
    this.renderer.setStyle(this.rec_prism.nativeElement, 'transform', `translateZ(-100px) rotateY( -90deg)`);
  }

  public showForgotPassword(){
    this.renderer.setStyle(this.rec_prism.nativeElement, 'transform', `translateZ(-100px) rotateY( -180deg)`);

  }

   public showSubscribe(){
    this.renderer.setStyle(this.rec_prism.nativeElement, 'transform', `translateZ(-100px) rotateX( -90deg)`);

  }
   public showContactUs(){
    this.renderer.setStyle(this.rec_prism.nativeElement, 'transform', `translateZ(-100px) rotateY( 90deg)`);

  }

    public showThankYou(){
    this.renderer.setStyle(this.rec_prism.nativeElement, 'transform', `translateZ(-100px) rotateX( 90deg)`);

  }

  // @HostListener('document:click', ['$event'])
  // onclick(event) {
  //   if (event.target.matches('.editor-div')) {
  //     alert('click to editor div');
  //   }
  // }
  login() {
    this.loginForm = this.fb.group({
    email :new FormControl('', Validators.required),
    password : new FormControl('', Validators.required),
    role : new FormControl('', Validators.required),

    })
  }

  register() {
    this.registerForm = this.fb.group({
    username :new FormControl('', Validators.required),
    email :new FormControl('', Validators.required),
    password : new FormControl('', Validators.required),
    role : new FormControl('', Validators.required),
    contact : new FormControl('', Validators.required),
    })
  }
  ngOnInit(): void {
  }

  loginData(value){
    let data = {
      'email':value.email,
      'password':value.password,
      'role':value.role
    }

    console.log(data);
    this.AuthenticationService.login(data).subscribe((data)=>{

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

  registerData(value){
    let data = {
      'email':value.email,
      'password':value.password,
      'role':value.role,
      'username':value.username,
      'contact':value.contact,
    }

    console.log(data);
    this.AuthenticationService.register(data).subscribe((data)=>{

      console.log('dasda',data);
      debugger;
      if(data.code==200){
        this.MessageService.successSound();
        this.MessageService.success('Success','Register Successfully.');

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





  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem("currentUser");
    // localStorage.removeItem("coreUser");
    // this.currentUserSubject.next(null);
    // localStorage.clear();
  }
}

