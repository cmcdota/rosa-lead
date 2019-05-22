import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ProductsearchService } from './../../../services/productsearch.service';
import { ManagersearchService } from './../../../services/managersearch.service';
import { CompanysearchService } from './../../../services/companysearch.service';
import { environment } from './../../../../environments/environment';
import { NotifyService } from '@app/services/notify.service';

import { Manager } from './../../../models/manager.model';
import { Office } from './../../../models/office.model';

@Component({
  selector: 'rosa-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {

  constructor(
    private _http: HttpClient,
    private _formBuilder: FormBuilder,
    private _productService: ProductsearchService,
    private _managerService: ManagersearchService,
    private _companyService: CompanysearchService,
    private _notify: NotifyService,
  ) { }
  public companyChecked = false;

  public activeProduct: number = 0;
  public products: any[] = [];
  public manager: Manager;
  public officeActive: {};
  public managersList: Manager[] = [];
  public _businessForm: FormGroup;
  public officeBranch: string;
  public companyExist: boolean = true;
  public formMessage: string;
  public buttonDaemon: boolean = false;
  public commentActive: boolean = false;
  public commentValidateMessage: {};
  public isCorporate: string = '0';
  public  helperContent: string = 'Опишите подробней потребности клиента';
  @Output() cardRecived: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public setProduct(productId, productNumber) {
    this.activeProduct = productNumber;
    this._businessForm.patchValue({
      productId: productId,
    });
    this.managerAuto(productId, this.isCorporate);
  }


  public officeAuto(branch): void {
    this._businessForm.patchValue({
      dopOffice: branch
    });
  }

  public managerAuto(productId, isCorporate) {
    if (this.officeBranch === `0000`) { return };

      this._managerService.searchUsers(this.officeBranch, 'pro', productId, isCorporate)
      .map( (res: any[]) => {
        return (<any>res).data.map(item => {
          return item;
        })
      })
      .subscribe(managers => {
        console.log(managers);
        if (managers && managers.length > 0) {
          this.managersList = managers;
          this.manager = this.managersList[0];
          this._businessForm.patchValue({
            dopUserId: this.manager.km_uid
          });
        }
      },
      (err: HttpErrorResponse) => {
        this._notify.error(`Возникла ошибка при загрузке менеджеров: ${err.statusText} ${err.status}`);
      })

  }

  /*
   .map( (res: any[]) => {
    return (<any>res).data.map(item => {
      return item;
    })
  })
  */


  public setManager(manager: Manager) {
    this.manager = manager;
    this._businessForm.patchValue({
      dopUserId: this.manager.km_uid
    });
  }

  public setCorporateValue(val: boolean): void {
    console.log(this._businessForm.controls['productId'].value);
    this.isCorporate = val ? '1' : '0';
    this.managerAuto( this._businessForm.controls['productId'].value, this.isCorporate );
    console.log(`isCorporate: ${this.isCorporate}`)
  }


  public setOffice(branch): void {
    console.log(branch);
    const selectedBranch = branch.branch;
    this.officeActive = branch;
    this.officeBranch = selectedBranch;
    this.officeAuto(selectedBranch);
    if (this.officeBranch === `0000`) { console.log(this.officeBranch); return };
      // tslint:disable-next-line:max-line-length
      this._managerService.searchUsers(this.officeBranch, 'pro', this._businessForm.controls['productId'].value, this.isCorporate).map( (res: any[]) => {
        return (<any>res).data.map(item => {
          return item;
        })
      }).subscribe(managers => {
        if (managers && managers.length > 0) {
          this.managersList = managers;
          this.manager = this.managersList[0];
          this._businessForm.patchValue({
            dopUserId: this.manager.km_uid
          });
        }
      }, (err: HttpErrorResponse) => {
        this._notify.error(`Возникла ошибка при загрузке менеджеров: ${err.statusText} ${err.status}`);
      });
  }




  // устанавливает значение «существует ли компания», получает от поля инн
  public checkExist(response): void {
    this.companyChecked = true;
    if (response === 'doesnt_exists') {
      this.companyExist = false;
      this._notify.success('Контакт является новым');
      return
    }
    this.companyExist = true;
    this._notify.warn('Контакт уже существует');
  }

  // заполняет поля значением из дадаты
  public parseCompany(company) {
    if (company.data.management) {
      this._businessForm.controls['leadName'].markAsTouched();
      this._businessForm.patchValue({ leadName: company.data.management.name })
    }
    if (company.value) {
      this._businessForm.controls['company'].markAsTouched();
      this._businessForm.patchValue({ company: company.value })
    }
    if (company.data.address.data) {
      this._businessForm.controls['address'].markAsTouched();
      this._businessForm.patchValue({ address: company.data.address.data.source })
    }
    if (company.data.inn) {
      this._businessForm.controls['tax'].markAsTouched();
      this._businessForm.patchValue({ tax: company.data.inn })
    }
  }

  // инициализация формы
  public initForm(): void {
    this._businessForm = this._formBuilder.group({
      leadName: [null,
        [Validators.required,
        Validators.pattern(/[А-я]/),
        Validators.minLength(1)]],

      phone: [null,
        [Validators.required,
        Validators.pattern(/[0-9]/),
        Validators.minLength(14)]],

      company: [null,
        [Validators.required,
        Validators.minLength(1)]],
      tax: [null,
        [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(12),
        Validators.pattern(/[0-9]/)]],
      address: [null,
        [Validators.required,
        Validators.minLength(5)]],
      productId: [null],
      dopOffice: [null],
      dopUserId: [null],
      comment: ['']
    });
  }

  // вкл/выкл создания комментария в идеале надо добавить фокусировку по нажатию
  public changeComment(e): void {
    this.commentActive = !this.commentActive;
    // console.log(this.commentField);
    //  this.commentField.nativeElement.focus();
  }

  // создает  коммент по клику на enter
  public commentKey(event): void {
    if (event.keyCode === 13) {
    this.commentActive = false;
    }
  }

  // автоматически делает поля тронутыми для валидации при отрп. Запускается sendLead()
  public markAsTouched(group: FormGroup | FormArray) {
  Object.keys(group.controls).map((field) => {
    const control = group.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.markAsTouched(control);
    }
  });
}



  public ngOnInit() {
    this.initForm();
    this.officeBranch = localStorage.getItem('branch');
    this.officeAuto(this.officeBranch);
    this.officeActive = {
      'branch': localStorage.getItem('branch'),
      'address': localStorage.getItem('location'),
      'nazvanie': localStorage.getItem('filial')
    }
    this._productService.searchProducts('pro').subscribe(data => {
      this.products = data;
      this.setProduct(data[0].product_id, 0);
    }, err => {
      this._notify.error('Возникла ошибка при загрузке продуктов' + err.error);
    });

  }


  public sendLead(): boolean {
  if (!this.companyChecked) {
    this._notify.warn('Введите ИНН чтобы продолжить');
    return
  }
  if (this.companyChecked && this.companyExist) {
    this._notify.warn('Контакт уже существует');
    return
  }

  if (this._businessForm.controls['dopOffice'].value === '0000') {
    this._notify.warn('Нельзя направить в указанное отделение');
    return
  }
  if (!this._businessForm.controls['dopOffice'].value) {
    this._notify.info('Выберите отделение куда будет направлен клиент');
    return
  }
  if (!this._businessForm.controls['dopUserId'].value) {
    this._notify.info('Выберите менеджера, который примет клиента');
    return
  }

  if (!this._businessForm.valid) {
    this._notify.warn('Заполните все поля формы');
    this.markAsTouched(this._businessForm);
    this.formMessage = 'Вы не заполнили все поля формы';
    setTimeout(() => {this.formMessage = ''}, 5000);
    return false;
  }

  if (this._businessForm.controls['comment'].value.length === 0) {
    this._businessForm.controls['comment'].setValue('без комментария');
  }


  function reverseStr(str) {
    return str.split('').reverse().join('');
  }






  const body = new HttpParams()
    .append('method', 'post_new_app')
    .append('campaign_id', this._businessForm.controls['productId'].value)
    .append('naimenovanie_kompanii', this._businessForm.controls['company'].value)
    .append('fio_directora', this._businessForm.controls['leadName'].value)
    .append('inn', this._businessForm.controls['tax'].value)
    .append('phone', this._businessForm.controls['phone'].value)
    .append('isCorporate', this.isCorporate)
    .append('comment', this._businessForm.controls['comment'].value)
    .append('dopofis', this._businessForm.controls['dopOffice'].value)
    .append('km_uid', this._businessForm.controls['dopUserId'].value);

  const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  this._http.post(`${environment.postLead}`, body, { headers: headers, params: body })
    .subscribe(
    (data) => {
    //  setTimeout(() => { this.cardsReciver.emit(this.newCard); this.clearModel(); }, 5000);
      this._notify.success('Лид успешно создан');
      this._businessForm.reset();
      this.ngOnInit();
      return true;
    },
    (err) => {
      console.log(err);
      this.buttonDaemon = false;
      this._notify.error('Возникла ошибка при отправке' + err);
      return false;
    }
    );
}

}
