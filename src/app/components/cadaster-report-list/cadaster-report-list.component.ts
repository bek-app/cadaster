import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SignedDoc } from '@models/register/signed-doc.model';
import { TranslateService } from '@ngx-translate/core';
import { SigndocService } from '@services/signdoc/signdoc.service';
import { CadasterReportService } from 'src/app/services/cadaster-report.service';

declare const webSocket_init: any;
declare const signXmlCall: any;

@Component({
  selector: 'app-cadaster-report-list',
  templateUrl: './cadaster-report-list.component.html',
  styleUrls: ['./cadaster-report-list.component.css'],
})
export class CadasterReportListComponent implements OnInit, AfterViewInit {
  cdrReportId!: number;
  cdrReportRoute: any;
  cdrReportItem: any;
  kindId!: number;
  filteredRoute: any[] = [];

  isSigned = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private cadasterService: CadasterReportService,
    private signdocService: SigndocService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => (this.cdrReportId = +param['id'])
    );

    this.cadasterService
      .getCadasterReportById(this.cdrReportId)
      .subscribe((result: any) => {
        this.cdrReportItem = result;
        this.kindId = result.kindId;
        this.translate
          .get('CDR_REPORTS.MENU')
          .subscribe((translations: any) => {
            const {
              ACTUAL_EMISSION,
              PARAMETER_CALC,
              PARAMETER_GAS,
              PRODUCT,
              PARAMETER_KOEF,
              ACTIVITY,
              ACTIVITY_CHANGE,
              CARBON_UNIT,
              PLAN,
            } = translations;

            this.cdrReportRoute = [
              {
                src: 'actual-emission',
                name: ACTUAL_EMISSION,
              },
              {
                src: 'parameter-koef',
                name: PARAMETER_KOEF,
              },
              {
                src: 'parameter-koef-simple',
                name: PARAMETER_KOEF,
              },
              {
                src: 'parameter-calc',
                name: PARAMETER_CALC,
              },

              {
                src: 'parameter-gas',
                name: PARAMETER_GAS,
              },
              {
                src: 'report-product',
                name: PRODUCT,
              },

              {
                src: 'report-activity',
                name: ACTIVITY,
              },
              {
                src: 'report-activity-change',
                name: ACTIVITY_CHANGE,
              },
              {
                src: 'report-carbon-unit',
                name: CARBON_UNIT,
              },
              {
                src: 'carbon-unit-simple',
                name: CARBON_UNIT,
              },
              {
                src: 'report-plan',
                name: PLAN,
              },
            ];

            if (this.kindId == 1) {
              this.filteredRoute = this.cdrReportRoute.filter(
                (item: { src: string }) =>
                  item.src !== 'parameter-koef-simple' &&
                  item.src !== 'carbon-unit-simple'
              );
            } else
              this.filteredRoute = this.cdrReportRoute.filter(
                (item: { src: string }) =>
                  item.src == 'actual-emission' ||
                  item.src == 'parameter-koef-simple' ||
                  item.src == 'report-product' ||
                  item.src == 'report-activity' ||
                  item.src == 'carbon-unit-simple'
              );
          });
      });

    this.signdocService
      .checkSignedDoc(this.cdrReportId.toString())
      .subscribe((r) => {
        this.isSigned = r;
      });
  }

  signAndSend() {
    webSocket_init();
    this.cadasterService
      .getReportXml(this.cdrReportId)
      .subscribe((reportXml) => {
        signXmlCall((signedXml: string) => {
          const signedDoc = new SignedDoc(
            '00000000-0000-0000-0000-000000000000',
            'KdrReport',
            signedXml,
            'KdrReport',
            this.cdrReportId.toString()
          );
          this.signdocService.saveSignedDoc(signedDoc).subscribe((r) => {
            this.isSigned = true;
            this.router.navigate(['common/cadaster-report']);
          });
        }, reportXml.data);
      });
  }
}
