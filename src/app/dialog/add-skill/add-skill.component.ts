import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ModService } from '@app/service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { dataService } from "@app/service/common/dataService";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.css']
})
export class AddSkillComponent implements OnInit {
  categoryForm: FormGroup;
  successMessage: string[] = [];
  errorMessage: string;
  importCategoryForm: FormGroup;
  isImportCategoryFormSubmitted: boolean;
  selectedTrainer: number;
  selectedTrainerId: number;
  selectedTenant: number;
  selectedTrainerName: string;
  skillName:string;
  technologyName:string;
  selectedTenantName: string;
  selectedTrainerDisplay:string;
  trainersList: any[] = [];
  selectedMentorDetails = [];
  categoryFormValidationMessages = {
    trainerRequired: 'Please select a trainer'
  };

  constructor(
    private toastr: ToastrService,
    private modService: ModService,
    private dataService: dataService,
    private formBuilder: FormBuilder,
    private addSkillDialog: MatDialogRef<AddSkillComponent>) { }

  ngOnInit() {
    this.selectedTenant = this.dataService.currentTenentId;
    this.selectedTenantName = this.dataService.currentTenantName;
    this.getTrainers();
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
  onMentorSelect(item: any) {
    this.selectedMentorDetails = [];
    this.selectedMentorDetails.push({ id: item, role: "1" });
  }
  //To get all trainers
  getTrainers(): void {
    this.trainersList = [];
    this.selectedTrainer = undefined;
    this.dataService.isLoading = true;
    this.modService.getTrainers(this.selectedTenant).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          res.result.forEach(element => {
            let specialization = [];
            element.qualifications.forEach(qualification => {
              if (qualification) {
                specialization.push(qualification.specialization);
              }
            });
            let trainerSpecialization = specialization.filter((value, index, self) => self.indexOf(value) === index); //Distinct skills               
            element.qualifications = trainerSpecialization.join(', ');
            if (element.skillTechnologyCategory) {
              let skills = [];
              let technologies = [];
              element.skillTechnologyCategory.forEach(category => {
                if (category.skill) {
                  skills.push(category.skill.name);
                }
                if (category.technology) {
                  technologies.push(category.technology.name);
                }
              });
              let trainerSkills = skills.filter((value, index, self) => self.indexOf(value) === index); //Distinct skills               
              let trainerTechnologies = technologies.filter((value, index, self) => self.indexOf(value) === index); //Distinct technologies               
              let categories = { skill: trainerSkills.join(', '), technology: trainerTechnologies.join(', ') };
              element.skillTechnologyCategory = categories;
            }
          });
          this.trainersList = res.result;
        }
      }, err => {
        this.toastr.error("Please try again later");
      });
  }

  addSkills(): void {
    if (!(this.categoryForm.value.skills.trim() && this.categoryForm.value.technologies.trim())) {
      this.toastr.warning('Enter Skills/Technologies separated by commas');
    }
    else {
      if (this.selectedTrainerId) {
        // Add skills
        if (this.categoryForm.value.skills) {
          this.dataService.isLoading = true;
          this.skillName = this.categoryForm.value.skills;
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
          this.technologyName = this.categoryForm.value.technologies;
          const techonologyArray = this.categoryForm.value.technologies.split(',');
          this.modService.createTechonology(techonologyArray).subscribe(
            (res) => console.log(res),
            (error: any) => this.toastr.warning(error)
          )
          this.successMessage.push('Technologies')
        }
        this.successMessage.push('Skills')
        this.modService.createSkillByUser(this.selectedTrainerId, this.skillName, this.technologyName).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })).subscribe(res => {
            if (res) {
              if (this.successMessage.length) {
                this.toastr.success(res.result);
                this.successMessage = [];
              }
            }
          }
            , err => {
              this.toastr.warning("Please try again later");
            });
        this.categoryForm.reset();
        //this.selectedTrainerDisplay='';
        this.initCategoryForm();
      }
      else {
        this.toastr.warning('Please select Trainer');
      }
    }
  }
  getTrainerDetails(item){
    this.selectedTrainerId=item.platformUserId;
  }
  closeAddSkill() {
    this.addSkillDialog.close({ isCreated: true });
  }

}
