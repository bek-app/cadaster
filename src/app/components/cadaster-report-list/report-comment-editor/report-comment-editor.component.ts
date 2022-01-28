import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faHistory, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { CommentHistoryComponent } from './comment-history/comment-history.component';
@Component({
  selector: 'app-report-comment-editor',
  templateUrl: './report-comment-editor.component.html',
  styleUrls: ['./report-comment-editor.component.css'],
})
export class ReportCommentEditorComponent implements OnInit {
  ref: any;
  editMode: boolean = false;
  comment!: string;
  faSave = faSave;
  faTrash = faTrash; // remove
  faHistory = faHistory;
  selectedItem: any;
  constructor(
    private reportCommentService: ReportCommentService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ReportCommentModel
  ) {}
  @Output() saveComment: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    const { recordId, reportId, discriminator, controlId } = this.data;
    this.reportCommentService
      .getReportCommentList(reportId, discriminator)
      .subscribe((comments: ReportCommentModel[]) => {
        this.selectedItem = comments.find(
          (comment: any) =>
            comment.recordId === recordId && comment.controlId === controlId
        );
        console.log(this.comment);

        this.comment = this.selectedItem?.note || '';
      });
  }

  showHistory() {
    if (this.selectedItem)
      this.dialog.open(CommentHistoryComponent, {
        data: { ...this.selectedItem },
        minWidth: '400px',
        width: '500px',
      });
  }

  onSaveComment() {
    this.reportCommentService
      .addReportComment({ ...this.data, note: this.comment })
      .subscribe(
        (result) => {
          this.saveComment.emit(result);
          this.dialog.closeAll();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  deleteComment() {
    const { id } = this.selectedItem;

    this.reportCommentService.deleteReportComment(id).subscribe(
      (result) => {
        this.saveComment.emit(result);
        this.dialog.closeAll();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
