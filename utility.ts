import { OnDestroy } from '@angular/core';

export class Utility {
   static checkLoadStatus(array: Array<object>) {
     let loadDoneStatuses = array.filter(item => ["loadDone", "putDone", "postDone", "deleteDone"].includes(item["processingStatus"]));
     return (array.length === loadDoneStatuses.length) ? true : false;
   }
   static checkApiStatus(array: Array<object>) {
     let apiStatuses = array.filter(item => ["200", "201"].includes(item["apiResponse"]["status"]))
     return (array.length === apiStatuses.length) ? true : false;
   }

   static createState(status, data) {
     let returnState: ReturnState = {
       status: status,
       data: data
     }
     return returnState;
   }
}

export interface ReturnState {
  status: string;
  data: any;
}


export interface AllinService extends OnDestroy{ }