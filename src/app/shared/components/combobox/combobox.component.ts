import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fw-combobox',
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => ComboboxComponent)
  }]
})
export class ComboboxComponent implements ControlValueAccessor {

  listActive = false;
  filteredList:any = [];
  val: any;

  @Input() dataOptions: any;
  @Input() dataKey: string;

  renderText(item:any) {
    return item[this.dataKey];
  }

  comboElOnFocus(event: any) {
    this.listActive = true;
    this.filteredList = this.dataOptions;
  }

  comboElOnKeyup(event: any) {
    this.listActive = true;
    if (event?.target?.value != "") {
      this.filteredList = this.dataOptions.filter((obj: any) => {
        return obj[this.dataKey].toLowerCase().includes(event.target.value.toLowerCase());
      });
    } else {
      this.filteredList = this.dataOptions;
    }
  }

  onSelect(item: any) {
    this.writeValue(item[this.dataKey]);
    this.listActive = false;
  }
  
  // this method sets the value programmatically
  writeValue(value: any) { 
    this.value = value;
  }

  onChange: any = () => {} 
  
  onTouch: any = () => {}

  set value(val: any) {
    // this value is updated by programmatic changes 
    if (val !== undefined && this.val !== val) {
      this.val = val
      this.onChange(val)
      this.onTouch(val)
    }
  }

  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any){ 
    this.onTouch = fn;
  }

}
