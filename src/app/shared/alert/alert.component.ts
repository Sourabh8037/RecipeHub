import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import * as jquery from 'jquery';

declare let jQuery:jquery;

@Component({
  selector:'app-alert',
  templateUrl:'./alert.component.html',
})
export class AlertComponent implements AfterViewInit,OnDestroy{
  @Input() message:{title:string,body:string};
  @ViewChild('exampleModal') button : ElementRef<any>;
  onClearModal(){
    jQuery(this.button.nativeElement).modal('toggle');
  }
  ngAfterViewInit(){
    jQuery(this.button.nativeElement).modal('show'); 
  }
  ngOnDestroy(){
    jQuery(this.button.nativeElement).modal('dispose');
  }
}