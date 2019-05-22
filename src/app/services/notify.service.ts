import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Notify, NotifyType } from '@app/models/notify.model';
@Injectable()
export class NotifyService {
  private subject = new Subject<Notify>();
  constructor() { }
  getNotify(): Observable<any> {
    return this.subject.asObservable();
}

success(message: string, keepAfterRouteChange = false) {
        this.notify(NotifyType.success, message);
    }

    error(message: string, keepAfterRouteChange = false) {
        this.notify(NotifyType.error, message);
    }

    info(message: string, keepAfterRouteChange = false) {
        this.notify(NotifyType.info, message);
    }
    warn(message: string, keepAfterRouteChange = false) {
        this.notify(NotifyType.warning, message);
    }
    notify(type: NotifyType, message: string) {
        this.subject.next(<Notify>{ type: type, message: message });
    }
    clear() {
        // clear alerts
        this.subject.next();
    }
}
