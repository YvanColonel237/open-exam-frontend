import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiliereListComponent } from './filiere-list.component';

describe('FiliereListComponent', () => {
  let component: FiliereListComponent;
  let fixture: ComponentFixture<FiliereListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiliereListComponent]
    });
    fixture = TestBed.createComponent(FiliereListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
