import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url = 'http://localhost:8080/api/messages';

  constructor(private httpClient: HttpClient) {
  }

  getMessages() {
    return this.httpClient.get<any>(this.url);
  }

  postMessages(mess) {
    return this.httpClient.post(this.url, mess);
  }

  editMessages(mess, id) {
    console.log(id);
    return this.httpClient.put(`${this.url}/${id}`, mess);
  }

  deleteMessages(id) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getMessageById(id) {
    return this.httpClient.get<any>(`${this.url}/${id}`);
  }
}
