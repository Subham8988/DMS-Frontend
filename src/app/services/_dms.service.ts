import { environment } from '../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserActionService {

  constructor(private httpRequest :HttpClient) { }

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
        environment.dmsUrl+'UploadDoc', 
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
       let url= environment.dmsUrl+'getAllDoc';
       let res = await lastValueFrom(this.httpRequest.get<any>(url));
       return res;
    } catch (error) {
        return error;
    }
  }

}
