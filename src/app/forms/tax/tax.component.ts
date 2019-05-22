import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CompanysearchService } from '@app/services/companysearch.service';
import {switchMap, tap, finalize, debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';

@Component({
selector: 'rosa-tax',
templateUrl: './tax.component.html',
styleUrls: ['./tax.component.scss'],
})
export class TaxComponent implements OnInit {
  @Output() results: EventEmitter<any> = new EventEmitter<any>();

  @Input() public placeholder: string
  @Input() public tabindex: string
  @Input() public controlOptions: FormControl
  @Input() public controlName: string
  @Input() public required: boolean
  @Input() public isExist: boolean = false;
  @Input() public autofocus: boolean;
  public showPhone: boolean = false;
  public _value: any;
  public pending: boolean = false;
  public searchResults: string;
  public helperContent: string = 'Контакт не сможет быть лидом если существует в базе банка';


  public constructor(private _companyService: CompanysearchService, ) { }

 public ngOnInit(): void {
   this.controlOptions
   .valueChanges
   .pipe(
       debounceTime(400),
       filter((value: string) => (value && value.length > 9)),
       distinctUntilChanged(),
       tap(() => this.pending = true),
       debounceTime(1000),
       switchMap(value => this._companyService.checkCompany('pro', `${value}`)
       .pipe (
         finalize(() => this.pending = false)
       )
     )
   ).subscribe(results => this.results.emit(this.searchResults = results.data));

 }
}
