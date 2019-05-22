import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ProductsearchService } from './../../../services/productsearch.service';
import { ManagersearchService } from './../../../services/managersearch.service';
import { environment } from './../../../../environments/environment';
import { NotifyService } from '@app/services/notify.service';
import { CheckboxComponent } from '@app/elements/checkbox/checkbox.component';
import { Manager } from './../../../models/manager.model';
import { Office } from './../../../models/office.model';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switch';

@Component({
  selector: 'rosa-individ',
  templateUrl: './individ.component.html',
  styleUrls: ['./individ.component.scss']
})
export class IndividComponent implements OnInit {
  public activeProduct: number = 0;
  public products: any[] = [];
  public manager: Manager;
  public helperComment: string = 'Опишите подробней потребности клиента';
  public managersList: Manager[] = [];
  public _personalForm: FormGroup;
  public officeBranch: string;
  public officeActive: {};
  public companyExist: boolean = true;
  public formMessage: string;
  public buttonDaemon: boolean = false;
  public commentActive: boolean = false;
  public isPackage: boolean = false;
  public isVip: boolean = false;

  @Output() cardRecived: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public setProduct(productId, productNumber, productPackage, isVip = 0) {
    this.activeProduct = productNumber;
    this._personalForm.patchValue({
      productId: productId,
    });
    console.log(isVip)
    this.isVip = isVip === 1 ? true : false;
    this.managerAuto(productId);
    if (productPackage && productPackage === 1) {
      this.isPackage = true;
        console.log('package');
        this._personalForm.patchValue({
          tax: ''
        });
        this._notify.info('Выбран пакетный продукт, укажите ИНН клиента или найдите реквизиты компании в справочнике');
      return;
    }
    this.isPackage = false;
    this._personalForm.patchValue({
      tax: '0000000000'
    });
  }

  public removeManagersList() {
    this.managersList = [];
    this.manager = undefined;
    this._personalForm.patchValue({
      dopUserId: ''
    });
  }

  public officeAuto(branch): void {
    this._personalForm.patchValue({
      dopOffice: branch
    });
  }
  public managerAuto(productId) {
    if (this.officeBranch === `0000` && !this.isVip) { this.removeManagersList(); return };
      this._managerService.searchUsers(this.officeBranch, 'fiz', productId).map( (res: any[]) => {
        return (<any>res).data.map(item => {
          return item;
        })
      }).subscribe(managers => {
        console.log(managers);
        if (managers && managers.length > 0) {
          this.managersList = managers;
          this.manager = this.managersList[0];
          this._personalForm.patchValue({
            dopUserId: this.manager.km_uid
          });
        }
      },
      (err: HttpErrorResponse) => {
        this._notify.error(`Возникла ошибка при загрузке менеджеров: ${err.statusText} ${err.status}`);
      });

  }


  public setManager(manager: Manager) {
    if (!manager) {return};
    this.manager = manager;
    this._personalForm.patchValue({
      dopUserId: this.manager.km_uid
    });
  }

  public setOffice(branch): void {
    this.officeBranch = branch.branch;
    this.officeActive = branch;
    this.officeAuto(branch.branch);
    if (this.officeBranch === `0000` && !this.isVip) { return }
      this._managerService.searchUsers(this.officeBranch, 'fiz', this._personalForm.controls['productId'].value).map( (res: any[]) => {
        return (<any>res).data.map(item => {
          return item;
        })
      }).subscribe(managers => {
        console.log(managers);
        if (managers && managers.length > 0) {
          this.managersList = managers;
          this.manager = this.managersList[0];
          this._personalForm.patchValue({
            dopUserId: this.manager.km_uid
          });
        }
      },
      err => {
        this._notify.error('Возникла ошибка при загрузке менеджеров' + err.error);
      });

  }



  public parseCompany(company) {
    if (company.data.inn) {
      this._personalForm.controls['tax'].markAsTouched();
      this._personalForm.patchValue({ tax: company.data.inn })
      return;
    }
    return alert('У выбранной компании отстутствует ИНН в справочнике. Введите вручную')
  }

  public sendLead(): boolean {
    if (this._personalForm.controls['dopOffice'].value === '0000' && !this.isVip) {
      this._notify.warn('Нельзя направить в указанное отделение');
      return
    }
    if (!this._personalForm.controls['dopOffice'].value) {
      this._notify.info('Выберите отделение куда будет направлен клиент');
      return
    }
    if (!this._personalForm.controls['dopUserId'].value) {
      this._notify.info('Выберите менеджера, который примет клиента');
      return
    }
    if (!this._personalForm.valid) {
      this.markAsTouched(this._personalForm);
      this.commentActive = true;
      this._notify.warn('Заполните все поля формы');
      this.formMessage = 'Вы не заполнили все поля формы';
      return false;
    }


    function reverseStr(str) {
      return str.split('').reverse().join('');
    }


    const body = new HttpParams()
      .append('method', 'post_new_app')
      .append('campaign_id', this._personalForm.controls['productId'].value)
      .append('fio_directora', this._personalForm.controls['leadName'].value)
      .append('birthday', this._personalForm.controls['birthday'].value)
      .append('phone', this._personalForm.controls['phone'].value)
      .append('inn', this._personalForm.controls['tax'].value)
      .append('comment', this._personalForm.controls['comment'].value)
      .append('dopofis', this._personalForm.controls['dopOffice'].value)
      .append('km_uid', this._personalForm.controls['dopUserId'].value);




    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    this._http.post(`${environment.postLead}`, body, { headers: headers, params: body })
      .subscribe(
      (data) => {
        console.log(data);

        this._notify.success('Лид успешно создан');
        setTimeout(() => { this.buttonDaemon = true }, 1500)
        setTimeout(() => { this.cardRecived.emit(true) }, 2500)
        setTimeout(() => { this.buttonDaemon = false }, 9500)


        this._personalForm.reset();
        this.ngOnInit();
        return true;
      },
      (err) => {
        console.log(err);
        this._notify.error('Возникла ошибка при отправке' + err.error);
        return false;
      }
      );

  }



  public initForm(): void {
    this._personalForm = this._formBuilder.group({
      leadName: ['',
        [Validators.required,
        Validators.pattern(/[А-я]/),
        Validators.minLength(1)]],
      phone: ['',
        [Validators.required,
        Validators.pattern(/[0-9]/),
        Validators.minLength(14)]],
      passNum: ['',
        [Validators.minLength(10)]],
      birthday: ['',
        [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/[0-9]/)]],
      tax: ['',
        [Validators.required,
        Validators.minLength(10),
        Validators.pattern(/[0-9]/)]],
      address: ['', []],
      vip: ['', []],
      productId: ['', []],
      dopOffice: ['', []],
      dopUserId: ['', []],
      dopUserName: ['', []],
      comment: ['', [Validators.required]]
    })
  }

  public commentKey(event): void {
    if (event.keyCode === 13) {
    this.commentActive = false;
    }
  }



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

  constructor(
    private _http: HttpClient,
    private _formBuilder: FormBuilder,
    private _productService: ProductsearchService,
    private _managerService: ManagersearchService,
    private elementRef: ElementRef,
    private _notify: NotifyService,
  ) { }

  public changeComment(e): void {
    this.commentActive = !this.commentActive;
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

    this._productService.searchProducts('fiz').subscribe(data => {
      this.products = data;
      this.setProduct(data[0].product_id, 0, data[0].inn_required);
    },
    err => {
      this._notify.error(`Возникла ошибка при загрузке продуктов: ${err.statusText} ${err.status}`);
    });
    console.log(typeof this._personalForm.controls['comment'].value.length);
  }
}


/*
  if (this.officeBranch !== `0000`) {
    this._managerService.searchUsers(this.officeBranch, 'pro', productId)
    .map( (res: any[]) => {
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
    },
    (err: HttpErrorResponse) => {
      this._notify.error(`Возникла ошибка при загрузке менеджеров: ${err.statusText} ${err.status}`);
    })
  }
  */