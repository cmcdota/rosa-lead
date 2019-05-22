import { Component, OnInit, Output, Input, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { CompanysearchService } from '../../services/companysearch.service';
import { Observable } from 'rxjs/Observable';
import { Lead } from './../../models/lead.model';

import {switchMap, tap, finalize, debounceTime, filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'rosa-companysearch',
  templateUrl: './companysearch.component.html',
  styleUrls: ['./companysearch.component.scss']
})

export class CompanysearchComponent implements OnInit {
  @Input()
  public tabindex: string;

  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() results: EventEmitter<Lead> = new EventEmitter<Lead>();
  public autoComplete: FormGroup;
  public pending: boolean = false;
  public searchResults: any[];
  public iterator: number = 0;
  public dadataItemFocus: any;
  public showList: boolean = false;
  public mouseControl: boolean = false;
  public searchTerm: string;
  public helperContent: string = 'Через поиск по справочнику вы можете предзаполнить реквизиты компании';
  public sendDadata(lead): void {
    this.iterator = 0;
    this.results.emit(lead);
    this.searchResults = [];
    this.mouseControl = false;
    this.autoComplete.reset();
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
    this.autoComplete.reset();
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
        this.results.emit(this.searchResults[this.iterator]);
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




  constructor(private _companyService: CompanysearchService, private _elem: ElementRef, private _fb: FormBuilder) { }



  public ngOnInit(): void {
    this.autoComplete = this._fb.group({
      suggest: ['']
    });

    const empty = [];

    console.log(this.autoComplete
      .get('suggest'));
    this.autoComplete
    .get('suggest')
    .valueChanges
    .pipe(
        distinctUntilChanged(),
        filter((value: string) => value && value.length > 0),
        tap(() => this.pending = true),
        debounceTime(1000),
        switchMap(value => this._companyService.searchDadata(value)
        .pipe (
          finalize(() => this.pending = false)
        )
      )
    ).subscribe(results => this.searchResults = results);
  }
}
