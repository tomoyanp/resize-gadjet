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
      cols: 3,
      rows: 1,
      id: 'hoge',
      flag: false,
      height: undefined,
      width: undefined,
      clientX: undefined,
      clientY: undefined,
      style: 'background-color: blue'
    },
    {
      text: 'moge',
      cols: 2,
      rows: 2,
      id: 'moge',
      flag: false,
      height: undefined,
      width: undefined,
      clientX: undefined,
      clientY: undefined,
      style: 'background-color: green'
    },
    {
      text: 'fuga',
      cols: 5,
      rows: 1,
      id: 'fuge',
      flag: false,
      height: undefined,
      width: undefined,
      clientX: undefined,
      clientY: undefined,
      style: 'background-color: red'
    }
  ];

  ngOnInit(
  ) {
  }

  ngOnDestroy() {}

  hogeEvent($event) {
    // console.log($event);
  }

  private _setGadjetParam(gadjet, selector) {
    gadjet.height = selector.parentNode.offsetHeight;
    gadjet.width = selector.parentNode.offsetWidth;
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
        const thresholdX = (gadjet.width / gadjet.cols) * 0.9;
        const thresholdY = gadjet.height / gadjet.rows;
        this._setGadjetParam(gadjet, dragAreaSelector);

        // console.log('********************************');
        // console.log(gadjet.clientX);
        // console.log(gadjet.width);
        // console.log(gadjet.cols);
        // console.log(thresholdX);
        // console.log(event.clientX);

        // 横の拡張
        if (gadjet.clientX < event.clientX && (event.clientX - gadjet.clientX) > thresholdX) {
          if (gadjet.cols < this.cols) {
            console.log('==================');
            gadjet.cols++;
          }
        } else if (gadjet.clientX > event.clientX && (gadjet.clientX - event.clientX) > thresholdX) {
          if (gadjet.cols > 1) {
            gadjet.cols--;
          }
        }
        if (gadjet.clientY < event.clientY && (event.clientY - gadjet.clientY) > thresholdY) {
          gadjet.rows++;
        } else if (gadjet.clientY > event.clientY && (gadjet.clientY - event.clientY) > thresholdY) {
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

  // @HostListener('document:drop', ['$event'])
  // onDropHtmlElement(event: MouseEvent, targetElement: HTMLElement) {
  //   const dragAreaSelector = this.elementRef.nativeElement.querySelector('#drag-area');

  //   if (dragAreaSelector.contains(event.target)) {
  //     console.log(event);
  //     console.log('drop');
  //   } else {
  //     console.log('drop');
  //   }
  // }



}
