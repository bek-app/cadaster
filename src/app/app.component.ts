import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cadaster';
  constructor(public translate: TranslateService) {
    translate.setDefaultLang('ru');
    translate.use('ru');
    translate.addLangs(['ru', 'en', 'kz']);
  }
}
