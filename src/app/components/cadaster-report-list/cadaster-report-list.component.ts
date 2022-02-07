import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-cadaster-report-list',
  templateUrl: './cadaster-report-list.component.html',
  styleUrls: ['./cadaster-report-list.component.css'],
})
export class CadasterReportListComponent implements OnInit {
  reportCadasterId!: number;
  cdrReportRoute: any;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => (this.reportCadasterId = +param['id'])
    );

    this.cdrReportRoute = [
      {
        id: this.reportCadasterId,
        name: 'actual-emission',
        title: ' Фактический объем выбросов',
      },

      {
        id: this.reportCadasterId,
        name: 'parameter-calc',
        title: ' Окисления топлива',
      },

      {
        id: this.reportCadasterId,
        name: 'parameter-gas',
        title: 'Парниковый газ',
      },
      {
        id: this.reportCadasterId,
        name: 'report-product',
        title: 'Продукт',
      },
      {
        id: this.reportCadasterId,
        name: 'parameter-koef',
        title: 'Коэффициенты',
      },
    ];
  }

  onActivate(componentReference: any) {
    if (this.reportCadasterId !== undefined) {
      componentReference.goToCadasterReports(this.reportCadasterId);
    }
  }
}
