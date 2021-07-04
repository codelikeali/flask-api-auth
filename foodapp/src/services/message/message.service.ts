import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private toastr: ToastrService) {}

  success(message: string, title?: string): void {
      this.toastr.success(message, title, this.getToastOptions());
  }

  error(message: string, title?: string): void {
      this.toastr.error(message, title, this.getToastOptions());
  }

  warning(message: string, title?: string): void {
      this.toastr.warning(message, title, this.getToastOptions());
  }

  info(message: string, title?: string): void {
      this.toastr.info(message, title, this.getToastOptions());
  }

  successSound(){
    let audio = new Audio();
    audio.src = "assets/sounds/success.mp3";
    audio.load();
    audio.play();
  }
  cancelSound(){
    let audio = new Audio();
    audio.src = "assets/sounds/error.mp3";
    audio.load();
    audio.play();
  }
  orderAcceptSound(){
    let audio = new Audio();
    audio.src = "assets/sounds/orderAccept.mp3";
    audio.load();
    audio.play();
  }
  orderCommingSound(){
    let audio = new Audio();
    audio.src = "assets/sounds/orderComming.mp3";
    audio.load();
    audio.play();
  }
  private getToastOptions(): any {
      return {
          closeButton: true,
          timeOut: 7000,
          //positionClass: 'toast-top-center'
      };
  }
}
