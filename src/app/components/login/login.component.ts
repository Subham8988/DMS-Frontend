import {  Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  test : Date = new Date();
  logFormData!:FormGroup;

  constructor(private toastrService: ToastrService,private route :Router) { }
  ngOnInit(): void {
    this.logFormData = new FormGroup({
      email:new FormControl(''),
      password:new FormControl('')
    })
  }



  async logInCall()  {
   const logIndata = this.logFormData.value;
   if(logIndata['email']=='admin@gmail.com'&&logIndata['email']!=null&&logIndata['email']!=undefined)
   {
    if(logIndata['password']=='admin'&&logIndata['password']!=null&&logIndata['password']!=undefined)
    {
    this.route.navigate(['Admin/Dashboard'])
    }
    else{this.toastrService.error('Message please enter a valid password!', ' Error!');}
   }
   else{this.toastrService.error('Message please enter a valid email!', ' Error!');}

  //  console.log('logIndata',logIndata);

  }

}
