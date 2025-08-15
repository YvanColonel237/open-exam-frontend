import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionCreateEditComponent } from './correction-create-edit.component';

describe('CorrectionCreateEditComponent', () => {
  let component: CorrectionCreateEditComponent;
  let fixture: ComponentFixture<CorrectionCreateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorrectionCreateEditComponent]
    });
    fixture = TestBed.createComponent(CorrectionCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
