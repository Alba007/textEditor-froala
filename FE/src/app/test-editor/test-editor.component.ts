import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import  FroalaEditor from 'froala-editor';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {message} from '../message';
import {MessageService} from '../message.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-test-editor',
  templateUrl: './test-editor.component.html',
  styleUrls: ['./test-editor.component.css']
})
export class TestEditorComponent implements OnInit {
  init = false;
  @Input() data: any;
  @Input() open: Observable<any>;
  @Output() close = new EventEmitter();
  form: FormGroup;
  private base64textString: string;
  editorView: any = 'Enter text';
  imgsrc: string;
  imageparam: any;
  msg: message = {};
  public options: object = {
    imageUpload: true,
    imageUploadParam: 'imageparam',
    imageUploadMethod: 'POST',
    imageMaxSize: 5 * 1024 * 1024,
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events: {
      initialized: (e) => {
        // Do something here.
        // this is the editor instance.
        this.init = true;
        this.getData(this);

      },
      'image.beforeUpload': (files) => {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      },
      'image.inserted': (img) => {
      },
      'image.removed': ($img) => {
        this.imgsrc = '';
      },
    },
  };

  constructor(
    private messageService: MessageService
  ) {
    this.form = new FormGroup({
      froala: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required)
    });
    this.editorView = 'Enter text';
  }

  ngOnInit() {
    const that = this;
    this.open.subscribe(data => {
      if (data === '') {
      } else {
        this.data = data;
        if (this.init) {
          this.getData(this);
        }
      }

    });
    FroalaEditor.DefineIcon('insert',
      {
        SRC: 'https://raw.githubusercontent.com/google/material-design-icons/master/social/1x_web/ic_share_black_36dp.png',
        ALT: 'Image button', template: 'image'
      });
    FroalaEditor.RegisterCommand('insert', {
      title: 'Insert HTML',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: () => {
        // this.html.insert('My New HTML');
      }
    });
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.imgsrc = this.base64textString;
  }

  onSubmit() {
    const content = this.form.value.froala;
    this.msg.message = content.replace(/<img[^>]*>/g, '');
    this.msg.longitude = this.form.value.longitude;
    this.msg.latitude = this.form.value.latitude;
    if (this.imgsrc !== '') {
      this.msg.file = this.imgsrc;
    }
    if (this.data) {
      this.messageService.editMessages(this.msg, this.data.id).subscribe();
    } else {
      this.messageService.postMessages(this.msg).subscribe();
    }
    this.close.emit('close');
  }

  getData(that) {
    if (that.data) {
      that.messageService.getMessageById(that.data.id).subscribe(data => {
        let img = '';
        if (data.file) {
          that.imgrul = `data:image/jpg;base64,${data.file}`;
          img = `<img src = "${that.imgrul}" class = 'image' alt="alba esht patate">`;
        }
        that.form = new FormGroup({
          froala: new FormControl(data.message + img, Validators.required),
          latitude: new FormControl(data.latitude, Validators.required),
          longitude: new FormControl(data.longitude, Validators.required)
        });
      });
    }
  }
}
