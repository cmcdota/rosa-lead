import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import {
  AuthModule,
  AUTH_SERVICE,
  PUBLIC_FALLBACK_PAGE_URI,
  PROTECTED_FALLBACK_PAGE_URI,
} from 'ngx-auth';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { FormComponent } from './leads/form/form.component';
import { InputComponent } from './forms/input/input.component';
import { BusinessComponent } from './leads/form/business/business.component';
import { LabelComponent } from './forms/label/label.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CompanysearchComponent } from './forms/companysearch/companysearch.component';
import { OfficesearchComponent } from './forms/officesearch/officesearch.component';
import { AuthenticateService } from './services/authenticate.service';
import { LeadComponent } from './leads/lead/lead.component';
import { ManagersearchComponent } from './forms/managersearch/managersearch.component';

import { CompanysearchService } from './services/companysearch.service';
import { OfficesearchService } from './services/officesearch.service';
import { ProductsearchService } from './services/productsearch.service';
import { ManagersearchService } from './services/managersearch.service';
import { LeadService } from './services/lead.service';
import { ManagerfilterPipe } from './pipes/managerfilter.pipe';
import { TaxComponent } from './forms/tax/tax.component';
import { CardComponent } from './leads/card/card.component';
import { IndividComponent } from './leads/form/individ/individ.component';
import { NotifyService} from './services/notify.service';
import { NotifyComponent } from './common/notify/notify.component';
import { AutofocusDirective } from './forms/autofocus/autofocus.directive';
import { LoaderComponent } from './common/loader/loader.component';
import { TooltipDirective } from './directives/tooltip/tooltip.directive';
import { TooltipComponent } from './common/tooltip/tooltip.component';
import { FlatComponent } from './elements/buttons/flat/flat.component';
import { HelperComponent } from './elements/helper/helper.component';
import { DigitsDirective } from './directives/digits/digits.directive';
import { TileComponent } from './elements/tile/tile.component';
import { PreviewComponent } from './elements/preview/preview.component';
import { InfoComponent } from './elements/info/info.component';
import { NameinitialsPipe } from './pipes/nameinitials.pipe';
import { QuotesPipe } from './pipes/quotes.pipe';
import { TextareaComponent } from './forms/textarea/textarea.component';
import { SubmitComponent } from './elements/buttons/submit/submit.component';
import { LabelHelperComponent } from './common/label-helper/label-helper.component';
import { TabComponent } from './elements/tab/tab.component';
import { CheckboxComponent } from './elements/checkbox/checkbox.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FormComponent,
    InputComponent,
    BusinessComponent,
    LabelComponent,
    CompanysearchComponent,
    OfficesearchComponent,
    LeadComponent,
    ManagersearchComponent,
    ManagerfilterPipe,
    TaxComponent,
    CardComponent,
    IndividComponent,
    NotifyComponent,
    AutofocusDirective,
    LoaderComponent,
    TooltipDirective,
    TooltipComponent,
    FlatComponent,
    HelperComponent,
    DigitsDirective,
    TileComponent,
    PreviewComponent,
    InfoComponent,
    NameinitialsPipe,
    QuotesPipe,
    TextareaComponent,
    SubmitComponent,
    LabelHelperComponent,
    TabComponent,
    CheckboxComponent,
],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TextMaskModule,
    ScrollToModule.forRoot(),
  ],
  providers: [
    CompanysearchService,
    OfficesearchService,
    AuthenticateService,
    ProductsearchService,
    ManagersearchService,
    LeadService,
    NotifyService,
    {
      provide: 'API_URL',
      useValue: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party'
    },
    {
      provide: 'API_KEY',
      useValue: '5c0fa69268870b7061361c5bdfc30bc1b1e95846'
    },
    { provide: AUTH_SERVICE, useClass: AuthenticateService },
    {
      provide: APP_INITIALIZER,
      useFactory: (loadService: AuthenticateService) => function() { return loadService.loadToken(); },
      multi: true,
      deps: [AuthenticateService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
