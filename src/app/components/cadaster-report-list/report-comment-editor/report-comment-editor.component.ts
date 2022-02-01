import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  faSave = faSave;
  faTrash = faTrash; // remove
  faHistory = faHistory;
  selectedComment: any;
  submitted = false;
  form: FormGroup;
  @Output() saveComment: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private reportCommentService: ReportCommentService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public newComment: ReportCommentModel
  ) {
    this.form = this.fb.group({
      comment: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    const { recordId, reportId, discriminator, controlId } = this.newComment;
    this.reportCommentService
      .getReportCommentList(reportId, discriminator)
      .subscribe((commentList: ReportCommentModel[]) => {
        this.selectedComment = commentList.find(
          (comment: any) =>
            comment.recordId === recordId && comment.controlId === controlId
        );
        this.form.controls.comment.setValue(this.selectedComment?.note);
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const note = this.form.controls.comment.value;

    let data = {};

    this.selectedComment
      ? (data = { ...this.selectedComment, note })
      : (data = { ...this.newComment, note });

    this.reportCommentService.addReportComment(data).subscribe(
      (result) => {
        this.saveComment.emit(result);
        this.dialog.closeAll();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showHistory() {
    if (this.selectedComment)
      this.dialog.open(CommentHistoryComponent, {
        data: { ...this.selectedComment },
        minWidth: '400px',
        width: '500px',
      });
  }

  deleteComment() {
    const { id } = this.selectedComment;
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
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
