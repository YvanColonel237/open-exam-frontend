import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const sliderElems = document.querySelectorAll('.slider');
    M.Slider.init(sliderElems, {
      indicators: true,
      height: 400, /* Nouvelle hauteur du slider */
      transition: 500,
      interval: 4000
    });
  }

}
