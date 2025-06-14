import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "fw-combobox",
  templateUrl: "./combobox.component.html",
  styleUrl: "./combobox.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ComboboxComponent),
    },
  ],
})
export class ComboboxComponent implements ControlValueAccessor {
  showComboboxOptions = false;
  filteredList: any = [];
  result: any;
  selectedIndex: number = -1;

  @Input() dataOptions: any;
  @Input() dataKey: string;

  renderText(item: any) {
    return item[this.dataKey];
  }

  comboElOnFocus(event: any) {
    this.showComboboxOptions = true;
    this.filteredList = this.dataOptions;
    this.selectedIndex = -1;
  }

  comboElOnKeyup(event: any) {
    this.showComboboxOptions = true;

    switch (event.key) {
      case 'Enter':
        if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredList.length) {
          this.onSelect(this.filteredList[this.selectedIndex]);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
        } else {
          this.selectedIndex = this.filteredList.length - 1;
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (this.selectedIndex < this.filteredList.length - 1) {
          this.selectedIndex++;
        } else {
          this.selectedIndex = 0;
        }
        break;
      default:
        if (event?.target?.value != "") {
          this.filteredList = this.dataOptions.filter((obj: any) => {
            return obj[this.dataKey].toLowerCase().includes(event.target.value.toLowerCase());
          });
        } else {
          this.filteredList = this.dataOptions;
        }
        this.selectedIndex = -1;
    }
  }

  onSelect(item: any) {
    this.writeValue(item[this.dataKey]);
    this.showComboboxOptions = false;
    this.selectedIndex = -1;
  }

  // this method sets the value programmatically
  writeValue(value: any) {
    this.selectedItem = value;
  }

  onChange: any = () => {};

  onTouch: any = () => {};

  set selectedItem(val: any) {
    // this value is updated by programmatic changes
    if (val !== undefined && this.result !== val) {
      this.result = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
