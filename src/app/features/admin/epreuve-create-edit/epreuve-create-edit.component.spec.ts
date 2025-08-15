import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpreuveCreateEditComponent } from './epreuve-create-edit.component';

describe('EpreuveCreateEditComponent', () => {
  let component: EpreuveCreateEditComponent;
  let fixture: ComponentFixture<EpreuveCreateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpreuveCreateEditComponent]
    });
    fixture = TestBed.createComponent(EpreuveCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
