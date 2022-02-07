import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportSharedService {
  public editDataDetails: any = [];
  public subject = new Subject<any>();

  private commentSource = new BehaviorSubject(this.editDataDetails);
  currentComment = this.commentSource.asObservable();

  sendComment(comment: any) {
    this.commentSource.next(comment);
  }
}
