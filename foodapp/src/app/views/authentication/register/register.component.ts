import { Component, OnInit } from '@angular/core';
import {FormControl, Validators,FormGroup,FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form:FormGroup;
  constructor(private fb: FormBuilder) {
    this.registerForm();
  }

  roles = [
    {'name':'Employee','id':'3'}
  ]

  registerForm() {
    this.form = this.fb.group({
    username :new FormControl('', Validators.required),
    email :new FormControl('', Validators.required),
    password : new FormControl('', Validators.required),
    role : new FormControl('', Validators.required),
    contact : new FormControl('', Validators.required),
    })
  }
  ngOnInit(): void {
  }


  register(value){
    console.log(value)
  }

}
