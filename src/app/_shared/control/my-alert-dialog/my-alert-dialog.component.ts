import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-my-alert-dialog',
  templateUrl: './my-alert-dialog.component.html',
  styleUrls: ['./my-alert-dialog.component.scss']
})


export class MyAlertDialogComponent implements OnInit {
  dialogTitle: string;
  dialogText: string;
  cancelShow:boolean;
  constructor(
    public dialogRef: MatDialogRef<MyAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) 
    { }

  ngOnInit() {
    this.dialogRef.updatePosition({ top: `30px`});
    this.dialogTitle = this.data.dialogTitle;
    this.dialogText = this.data.dialogText;
    this.cancelShow = this.data.cancelShow;
  }

}
