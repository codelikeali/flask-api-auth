import { Component, OnInit } from '@angular/core';
import {FormControl, Validators,FormGroup,FormBuilder} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  size:any=[];
  vendor:any=[];
  type:any=[];
  form:FormGroup;
  createForm() {
    this.form = this.fb.group({
    vendor_uuid :new FormControl('', Validators.required),
    size_uuid :new FormControl('', Validators.required),
    type_uuid : new FormControl('', Validators.required),
    category_name : new FormControl('', Validators.required),
    category_nitch : new FormControl('', Validators.required),
    })
  }



  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddComponent>,

    ) { this.createForm();}





  ngOnInit(): void {
  }

  addCategory(form_value){
    this.dialogRef.close({action:'Add',data:form_value});
  }

}
