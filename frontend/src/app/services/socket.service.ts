import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOClient.Socket;
  constructor() {
    if (environment.production) {
      this.socket = io(environment.apiEndPoint);
    } else {
      this.socket = io(environment.apiEndPoint);
    }
  }

  // EMITTER
  sendMessage(msg: string) {
    this.socket.emit('sendMessage', { message: msg });
  }
  // registerHandler(onMessageReceived) {
  //   socket.on('message', onMessageReceived)
  // }
  unregisterHandler() {
    this.socket.off('Timer')
  }

  // unpaymentHandler() {
  //   this.socket.off('Payment')
  // }

  disconnect() {
    this.socket.disconnect();
  }
  // HANDLER
  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('testing', msg => {
        observer.next(msg);
      });
    });
  }

  onTimerNotif() {
    return Observable.create(observer => {
      this.socket.on('Timer', msg => {
        observer.next(msg.data.nModified);
      });
    });
  }

  onPaymentRedirect(id) {
    var event = 'Payment'+id;    
    return Observable.create(observer => {
      this.socket.on(event, msg => {
        observer.next(msg.data.nModified);
      });
    });
  }

  onMarginData() {
    var event = 'Margin';    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        // console.log("data Margin ", data);
        observer.next(data);
      });
    });
  }

  onInstrumentData() {
    var event = 'Instrument';    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        // console.log("data Instrument ", data);
        observer.next(data);
      });
    });
  }


  onPositionData() {
    var event = 'Position';    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        // console.log("data Position ", data);
        
        observer.next(data);
      });
    });
  }

  onOrdersData() {
    var event = 'Orders';    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        console.log("data Orders xyz --------- xyz -----", data);
        observer.next(data);
      });
    });
  }

  onTradeData() {
    var event = 'Trade';    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        console.log("data Trade >>>>>>>>>>><<<<<<<<<<<<<< -----", data);
        observer.next(data);
      });
    });
  }

  onUserProfileUpdate(id) {
    var event = 'Profile'+id;  
    return Observable.create(observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
    });
  }

  updateContentData() {
    var event = 'Content';    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        console.log("updateContentData ", data);
        observer.next(data);
      });
    });
  }


  onUserMarginData(id) {
    var event = 'Margin'+id;    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        // console.log("data Margin ", data);
        observer.next(data);
      });
    });
  }

  onUserPositionData(id) {
    var event = 'Position'+id;    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        // console.log("data Position ", data);
        
        observer.next(data);
      });
    });
  }

  onUserOrdersData(id) {
    var event = 'Orders'+id;    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        console.log("data Orders xyz --------- xyz -----", data);
        observer.next(data);
      });
    });
  }

  onUserInstrumentData(id) {
    var event = 'Instrument'+id;    
    return Observable.create(observer => {
      this.socket.on(event, data => {
        // console.log("data Instrument ", data);
        observer.next(data);
      });
    });
  }


  // onTimerNotif(){
  //   let observable = new Observable<any>(observer=>{
  //     this.socket.on('Timer', (data)=>{
  //       console.log("data",data.data.nModified );
  //       observer.next(data.data.nModified);
  //     });
  //     return () => {this.socket.disconnect();}
  //   });
  //   return observable;
  // }
}
