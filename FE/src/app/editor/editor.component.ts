import {Component, Inject, OnInit} from '@angular/core';
import FroalaEditor from 'froala-editor';
import '../../../node_modules/froala-editor/js/plugins/image.min.js';
import {MessageService} from '../message.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {message} from '../message';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  form: FormGroup;
  private base64textString: string;
  editorView: any = 'Enter text';
  imgsrc: string;
  image_param: any;
  public imgrul = '';
  msg: message = {};
  public options: object = {
    imageUpload: true,
    imageUploadParam: 'image_param',
    imageUploadMethod: 'POST',
    imageMaxSize: 5 * 1024 * 1024,
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events: {
      'initialized': (e) => {
        // Do something here.
        // this is the editor instance.
        this.getData(this);
        console.log("test")
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private messageService: MessageService,
              private dialogRef: MatDialogRef<EditorComponent>
  ) {
    this.form = new FormGroup({
      froala: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required)
    });
    this.editorView = 'Enter text';
  }

  ngOnInit() {
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
    const content = this.form.value['froala'];
    this.msg.message = content.replace(/<img[^>]*>/g, '');
    this.msg.longitude = this.form.value['longitude'];
    this.msg.latitude = this.form.value['latitude'];
    if (this.imgsrc !== '') {
      this.msg.file = this.imgsrc;
    }

    if (this.data != null) {
      this.messageService.editMessages(this.msg, this.data).subscribe();
    } else {
      this.messageService.postMessages(this.msg).subscribe();
    }
    this.dialogRef.close();
  }

  getData(that) {
    if (this.data != null) {
      this.messageService.getMessageById(this.data).subscribe(data => {
        let img = '';
        if (data.file) {
          this.imgrul = `data:image/jpg;base64,${data.file}`;
          img = `<img src = "${this.imgrul}" class = 'image' alt="alba esht patate">`;
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
