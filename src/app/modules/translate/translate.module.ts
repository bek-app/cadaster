import { APP_INITIALIZER, Injector, NgModule } from '@angular/core'
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common'
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { HttpClient } from '@angular/common/http'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json')
}
export function appInitializerFactory(
  translate: TranslateService,
  injector: Injector,
) {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      )
      locationInitialized.then(() => {
        const langToSet = 'ru'
        translate.setDefaultLang('ru')
        translate.use(langToSet).subscribe(
          () => {
            console.info(`Successfully initialized '${langToSet}' language.'`)
          },
          (err) => {
            console.error(
              `Problem with '${langToSet}' language initialization.'`,
            )
          },
          () => {
            resolve(null)
          },
        )
      })
    })
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [TranslateModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },
  ],
})
export class CustomTranslateModule {}
