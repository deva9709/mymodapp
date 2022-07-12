import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModService } from '@app/service';
import { dataService } from '@app/service/common/dataService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mentorcategories',
  templateUrl: './mentorcategories.component.html',
  styleUrls: ['./mentorcategories.component.css']
})
export class MentorcategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  successMessage: string[] = [];
  errorMessage: string;
  selectedFile: any;
  file: any;
  fileTypeGranted: boolean;
  importCategoryForm: FormGroup;
  isImportCategoryFormSubmitted: boolean;
  constructor(
    private toastr: ToastrService,
    private modService: ModService,
    private dataService: dataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.dataService.pageName = 'Trainer Categories';
    this.importCategoryForm = this.formBuilder.group({
      categoryFile: ['', Validators.required]
    });
    this.initCategoryForm();
  }

  initCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      skills: [''],
      technologies: ['']
    })
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0].type;
      this.file = event.target.files[0];

      if (this.selectedFile == "application/vnd.ms-excel"
        || this.selectedFile == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.fileTypeGranted = true;
        this.toastr.success('File selected, please click on the upload button to import trainer categories.');
      }
      else {
        this.toastr.warning('Upload only excel files');
      }
    }
    else {
      this.toastr.warning('Please select a file');
    }
  }

  importCategories() {
    if (this.importCategoryForm.valid) {
      this.isImportCategoryFormSubmitted = true;
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      this.dataService.isLoading = true;
      this.modService.categoriesImport(formData).pipe(
        finalize(() => {
          this.isImportCategoryFormSubmitted = false;
          this.dataService.isLoading = this.dataService.doneLoading();
        })
      ).subscribe(res => {
        if (res.result) {
          this.toastr.error('Invalid file.');
        }
        else {
          this.toastr.success('Trainer Categories uploaded successfully, please check the logs for detailed information.');
        }
      });
    }
    else {
      this.toastr.warning('Please select a file');
    }
  }

  addCategories(): void {
    // Add skills
    if (this.categoryForm.value.skills) {
      this.dataService.isLoading = true;
      const skillArray = this.categoryForm.value.skills.split(',');
      this.modService.createSkill(skillArray).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe(
          (res) => console.log(res),
          (error: any) => this.toastr.warning(error)
        )
      this.successMessage.push('Skills')
    }

    // Add technologies
    if (this.categoryForm.value.technologies) {
      this.dataService.isLoading = true;
      const techonologyArray = this.categoryForm.value.technologies.split(',');
      this.modService.createTechonology(techonologyArray).subscribe(
        (res) => console.log(res),
        (error: any) => this.toastr.warning(error)
      )
      this.successMessage.push('Technologies')
    }

    if (!this.categoryForm.value.skills.trim() && !this.categoryForm.value.technologies.trim()) {
      this.toastr.warning('Enter the categories separated by commas');
    }

    if (this.successMessage.length) {
      this.toastr.success('Trainer categories have been added successfully')
      this.successMessage = [];
    }

    this.categoryForm.reset();
    this.initCategoryForm();
  }
}
