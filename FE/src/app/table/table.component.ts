import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {MessageService} from '../message.service';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public  dialogRef: MatDialogRef<TableComponent>,
              private dialog: MatDialog,
              private messageService: MessageService) {
  }

  ngOnInit() {
    if (this.data.file) {
      const imgrul = `data:image/jpg;base64,${this.data.file}`;
      const img = `<img src = "${imgrul}" class = 'image' alt="alba esht patate">`;
      this.message = this.data.message + img;
    } else {
      this.message = this.data.message;
    }
  }

  edit(id) {
    const dialogData = new MatDialogConfig();
    dialogData.width = '50%';
    dialogData.height = '50%';
    dialogData.data = id;
    this.dialogRef.close();
    this.dialog.open(EditorComponent, dialogData);

  }

  delete(id) {
    this.messageService.deleteMessages(id).subscribe();
    this.dialogRef.close();
  }
}
