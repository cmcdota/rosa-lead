import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { TooltipComponent } from '@app/common/tooltip/tooltip.component';
@Directive({
  selector: '[rosaTooltip]',
  exportAs: 'tooltip'
})
export class TooltipDirective implements OnInit {

  @HostBinding('class.tooltip-container')
  public tooltipContainer: boolean = true;


  @Input()
  public set rosaTooltip(value: string) {
    this._tooltipElement.innerContent = value;
  }

  private _tooltipElement: TooltipComponent;

  constructor(
    private _el: ElementRef
  ) {

   }

   public ngOnInit(): void {
    this._el.nativeElement.appendChild(this._tooltipElement);
   }

   public hide(): void {
    this._el.nativeElement.classList.remove('tooltip-active');
  }

  public show(): void {
    this._el.nativeElement.classList.add('tooltip-active');
  }


}
