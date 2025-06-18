import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ComboboxComponent } from './combobox.component';

describe('ComboboxComponent', () => {
  let component: ComboboxComponent;
  let fixture: ComponentFixture<ComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ComboboxComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.showComboboxOptions).toBe(false);
    expect(component.filteredList).toEqual([]);
    expect(component.result).toBeUndefined();
    expect(component.selectedIndex).toBe(-1);
    expect(component.dataOptions).toEqual([]);
    expect(component.dataKey).toBe('');
  });

  it('should render text using dataKey', () => {
    component.dataKey = 'name';
    const item = { name: 'Test Item' };
    expect(component.renderText(item)).toBe('Test Item');
  });

  it('should show options on focus', () => {
    const mockData = [{ name: 'Item 1' }, { name: 'Item 2' }];
    component.dataOptions = mockData;
    component.comboElOnFocus({});
    expect(component.showComboboxOptions).toBe(true);
    expect(component.filteredList).toEqual(mockData);
    expect(component.selectedIndex).toBe(-1);
  });

  it('should filter options on keyup', () => {
    const mockData = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];
    component.dataOptions = mockData;
    component.dataKey = 'name';
    
    const event = {
      key: 'a',
      target: { value: 'ap' }
    };
    
    component.comboElOnKeyup(event);
    expect(component.filteredList).toEqual([{ name: 'Apple' }]);
  });

  it('should handle selection', () => {
    const mockData = { name: 'Test Item' };
    component.dataKey = 'name';
    const onChangeSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    
    component.onSelect(mockData);
    
    expect(component.showComboboxOptions).toBe(false);
    expect(component.selectedIndex).toBe(-1);
    expect(onChangeSpy).toHaveBeenCalledWith('Test Item');
  });

  it('should handle programmatic value changes', () => {
    const onChangeSpy = jest.fn();
    const onTouchSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    component.registerOnTouched(onTouchSpy);
    
    component.writeValue('New Value');
    
    expect(component.result).toBe('New Value');
    expect(onChangeSpy).toHaveBeenCalledWith('New Value');
    expect(onTouchSpy).toHaveBeenCalledWith('New Value');
  });
});
