import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  newMess = new Subject<any>();
  public stompClient: any;

  constructor() {
  }

  private onConnect = () => {
    this.stompClient.subscribe('/topic/mess', (payload) => {
      console.log(JSON.parse(payload.body));
      this.newMess.next(JSON.parse(payload.body));
    });
  };

  connect() {
    const socket = new SockJS('http://localhost:8080//socketMessage/');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, this.onConnect);
  }
}
