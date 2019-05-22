import { Component, OnInit, Output, Input, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { OfficesearchService } from '../../services/officesearch.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { switchMap, tap, finalize, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Manager } from '../../models/manager.model';


@Component({
  selector: 'rosa-managersearch',
  templateUrl: './managersearch.component.html',
  styleUrls: ['./managersearch.component.scss']
})
export class ManagersearchComponent implements OnInit {
  @Input()
  public selectedManager: Manager;

  @Input()
  public managers: Manager[];

  @Input()
  public tabindex: number;

  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() results: EventEmitter<any> = new EventEmitter<any>();
  public searchResults: Manager[] = [];
  public  helperContent: string = 'Менеджер встречающий клиента. По умолчанию автоматически в вашем офисе на основе выбранного продукта';
  public managerGroup: FormGroup;

  public arrayDirty: any[];
  public iterator: number = 0;
  public dadataItemFocus: any;
  public searchTerm: string;
  public editMode: boolean = false;
  @Input()
  public disabled: boolean;

  public mouseControl: boolean = false;
  public showList: boolean = false;
  public dadataFocus(): void {
    this.showList = true;
  }
  public dadataBlur(e): void {
    if (!this.mouseControl) {
      this.showList = false;
    }
  }
  /*
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.keyCode === 27) {
      this.editMode = false;
    }
  }
*/

  public sendDadata(user): void {
    this.editMode = false;
    this.results.emit(user);
    this._clearField();
  }



  private _clearField() {
    this.dadataItemFocus = null;
    this.iterator = 0;
    this.showList = false;
    this.mouseControl = false;
    this.managerGroup.reset();
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

  public mouseOverAction(index) {
    this.mouseControl = true;
    const elements = this._elem.nativeElement.querySelectorAll('.dadataresult');
    elements[this.iterator].setAttribute('aria-selected', false);
    elements[index].setAttribute('aria-selected', true);
    this.dadataItemFocus = elements[index].id;
    this.iterator = index;
  }

  // tslint:disable-next-line:max-line-length
  constructor(private _officeService: OfficesearchService, private _searchField: ElementRef, private _elem: ElementRef, private _fb: FormBuilder) { }



  public ngOnInit(): void {

    this.searchResults = this.managers;
    if (this.searchResults) {
      this.dadataItemFocus = `dadata-searchbar__option-${this.searchResults[0].name}`;
    }

    this.managerGroup = this._fb.group({
      managerSearch: null
    });

    this.managerGroup
    .get('managerSearch')
    .valueChanges
    .subscribe((result) => this.searchTerm = result);

    const empty = [];

  }

}
