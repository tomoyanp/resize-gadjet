import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { forkJoin, zip, merge, combineLatest, Subscription, Observable } from 'rxjs';
import { TestService } from './test.service';

import { load as loadHoge, reset as resetHoge } from '../../../store/hoge.action';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  constructor(
    private elementRef: ElementRef
  ) {}
  public cols = 100;
  public rowHeight = 10;

  public gadjetList = [
    {
      text: 'hoge',
      cols: 30,
      rows: 3,
      id: 'hoge',
      flag: false,
      thresholdX: undefined,
      thresholdY: undefined,
      clientX: undefined,
      clientY: undefined
    },
    {
      text: 'moge',
      cols: 20,
      rows: 3,
      id: 'moge',
      flag: false,
      thresholdX: undefined,
      thresholdY: undefined,
      clientX: undefined,
      clientY: undefined
    },
    {
      text: 'fuga',
      cols: 50,
      rows: 1,
      id: 'fuge',
      flag: false,
      thresholdX: undefined,
      thresholdY: undefined,
      clientX: undefined,
      clientY: undefined
    }
  ];

  ngOnInit(
  ) {
  }

  ngOnDestroy() {}

  private _setGadjetParam(gadjet, selector) {
    gadjet.clientX = selector.getBoundingClientRect().right;
    gadjet.clientY = selector.getBoundingClientRect().bottom;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent, targetElement: HTMLElement) {
    event.stopPropagation();
    event.preventDefault();
    this.gadjetList.forEach(gadjet => {
      const dragAreaSelector = this.elementRef.nativeElement.querySelector(`#${gadjet.id}`);
      if (dragAreaSelector.contains(event.target)) {
        gadjet.flag = true;
        gadjet.thresholdX = (dragAreaSelector.parentNode.offsetWidth / gadjet.cols) * 0.9;
        gadjet.thresholdY = (dragAreaSelector.parentNode.offsetHeight / gadjet.rows) * 0.9;
        this._setGadjetParam(gadjet, dragAreaSelector);
      }
    });
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent, targetElement: HTMLElement) {
    event.stopPropagation();
    event.preventDefault();
    this.gadjetList.forEach(gadjet => {
      if (gadjet.flag) {
        const dragAreaSelector = this.elementRef.nativeElement.querySelector(`#${gadjet.id}`);
        this._setGadjetParam(gadjet, dragAreaSelector);

        // 横の拡大
        if (gadjet.clientX < event.clientX && (event.clientX - gadjet.clientX) > gadjet.thresholdX) {
          if (gadjet.cols < this.cols) {
            gadjet.cols++;
          }
        // 横の縮小
        } else if (gadjet.clientX > event.clientX && (gadjet.clientX - event.clientX) > gadjet.thresholdX) {
          if (gadjet.cols > 1) {
            gadjet.cols--;
          }
        }

        // 縦の拡大
        if (gadjet.clientY < event.clientY && (event.clientY - gadjet.clientY) > gadjet.thresholdY) {
          gadjet.rows++;
        // 縦の縮小
        } else if (gadjet.clientY > event.clientY && (gadjet.clientY - event.clientY) > gadjet.thresholdY) {
          if (gadjet.rows > 1) {
            gadjet.rows--;
          }
        }
      }
    });
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent, targetElement: HTMLElement) {
    console.log('mouse up');
    event.stopPropagation();
    event.preventDefault();
    this.gadjetList.forEach(gadjet => {
      gadjet.flag = false;
    });
  }

}
