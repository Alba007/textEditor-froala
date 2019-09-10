import {Component, NgZone, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {MessageService} from './message.service';
import {message} from './message';
import {MatDialog} from '@angular/material';
import {SocketService} from './socket.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  formO = '<';
  openForm = false;
  open = new BehaviorSubject<any>(undefined);
  data: message;
  icon: any;
  markers: any[] = [];
  title = 'login';
  public map: L.Map;
  public msg = '';
  messages: message[] = [];
  options = {
    layers: [
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        attribution: '...'
      })
    ],
    zoom: 3,
    center: L.latLng(35, 45)
  };

  constructor(
    private MessageServ: MessageService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private socket: SocketService) {
    this.open.next('');
  }

  ngOnInit() {
    this.socket.connect();
    this.socket.newMess.subscribe(data => {
        this.msg = data.file;
        if (data.type === 'put') {
          const pos = this.messages.findIndex(value => {
            return value.id === data.id;
          });
          this.messages[pos] = {
            id: data.id,
            latitude: data.latitude,
            longitude: data.longitude,
            file: data.file
          };
          this.map.removeLayer(this.markers[pos]);
          const icon = L.icon({
            iconSize: [
              50, 41],
            iconAnchor: [13, 41],
            iconUrl: '../assets/icon.svg',
            popupAnchor: [17, -30]
          });
          this.markers[pos] = L.marker([data.latitude, data.longitude], {
            icon,
            myCustomId: data.id,
            autoPan: true,
            clickable: true
          }).on('click', () => {
            this.ngZone.run(() => {
              this.openForm = false;
              this.data = data;
              this.openFormEditor();
              this.open.next(this.data);
            });
          }).addTo(this.map);
        } else {
          if (data.type === 'post') {
            this.messages.push({
              id: data.id,
              message: data.message,
              latitude: data.latitude,
              longitude: data.longitude,
              file: data.file
            });
            const icon = L.icon({
              iconSize: [
                50, 41],
              iconAnchor: [13, 41],
              iconUrl: '../assets/icon.svg',
              popupAnchor: [17, -30]
            });
            const marker = L.marker([data.latitude, data.longitude], {
              icon,
              myCustomId: data.id,
              autoPan: true,
              clickable: true
            }).on('click', () => {
              this.ngZone.run(() => {
                // this.openDialog(data);
                this.data = data;
                this.openForm = false;
                this.openFormEditor();
                this.open.next(this.data);
              });
            }).addTo(this.map);
            this.markers.push(marker);
          } else {
            if (data.type === 'delete') {
              const del = this.messages.find(current => {
                return current.id === data.id;
              });
              const posDel = this.messages.indexOf(del);
              this.messages.splice(posDel, 1);
              this.map.removeLayer(this.markers[posDel]);
              this.markers.splice(posDel, 1);
            } else {
              alert('forbidden');
            }
          }
        }
      }
    );
  }

  onMapReady(map: L.Map) {
    this.MessageServ.getMessages().subscribe(mess => {
      this.messages = mess;
      this.map = map;
      this.fillMap();
    });
  }

  fillMap() {
    this.messages.forEach((value) => {
      const icon = L.icon({
        iconSize: [
          50, 41],
        iconAnchor: [13, 41],
        iconUrl: '../assets/icon.svg',
        popupAnchor: [17, -30]
      });
      const marker = L.marker([value.latitude, value.longitude], {
        icon,
        myCustomId: value.id,
        autoPan: true,
        clickable: true
      }).on('click', () => {
        this.ngZone.run(() => {
          // debugger ;
          // this.openDialog(value);
          this.data = value;
          this.openForm = false;
          this.openFormEditor();
          this.open.next(this.data);
        });
      }).addTo(this.map);
      this.markers.push(marker);
    });
    const baselayers = {
      TileLayer1: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
      TileLayer2: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...'
      })
    };
    // baselayers.TileLayer1.addTo(this.map);
    // L.control.layers(baselayers).addTo(this.map);
    //
    // this.map.on('baselayerchange', (e) => {
    //   console.log(e.layer);
    // });
  }

  // private openDialog(value) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '50% ';
  //   dialogConfig.height = '50%';
  //   dialogConfig.data = value;
  //   this.dialog.open(TableComponent, dialogConfig);
  // }

  // createMessage() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '50% ';
  //   dialogConfig.height = '50%';
  //   //  this.dialog.open(EditorComponent, dialogConfig);
  // }

  closeEditor() {
    this.openForm = false;
  }

  openFormEditor() {
    if (this.openForm) {
      this.openForm = false;
      this.formO = '<';
    } else {
      this.openForm = true;
      this.formO = '>';
    }
    this.open.next('');
  }
}
