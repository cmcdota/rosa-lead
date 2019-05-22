import { Component, OnInit, Input } from '@angular/core';
import { Notify, NotifyType } from '@app/models/notify.model';
import { NotifyService } from '@app/services/notify.service';
@Component({
  selector: 'rosa-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {
  public notifys: Notify[] = [];

  public status: string;

  public message: string;
  // tslint:disable-next-line:max-line-length
  public errorMessage: string = 'Попробуйте выполнить действие позже, при повторной ошибке напишите поддержке сервиса proportal@rosbank.ru приложив текст сообщения об ошибке и действия после которых она была вызвана';

  public show: boolean = false;
  constructor(private _notifyService: NotifyService) { }

  public showNotify(status, message): void {
    this.status = status;
    this.message = message;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 40000);
  }


  ngOnInit() {
    this._notifyService.getNotify().subscribe((notify: Notify) => {
        if (!notify) {
            this.notifys = [];
            return;
        }
        this.notifys = [];

        this.notifys.push(notify);
    setTimeout(() => {this.removeNotify(notify)}, 5500);
    });
  }

  removeNotify(notify: Notify) {
      this.notifys = this.notifys.filter(x => x !== notify);
  }

  cssClass(notify: Notify) {
      if (!notify) {
          return;
      }

      switch (notify.type) {
          case NotifyType.success:
              return 'success notify-show';
          case NotifyType.error:
              return 'error notify-show';
          case NotifyType.info:
              return 'info notify-show';
          case NotifyType.warning:
              return 'warning notify-show';
      }
  }

}
