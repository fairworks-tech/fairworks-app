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

  @Input() dataOptions: any;
  @Input() dataKey: string;

  renderText(item: any) {
    return item[this.dataKey];
  }

  comboElOnFocus(event: any) {
    this.showComboboxOptions = true;
    this.filteredList = this.dataOptions;
  }

  comboElOnKeyup(event: any) {
    this.showComboboxOptions = true;

    // ToDo: Keyboard events to access combo dropdown options
    if (event.key === "Enter") {
    } else if (event.key === "ArrowUp") {
    } else if (event.key === "ArrowDown") {
    }

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
    this.showComboboxOptions = false;
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
