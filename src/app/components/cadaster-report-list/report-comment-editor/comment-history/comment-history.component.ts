import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { ReportCommentService } from 'src/app/services/report-comment.service';

@Component({
  selector: 'app-comment-history',
  templateUrl: './comment-history.component.html',
  styleUrls: ['./comment-history.component.css'],
})
export class CommentHistoryComponent implements OnInit {
  historyCommentList: any[] = [];
  constructor(
    private reportCommentService: ReportCommentService,
    public dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: ReportCommentModel
  ) {}
  // @Output() saveComment: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    const { id } = this.data;
    this.reportCommentService
      .getReportCommentHistorytList(id)
      .subscribe((comments) => {
        this.historyCommentList = comments;
      });
  }
}
