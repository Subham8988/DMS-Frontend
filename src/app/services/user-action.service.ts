import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class UserActionService {

  constructor(private httpRequest :HttpClient) { }

  async allUserList()
  {
    try {
       let url= environment.baseurl+"/all_users";
       let res = await lastValueFrom(this.httpRequest.get<any>(url));
       return res;
    } catch (error) {
        return error;
    }
  }

  async tokenGenration(payload:any)
  {
    try {
       let url= environment.dmsUrl+"getDmsToken";
       let res = await lastValueFrom(this.httpRequest.post<any>(url,payload));
       return res;
    } catch (error) {
        return error;
    }
  }
  async uploadDoc(formData: any, token: any) {
    try {
      console.log('uploadDoc function called'); // Debugging log
      
      const response = await this.httpRequest.post(
        'http://35.193.158.197:5000/dms/v1/UploadDoc', 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      ).toPromise();
  
      console.log('API Response:', response); // Check API response
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error);
      alert('File upload failed! Please try again.');
    }
  }
  

  async getAllDoc()
  {
    try {
       let url= 'http://localhost:5000/dms/v1/getAllDoc';
       let res = await lastValueFrom(this.httpRequest.get<any>(url));
       return res;
    } catch (error) {
        return error;
    }
  }

  // role list
  async roleList()
  {
    try {
      let url = environment.baseurl+"/roleList";
      let res = await lastValueFrom(this.httpRequest.get<any>(url));
       return res;
    } catch (error) {
      return error
    }
  }

   // permission list
   async permissionList()
   {
     try {
       let url = environment.baseurl+"/permissonsList";
       let res = await lastValueFrom(this.httpRequest.get<any>(url));
        return res;
     } catch (error) {
       return error
     }
   }

  // create user
  async createUser(payload:any)
  {
    try {
     let url =environment.baseurl+"/creatUser";
     let res = await lastValueFrom(this.httpRequest.post<any>(url,payload));
     return res;
    } catch (error) {
     return error;
      }
  }

  // create role
  async createRole(payload:any)
  {
    try {
      let url =environment.baseurl+"/createRole";
      let res = await lastValueFrom(this.httpRequest.post<any>(url,payload));
      return res
    } catch (error) {
      return error
    }
  }

  // create Permisssons
  async createPermission(payload:any)
  {
    try {
      let url =environment.baseurl+"/createPermissons";
      let res = await lastValueFrom(this.httpRequest.post<any>(url,payload));
      return res
    } catch (error) {
      return error
    }
  }

  //delte user
  async delteUser(user_id:any){
    try {
      let url =environment.baseurl+"/deleteUser?user_id="+user_id;
      let res = await lastValueFrom(this.httpRequest.delete<any>(url));
      return res
    } catch (error) {
      return error;
    }
  }
}
