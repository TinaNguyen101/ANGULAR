import { Injectable } from '@angular/core';
import { Subject, Subscription, Subscriber, BehaviorSubject } from 'rxjs';
import * as _moment from 'moment';
const moment = _moment;
@Injectable(
    {
        providedIn: 'root'
    }
)
export class SharedService {
    // Observable string sources
    private emitChangeSource = new Subject<any>();
    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

    // Observable string sources
    private emitChangeYear = new BehaviorSubject(moment().year() as any);
    // Observable string streams
    changeYearEmitted = this.emitChangeYear.asObservable();
    // Service message commands
    emitYearChange(change: any) {
        this.emitChangeYear.next(change);
    }

    // Observable string sources
    private emitChangeEmpId = new BehaviorSubject(undefined as any);
    // Observable string streams
    changeEmpIdEmitted = this.emitChangeEmpId.asObservable();
    // Service message commands
    emitEmpIdChange(change: any) {
        this.emitChangeEmpId.next(change);
    }
    // Observable string sources
    private emitLoadContent = new BehaviorSubject([] as any);
    // Observable string streams
    emitContentChangeOnLoad = this.emitLoadContent.asObservable();
    // Service message commands
    emitContentChange(change: any) {
        this.emitLoadContent.next(change);
    }
    
}
