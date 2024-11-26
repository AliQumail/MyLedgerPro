import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formsJson } from 'src/app/data/forms-json';
import { DataServiceService } from 'src/app/services/data-service.service';
@Component({
  selector: 'app-dynamic-form-generation',
  templateUrl: './dynamic-form-generation.component.html',
  styleUrls: ['./dynamic-form-generation.component.css']
})
export class DynamicFormGenerationComponent implements OnInit {

  // No initial value since we don't know the controls
  dynamicForm!: FormGroup;
  formsJson: any; 

  constructor(private fb: FormBuilder, private dataService: DataServiceService) {}

  ngOnInit() {
   this.dataService.getFormsJsonData().subscribe((res: any)=>{
    this.formsJson = res;
   });
    const group : any  = {};

    // loop through the JSON file and add each of them as control inside the formGroup
    formsJson.forEach((field: any) => {
      if (!field.hidden) {
        group[field.name] = [field.value ? field.value : '', field.required ? [Validators.required]: []];  
      }
    });
    
    // bind to the actual form group
    this.dynamicForm = this.fb.group(group);
  }

  onSubmit() {
    console.log(this.dynamicForm.value);
    alert(this.dynamicForm.value);
  }
}



