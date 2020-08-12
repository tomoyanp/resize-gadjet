import { Injectable, OnDestroy } from '@angular/core';
import { load as loadHoge, loadDone as loadDoneHoge, loadError as loadErrorHoge } from '../../../store/hoge.action';
import { load as loadMoge, loadDone as loadDoneMoge, loadError as loadErrorMoge } from '../../../store/moge.action';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable, combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { Utility, ReturnState, AllinService } from './utility';
import { DataSource } from '@angular/cdk/table';

@Injectable({
  providedIn: 'root'
})

export class TestService implements AllinService {
  private mogeState$: Observable<object>;
  private hogeState$: Observable<object>;
  private subject = new BehaviorSubject<object>({});
  private subscriptions: Array<Subscription> = [];

  ngOnDestroy() {
    this.subscriptions.map(subscription => subscription.unsubscribe());
  }

  constructor(
    private mogeStore: Store<{ moge: object }>,
    private hogeStore: Store<{ hoge: object }>
  ) {
    this.mogeState$ = this.mogeStore.select('moge');
    this.hogeState$ = this.hogeStore.select('hoge');
   }

   get DataSource(): Observable<object> {
     return this.subject.asObservable();
   }

   loadData() {
     this.mogeStore.dispatch(loadMoge());
     this.hogeStore.dispatch(loadHoge());
     setTimeout(() => {
        this.mogeStore.dispatch(loadDoneMoge());
        this.hogeStore.dispatch(loadDoneHoge());
     }, 2000)

     this.subscriptions.push(combineLatest(this.mogeState$, this.hogeState$).subscribe((array: Array<object>) => {
       if (Utility.checkLoadStatus(array)) {
         if (Utility.checkApiStatus(array)) {
           this.subject.next(Utility.createState("success", array));
         } else {
           this.subject.next(Utility.createState("error", array));
         }
       } else {
         this.subject.next(Utility.createState("processing", undefined));
       }
     }));
   }
}
