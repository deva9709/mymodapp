import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../common/api-client.service';


const routes = {
    getToken: 'mod/TokenGenerator/Generate?identity='
  };

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  constructor(private apiClient: ApiClientService) { }  
  
  getToken(identity): Observable<any> {
    return this.apiClient.post(routes.getToken + identity);
  }
}