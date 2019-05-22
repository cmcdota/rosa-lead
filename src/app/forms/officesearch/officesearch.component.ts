import { Component, OnInit, Output, Input, EventEmitter, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Office } from '@app/models/office.model';

import { OfficesearchService } from '@app/services/officesearch.service';
import { Lead } from './../../models/lead.model';

import { switchMap, tap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifyService } from '@app/services/notify.service';

@Component({
  selector: 'rosa-officesearch',
  templateUrl: './officesearch.component.html',
  styleUrls: ['./officesearch.component.scss']
})

export class OfficesearchComponent implements OnInit {

  @Input()
  public tabindex: number;

  @Input()
  public userOffice: Office;

  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() results: EventEmitter<Lead> = new EventEmitter<Lead>();

  public officeGroup: FormGroup;
  public pending: boolean = false;
  public searchResults: any[];
  public iterator: number = 0;
  public dadataItemFocus: any;
  public showList: boolean = false;
  public mouseControl: boolean = false;
  public searchTerm: string;
  public editMode: boolean = false;
  public  t: boolean = false;
  // tslint:disable-next-line:max-line-length
  public  helperContent: string = 'Отделение, в которое будет направлен клиент для оказания услуги. По умолчанию – ваше.';
  /*
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.keyCode === 27) {
      this.editMode = false;
    }
  }
  */

  public sendDadata(lead): void {
    this.iterator = 0;
    this.editMode = false;
    this.results.emit(lead);
    this.searchResults = [];
    this.mouseControl = false;
    this.showList = false;
    this.officeGroup.reset();
  }
  public dadataFocus(): void {
    this.showList = true;
  }
  public dadataBlur(e): void {
    if (!this.mouseControl) {
      this.showList = false;
    }
  }

  private _clearField() {
    this.dadataItemFocus = null;
    this.searchResults = [];
    this.iterator = 0;
    this.showList = false;
    this.mouseControl = false;
  }

  private _setIteratorActive(state, index, nothing) {
    const elements = this._elem.nativeElement.querySelectorAll('.dadataresult');
    if (state === 'active') {
      elements[index].classList.toggle('default');
      this.dadataItemFocus = elements[index].id;
      elements[index].setAttribute('aria-selected', true);
    }
    if (state === 'inactive') {
      elements[index].classList.toggle('default');
      elements[index].setAttribute('aria-selected', false);
    }
  }


  public onKey(event: KeyboardEvent): boolean {
    const elements = this._elem.nativeElement.querySelectorAll('.dadataresult');
    switch (event.keyCode) {

      case 13:
        if (!this.searchResults) {
          return false;
        }
        this.sendDadata(this.searchResults[this.iterator]);
        this._clearField();
      break;

      case 40:
        if (!this.searchResults) {
          return false;
        }
        event.preventDefault();
        if (this.iterator === elements.length - 1) {

          this._setIteratorActive('inactive', this.iterator, elements);
          this.iterator = 0;
          this._setIteratorActive('active', 0, elements);
          return true;
        }
        this._setIteratorActive('inactive', this.iterator, elements);
        this.iterator++;
        this._setIteratorActive('active', this.iterator , elements);
      break;


      case 38:
      if (!this.searchResults) {
        return false;
      }
        event.preventDefault();
        if (this.iterator === 0) {
          this._setIteratorActive('inactive', this.iterator, elements);
          this.iterator = elements.length - 1;
          this._setIteratorActive('active', this.iterator, elements);
          return true;
        }
        this._setIteratorActive('inactive', this.iterator, elements);
        this.iterator--;
        this._setIteratorActive('active', this.iterator, elements);

      break;
    }
    return true;
}


  public mouseLeaveAction() {
    this.mouseControl = false;
  }

  public mouseOverAction(index, e) {
    this.mouseControl = true;
    this._elem.nativeElement.querySelectorAll('.dadataresult')[this.iterator].setAttribute('aria-selected', false);
    this._elem.nativeElement.querySelectorAll('.dadataresult')[index].setAttribute('aria-selected', true);
    this.dadataItemFocus = this._elem.nativeElement.querySelectorAll('.dadataresult')[index].id;
    this.iterator = index;
  }

  constructor(private _officeService: OfficesearchService, private _elem: ElementRef,
    private _fb: FormBuilder, private _notify: NotifyService) { }

  public ngOnInit(): void {
    this.officeGroup = this._fb.group({
      officeSuggest: ''
    });

    this.officeGroup
    .get('officeSuggest')
    .valueChanges
    .pipe(
        filter((value: string) => value && value.length > 0),
        distinctUntilChanged(),
        tap(() => this.pending = true),
        switchMap(value => this._officeService.searchOffice(value)
        .map( (res: any[]) => {
          return (<any>res).data.map(item => {
            return item;
          })
        })
        .pipe (
          finalize(() => this.pending = false)
        )
      )
    ).subscribe((results) => this.searchResults = results,  (err: HttpErrorResponse ) => {
      this._notify.error(`Возникла ошибка при загрузке продуктов: ${err.statusText} ${err.status}`);
  })
}
}
