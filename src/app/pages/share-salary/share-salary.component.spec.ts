import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSalaryComponent } from './share-salary.component';

describe('ShareSalaryComponent', () => {
  let component: ShareSalaryComponent;
  let fixture: ComponentFixture<ShareSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
