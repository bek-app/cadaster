import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-cadaster-report-list',
  templateUrl: './cadaster-report-list.component.html',
  styleUrls: ['./cadaster-report-list.component.css'],
})
export class CadasterReportListComponent implements OnInit {
  reportCadasterId!: number;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      this.reportCadasterId = +param['id'];
      console.log(this.reportCadasterId);

    });
  }

  onActivate(componentReference: any) {
    if (this.reportCadasterId !== undefined) {
      componentReference.anyFunction(this.reportCadasterId);
    }
  }
}
