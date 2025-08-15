import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpreuveListComponent } from './epreuve-list.component';

describe('EpreuveListComponent', () => {
  let component: EpreuveListComponent;
  let fixture: ComponentFixture<EpreuveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpreuveListComponent]
    });
    fixture = TestBed.createComponent(EpreuveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
