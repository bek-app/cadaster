import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Params,
  Router,
} from '@angular/router';
import {
  faCoffee,
  faHistory,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReportCommentService } from 'src/app/services/report-comment.service';
import { ReportSharedService } from 'src/app/services/report-shared.service';

@Component({
  selector: 'app-editor-textarea',
  templateUrl: './editor-textarea.component.html',
  styleUrls: ['./editor-textarea.component.css'],
})
export class EditorTextAreaComponent implements OnInit {
  selectedId: any;
  selectedItem: any;
  collection!: any[]; // this will be filled by the collection of your column definition
  onItemChanged = new Subject<any>(); // object
  ref: any;
  editMode: boolean = false;
  comment!: string;
  faSave = faSave;
  faTrash = faTrash; // remove
  faHistory = faHistory;
  newComment: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private reportCommentService: ReportCommentService,
    private reportShared: ReportSharedService,
    private activatedRoute: ActivatedRoute,
   ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
   }

  showHistory(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  onSave(event: any) {
    this.selectedItem = event.target.value;
    this.onItemChanged.next(event.target.value);
  }

  onSaveComment(event: any) {
    this.reportCommentService
      .addReportComment({ ...this.newComment, note: this.comment })
      .subscribe((result) => {
        this.onItemChanged.next({});
      });
  }

  deleteComment() {
    this.comment = '';
  }
}
