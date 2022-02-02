import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
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
import { faAngleRight, faHistory, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ReportCommentModel } from 'src/app/models/report-comment.model';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportSharedService } from 'src/app/services/report-shared.service';
import { CommentHistoryComponent } from './comment-history/comment-history.component';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-comment-editor',
  templateUrl: './report-comment-editor.component.html',
  styleUrls: ['./report-comment-editor.component.css'],
})
export class ReportCommentEditorComponent implements OnInit, OnDestroy {
  ref: any;
  editMode: boolean = false;
  faSave = faSave;
  faTrash = faTrash; // remove
  faHistory = faHistory;
  selectedComment: any;
  submitted = false;
  form: FormGroup;
  newComment: any;
  faPaperPlane = faPaperPlane
  historyCommentList: any[] = []
  subs!: Subscription
  @Output() saveComment: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private reportCommentService: ReportCommentService,
    public dialog: MatDialog,
    private sharedDataService: ReportSharedService
  ) {
    this.form = this.fb.group({
      comment: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.subs = this.sharedDataService.currentComment.subscribe((comment) => {
      this.newComment = comment;

      const { recordId, reportId, discriminator, controlId } = comment;

      this.reportCommentService
        .getReportCommentList(reportId, discriminator)
        .subscribe((commentList: ReportCommentModel[]) => {
          this.selectedComment = commentList.find(
            (comment: any) =>
              comment.recordId === recordId && comment.controlId === controlId
          );
          this.form.controls.comment.setValue(this.selectedComment?.note);

          if (this.selectedComment) {
            const { id } = this.selectedComment;
            this.reportCommentService
              .getReportCommentHistorytList(id)
              .subscribe((comments) => this.historyCommentList = comments);
          }
        });
    });

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  deleteComment(id: number) {
    // const { id } = this.selectedComment;
    this.reportCommentService.deleteReportComment(id).subscribe(
      (result) => {
        // this.saveComment.emit(result);
        // this.dialog.closeAll();
        console.log(result);

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
