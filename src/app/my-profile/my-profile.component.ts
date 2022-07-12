
import { Component, OnInit, Injector, DoCheck, OnChanges } from '@angular/core';
import { dataService } from '@app/service/common/dataService';
import { ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormControl, FormGroupDirective, NgForm, AbstractControl, ValidationErrors, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ModService } from '@app/service';
import { AppComponentBase } from '@shared/app-component-base';
import { UserRoles } from '@app/enums/user-roles';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdatePasswordComponent } from "./update-password/update-password.component";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import * as moment from 'moment';
export class FormGroupErrorStateMatcher implements ErrorStateMatcher {
  constructor(private formGroup: FormGroup) { }

  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control && control.dirty && control.touched && this.formGroup && this.formGroup.errors && this.formGroup.errors.areEqual;
  }
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent extends AppComponentBase implements OnInit, DoCheck {
  personalInforMationForm: FormGroup;
  qualificationAndSpecializationForm: FormGroup;
  researchDevelopmentForm: FormGroup;
  organizatioDetailsForm: FormGroup;
  experienceDetailsForm: FormGroup;
  costCalCulationDetailsForm: FormGroup;
  updateDocumentForm: FormGroup;
  userId = this.appSession.user.id;
  editProfile = false;
  skills = new FormControl();
  skillSets: string[] = ['HTML', 'JavaScript', 'Angular', 'Node', 'React', 'Gulp'];
  profile = {
    firstname: "",
    lastname: "",
    uname: "",
    email: "",
    city: "",
    country: ""
  }
  newProfile: any = {};
  passwords: any = {};
  updatePassword: boolean = false;
  skillList: any[] = [];
  userRoles = UserRoles;
  currentUserRole: string;
  isSuperAdmin: boolean;
  isEditPersonalInfo: boolean;
  isEditAvailabilityInfo: boolean = false;
  platFormUserId: number = this.dataService.currentPlatformUserId;
  personalInfo: any;
  educationQualification: any;
  researchDeveloment: any;
  experienceDetails: any;
  costCalCulation: any[];
  organizationDetails: any;
  costForTrainer: any[];
  skillTechnology: any[];
  subjectTaughtByTrainer: any[];
  costFor15Minutes: string;
  costFor30Minutes: string;
  costFor45Minutes: string;
  costFor1Hour: string;
  costFor4Hour: string;
  costFor8Hour: string;
  costForLongTerms: string;
  primaryTechnology: any;
  primarySkills: any;
  secondaryTechnology: any;
  secondarySkills: any;
  isSecondaryTechnologyFlag: boolean;
  subjectTaughtPg: any[] = [];
  subjectTaughtUg: any[] = [];
  allLanguage: any;
  firstname: string;
  index: number;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  language: string;
  about: string;
  aboutDetails: string;
  isEditResearch: boolean;
  languageData: any;
  addMoreRow: boolean;
  editEducation: boolean;
  selectedLanguageIdList = [];
  langugeDropdownSettings: IDropdownSettings = {};
  selectedLanguage = [];
  selectedLanguageList: any[] = [];
  qualificationvalue: string = "";
  specializationvalue: string = "";
  conferencePapervalue: string = "";
  honorsAndAwardsvalue: string = "";
  conferenceAttendevalue: string = "";
  selectedSkillIdList: any;
  researchPapers: string;
  researchPaperLinks: string;
  researchOrProjectGuidances: string;
  researchProjects: string;
  journalPublication: string;
  booksPublished: string;
  isTrainer: boolean;
  isEditOrganizationDetails: boolean;
  associationWithProfessionalBodies: any;
  department: any;
  designation: any;
  administrativeAssignments: any;
  dateOfJoining: any;
  trainerCodeEmployeeCode: any;
  isEditCostCalculationDetails: boolean;
  costOfCalculationArray: any[] = [];
  costValue: any[] = [];
  allTechnology: any[];
  allSkills: any[];
  isEditExperienceDetails: boolean;
  microtutoring: any;
  trainingProjectName: any;
  subjectLevelTaught: any[] = [];
  subjectTaughtPGLevel: any;
  subjectTaughtUGLevel: any;
  totalExperience: number;
  relevantExperiences: number;
  trainingsOrProjectTaken: string;
  relevantExperience: number;
  microtutoringValue: any[];
  certiFicationsValue: any[];
  subjectTaught: any[] = [];
  primarySkillsId: any;
  primaryTechnologyId: any;
  skillsTechnologyArray: any[] = [];
  cerificate: any[];
  isPermissionForTab: boolean;
  subjectTaughtPgLevel: any;
  subjectTaughtUgLevel: any;
  certiFication: any;
  technologyAndSkillDropdownSettings: IDropdownSettings = {};
  selectedTechnologyList: any[] = [];
  selectedSkillList: any[] = [];
  uloadUserDocuments: any[] = [];
  formData: any;
  files: any[] = [];
  imageSrc: string = '';
  file: any;
  getDocuments: any[] = [];
  videoUrl: string;
  documentUrl: string;
  imageUrl: string;
  canbeMentorFlag: boolean;
  isEditUploadDocument: boolean;
  utcLoginTime: any;
  utcLogoutTime: any;
  isMonday: boolean = false;
  isTuesday: boolean = false;
  isWednesday: boolean = false;
  isThursday: boolean = false;
  isFriday: boolean = false;
  isSaturday: boolean = false;
  isSunday: boolean = false;
  loginTime: string;
  logoutTime: string;
  ngxloginTime: any;
  ngxlogoutTime: any;

  private static areEqual(c: AbstractControl): ValidationErrors | null {
    const keys: string[] = Object.keys(c.value);
    for (const i in keys) {
      if (i !== '0' && c.value[keys[+i - 1]] !== c.value[keys[i]]) {
        return { areEqual: true };
      }
    }
  }

  public parentFormGroup: FormGroup;
  public passwordsFormGroup: FormGroup;
  public equalMatcher: FormGroupErrorStateMatcher;

  updateProfile() {
    this.editProfile = !this.editProfile;
  }
  resetPassword() {
    this.updatePassword = !this.updatePassword;
    this.parentFormGroup.reset();
  }

  UpdateProfile() {
    this.newProfile.id = this.userId;
    this.newProfile.name = this.profile.firstname;
    this.newProfile.surname = this.profile.lastname;
    this.newProfile.name = this.newProfile.name.trim();
    this.newProfile.surname = this.newProfile.surname.trim();
    if (this.newProfile.name != null && this.newProfile.name != "") {
      this.modService.updateProfile(this.newProfile).subscribe(success => {
        if (success) {
          this.toastr.success('Profile updated successfully');
          this.appSession.user.name = this.newProfile.name;
        }
      });
    }
    else
      this.toastr.warning("Please enter name.");

  }
  closeModal() {
    this.updatePassword = !this.updatePassword;
  }
  public constructor(
    private dataService: dataService,
    injector: Injector,
    private modService: ModService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { super(injector); }

  updatePasscode(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '40vw';
    const dialogRef = this.dialog.open(UpdatePasswordComponent, dialogConfig);
  }
  ngOnInit() {
    if (this.dataService.currentUserRole == UserRoles[1]) {
      this.isSuperAdmin = true;
    }
    this.initForm();
    this.getUploadDocument();
    this.getUserDetails();
    this.index = 0;
    this.showProfileDetails();
    this.langugeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'language',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
    this.technologyAndSkillDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };

    this.dataService.pageName = 'My Profile';
    if (this.dataService.isLoading) {
      this.dataService.isLoading = false;
    }
    this.passwordsFormGroup = new FormGroup({
      'newPassword': new FormControl('', [
        Validators.required,
        Validators.pattern('(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$')]),
      'repeatNewPassword': new FormControl('', [Validators.required])
    }, MyProfileComponent.areEqual);

    this.parentFormGroup = new FormGroup({
      'currentPassword': new FormControl('', [Validators.required]),
      'passwords': this.passwordsFormGroup
    });

    this.equalMatcher = new FormGroupErrorStateMatcher(this.passwordsFormGroup);
  }

  changePassword(formValue: any) {
    this.passwords.CurrentPassword = formValue.currentPassword;
    this.passwords.NewPassword = formValue.passwords.newPassword;
    if (this.passwords.CurrentPassword !== this.passwords.NewPassword) {
      this.modService.changePassword(this.passwords).subscribe(success => {
        if (success) {
          this.toastr.success('Password updated successfully');
          this.parentFormGroup.reset();
          this.router.navigate(['/']);
        }
      });
    }
    else {
      this.toastr.error('Old password and new password is same.');
    }
  }

  showProfileDetails() {
    this.modService.getUserDetails(this.userId).subscribe(res => {
      if (this.platFormUserId) {
        this.getPersonalInfo();
      }
      this.profile.firstname = res.result.name;
      this.profile.lastname = res.result.surName;
      this.profile.uname = res.result.name;
      this.profile.email = res.result.email;
      this.currentUserRole = res.result.role.name.toUpperCase();
      let userCategorySkills = (res.result.userCategories && res.result.userCategories.length) ? res.result.userCategories.map(userCategoryObj => userCategoryObj.skill) : [];
      this.skillList = userCategorySkills.filter((value, index, self) => self.indexOf(value) === index); // Distinct skills
    });
  }

  addButtonClick() {
    this.addMoreRow = true;
  }

  tabChanged(event) {
    let eventIndex = event.index;
    switch (eventIndex) {
      case 0:
        this.getPersonalInfo();
        break;
      case 1:
        this.getUserAvilability();
        break;
      case 2:
        this.getEducationQualification();
        break;
      case 3:
        this.getResearchDevelopment();
        break;
      case 4:
        this.getOrganizationDetails();
        break;
      case 5:
        this.getExperienceDetails();
        this.getTechnology();
        this.getSkills();
        break;
      case 6:
        this.getCostCalCulationDetails();
        break;
    }
  }

  getPersonalInfo() {
    this.dataService.isLoading = true;
    this.modService.getPersonalInfo(this.platFormUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res && res.result) {
        this.personalInfo = res.result;
        let selectedLanguage = res.result.spokenLanguage.map(x => { return { id: x.languageId, language: x.language } });
        this.selectedLanguage = [];
        this.selectedLanguage.push(...selectedLanguage);
        this.selectedLanguageList.push(...selectedLanguage);
        this.languageData = res.result.spokenLanguage;
        let languages = (this.languageData && this.languageData.length) ? this.languageData.map(x => x.language) : [];
        this.personalInfo.languages = languages.join(',');
      }
    });
  }

  updatePersonalInfo() {
    if (this.personalInforMationForm.valid) {
      if (this.isTrainer && !this.selectedLanguageList.length) {
        this.toastr.warning("Please select atleast one language");
        return;
      }
      let personalData = {
        name: this.firstname,
        surName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        location: this.location,
        aboutYourself: this.aboutDetails,
        spokenLanguage: []
      };
      if (this.isTrainer) {
        personalData.spokenLanguage = this.selectedLanguageList.map(x => { return { languageId: x.id, language: x.language } });
      }
      this.dataService.isLoading = true;
      this.modService.updatePersonalInfo(this.platFormUserId, personalData).pipe(
        finalize(() => {
        })
      ).subscribe(res => {
        if (res.success) {
          this.getPersonalInfo();
          this.toastr.success("Personal information has been updated successfully");
          this.isEditPersonalInfo = false;
        }
      }, err => {
        this.toastr.error("Something went wrong, please try again");
      });
    }
    else {
      this.toastr.warning("Please enter valid details");
    }
  }
  endMinDate: any;
  handleInputChange(item) {

  }
  changeTechnology(item) {

  }

  getUserAvilability() {
    this.modService.getUserAvilability(this.platFormUserId).subscribe(data => {
      this.dataService.isLoading = this.dataService.doneLoading();
      this.isMonday = data.result.monday;
      this.isTuesday = data.result.tuesday;
      this.isWednesday = data.result.wednesday;
      this.isThursday = data.result.thursday;
      this.isFriday = data.result.friday;
      this.isSaturday = data.result.saturday;
      this.isSunday = data.result.sunday;
      this.ngxloginTime = this.toLocalFormat(data.result.loginTime);
      this.ngxlogoutTime = this.toLocalFormat(data.result.logoutTime);
      this.loginTime = this.toLocalFormat(data.result.loginTime);
      this.logoutTime = this.toLocalFormat(data.result.logoutTime);
    });
  }
  getEducationQualification() {
    this.dataService.isLoading = true;
    this.modService.getEducationQualification(this.platFormUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      this.educationQualification = res.result;
      this.qualificationvalue = this.educationQualification.qualificationInfo.map(x => x.qualification).join(',');
      this.specializationvalue = this.educationQualification.qualificationInfo.map(x => x.specialization).join(',');
      this.conferencePapervalue = this.educationQualification.conferencePapers ? this.educationQualification.conferencePapers.join(',') : "";
      this.honorsAndAwardsvalue = this.educationQualification.honorsAndAwards ? this.educationQualification.honorsAndAwards.join(',') : "";
      this.conferenceAttendevalue = this.educationQualification.attentedConferenceAndSeminars ? this.educationQualification.attentedConferenceAndSeminars.join(',') : "";
    });
  }

  onLanguageSelect(item: any) {
    this.selectedLanguageList.push(item);
  }

  onLanguageDeSelect(item: any) {
    this.selectedLanguageList = this.selectedLanguageList.filter(x => x.id !== item.id);
  }

  onLanguageSelectAll(Language: any) {
    this.selectedLanguageList = [];
    this.allLanguage.forEach(lang => {
      this.selectedLanguageList.push(lang);
    });
  }

  onDeselectLanguageAll(Language: any) {
    this.selectedLanguageList = [];
  }

  onTechnologySelect(item: any) {
    this.selectedTechnologyList.push(item);

  }

  onTechnologyDeSelect(item: any) {
    this.selectedTechnologyList = this.selectedTechnologyList.filter(x => x.id !== item.id);
  }

  onTechnologySelectAll(technology: any) {
    this.selectedTechnologyList = [];
    this.allTechnology.forEach(tech => {
      this.selectedTechnologyList.push(tech);
    });
  }

  onTechnologyDeSelectAll(technology: any) {
    this.selectedTechnologyList = [];
  }

  onSkillSelect(item: any) {
    this.selectedSkillList.push(item);
  }

  onSkillDeSelect(item: any) {
    this.selectedSkillList = this.selectedSkillList.filter(x => x.id !== item.id);
  }

  onSkillSelectAll(skill: any) {
    this.selectedSkillList = [];
    this.allSkills.forEach(skill => {
      this.selectedSkillList.push(skill);
    });
  }

  onSkillDeSelectAll(skill: any) {
    this.selectedSkillList = [];
  }

  getResearchDevelopment() {
    this.dataService.isLoading = true;
    this.modService.getResearchDevelopment(this.platFormUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res.result) {
        let rearchPaperNames = [];
        let paperLinks = [];
        if (res.result.researchPaperLink) {
          res.result.researchPaperLink.forEach(element => {
            rearchPaperNames.push(element.rearchPaperName);
            paperLinks.push(element.paperLink);
          });
        }
        let researchDevelopmentDetails = {
          booksPublished: res.result.booksPublished ? res.result.booksPublished.join(',') : '',
          journalPublication: res.result.journalPublication ? res.result.journalPublication.join(',') : '',
          researchProjects: res.result.researchProjects ? res.result.researchProjects.join(',') : '',
          researchOrProjectGuidance: res.result.researchOrProjectGuidance ? res.result.researchOrProjectGuidance.join(',') : '',
          resarchPaperName: rearchPaperNames ? rearchPaperNames.join(',') : '',
          paperLink: paperLinks ? paperLinks.join(',') : ''
        }
        this.researchDeveloment = researchDevelopmentDetails;
      }
    }, err => { });
  }

  editResearchInfo() {
    this.isEditResearch = true;
    this.researchPapers = this.researchDeveloment.resarchPaperName;
    this.researchPaperLinks = this.researchDeveloment.paperLink;
    this.researchOrProjectGuidances = this.researchDeveloment.researchOrProjectGuidance;
    this.researchProjects = this.researchDeveloment.researchProjects;
    this.journalPublication = this.researchDeveloment.journalPublication;
    this.booksPublished = this.researchDeveloment.booksPublished;
  }

  cancelResearchInfo() {
    this.isEditResearch = false;
  }

  updateResearchInfo() {
    if (this.researchDevelopmentForm.valid) {
      let researchPaper = this.researchPapers.split(',');
      let researchPaperLink = this.researchPaperLinks.split(',');
      if (researchPaper.length == researchPaperLink.length) {
        let researchPaperData = [];
        for (let index = 0; index < researchPaper.length; index++) {
          let researchData = {
            rearchPaperName: researchPaper[index],
            paperLink: researchPaperLink[index]
          }
          researchPaperData.push(researchData);
        }
        let updatedResearchDevelopmentData = {
          researchOrProjectGuidance: this.researchOrProjectGuidances.split(','),
          researchProjects: this.researchProjects.split(','),
          journalPublication: this.journalPublication.split(','),
          booksPublished: this.booksPublished.split(','),
          researchPaperLink: researchPaperData
        };
        this.dataService.isLoading = true;
        this.modService.updateResearchDevelopmentInfo(this.platFormUserId, updatedResearchDevelopmentData).pipe(
          finalize(() => {
          })
        ).subscribe(res => {
          if (res) {
            this.getResearchDevelopment();
            this.toastr.success("Research and development has been updated successfully");
            this.isEditResearch = false;
          }
        }, err => {
          this.toastr.error("Something went wrong, please try again");
        });
      }
      else {
        this.toastr.warning("Mismatch between research-paper and research-paper-link");
      }
    }
    else {
      this.toastr.warning("Please enter valid details");
    }
  }

  getOrganizationDetails() {
    this.dataService.isLoading = true;
    this.modService.getOrganizationDetails(this.platFormUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res.result) {
        this.organizationDetails = res.result;
        this.organizationDetails.associationWithProfessionalBodies = res.result.associationWithProfessionalBodies.join(',');
        this.organizationDetails.administrativeAssignments = res.result.administrativeAssignments.join(',');
      }
    });
  }
  getExperienceDetails() {
    this.dataService.isLoading = true;
    this.modService.getExperienceDetails(this.platFormUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res.result) {
        this.experienceDetails = res.result;
        this.skillTechnology = res.result.skillTechnology;
        this.subjectTaught = res.result.subjectTaught;
        this.microtutoringValue = res.result.microTutoring.join(',');
        this.certiFicationsValue = res.result.certification.join(',');
        this.subjectLevelTaught = res.result.subjectTaught;
        this.totalExperience = res.result.totalExperience;
        this.relevantExperiences = res.result.relaventExperience;
        this.trainingsOrProjectTaken = res.result.trainingsOrProjectTaken ? res.result.trainingsOrProjectTaken.join(',') : '';
        this.subjectTaughtUgLevel = this.subjectLevelTaught.filter(x => x.levelId === 1).map(r => r.subject).join(',');
        this.subjectTaughtPgLevel = this.subjectLevelTaught.filter(x => x.levelId === 2).map(r => r.subject).join(',');
        for (let i = 0; i < this.skillTechnology.length; i++) {
          if (this.skillTechnology[i].isPrimary) {
            this.primaryTechnology = this.skillTechnology[i].technology;
            this.primarySkills = this.skillTechnology[i].skill;
          }
          if (this.skillTechnology.length > 1) {
            this.isSecondaryTechnologyFlag = true;
            if (!this.skillTechnology[i].isPrimary) {
              this.secondaryTechnology = this.skillTechnology[i].technology;
              this.secondarySkills = this.skillTechnology[i].skill;
            }
          }
        }
      }
    });
  }

  getTechnology() {
    this.modService.getAllTechnology().subscribe(data => {
      if (data.result) {
        this.allTechnology = data.result.items;
      }
    });
  }

  // for get All Skills
  getSkills() {
    this.modService.getAllSkill().subscribe(data => {
      if (data.result) {
        this.allSkills = data.result.items;
      }
    });
  }

  getCostCalCulationDetails() {
    this.dataService.isLoading = true;
    this.modService.getCostCalCulationDetails(this.platFormUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res.result) {
        this.costForTrainer = res.result.trainingCost;
        if (this.costForTrainer) {
          this.costForTrainer.filter(cost => cost.costTypeId === 1).map(res => { this.costFor15Minutes = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 2).map(res => { this.costFor30Minutes = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 3).map(res => { this.costFor45Minutes = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 4).map(res => { this.costFor1Hour = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 5).map(res => { this.costFor4Hour = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 6).map(res => { this.costFor8Hour = res.cost; });
          this.costForTrainer.filter(cost => cost.costTypeId === 7).map(res => { this.costForLongTerms = res.cost; });
        }
      }
    });
  }
  getLanguage() {
    this.modService.getLanguages().subscribe(data => {
      this.allLanguage = data.result;
    });
  }

  initForm(): void {
    if (this.isTrainer) {
      this.personalInforMationForm = this.formBuilder.group({
        firstname: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        lastName: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        email: [null, [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.email]],
        phoneNumber: [null, [Validators.pattern("[0-9 ]{10}"), WhiteSpaceValidators.emptySpace()]],
        location: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        aboutDetails: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        selectedLanguage: [null]
      });

      this.qualificationAndSpecializationForm = this.formBuilder.group({
        qualification: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        specialization: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        conferencePaper: [''],
        honorsAndAwards: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        conferenceAttende: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
      });

      this.researchDevelopmentForm = this.formBuilder.group({
        researchWhitePaper: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        researchPaperLink: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        researchProjectGuidance: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        researchProject: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        journalPublication: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        bookPublished: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
      });
      this.organizatioDetailsForm = this.formBuilder.group({
        associationWithProfessionalBodies: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        department: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        designation: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        administrativeAssignments: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        dateOfJoining: ['', [Validators.required]],
        trainerCodeEmployeeCode: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
      });
      this.experienceDetailsForm = this.formBuilder.group({
        totalExperience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        relevantExperience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        primaryTechnology: ['', [Validators.required]],
        primarySkills: ['', [Validators.required]],
        microtutoring: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        trainingProjectName: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        subjectTaughtUGLevel: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        subjectTaughtPGLevel: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        certiFication: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]]
      });
      this.costCalCulationDetailsForm = this.formBuilder.group({
        costFor15Minutes: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costFor30Minutes: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costFor45Minutes: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costFor1Hour: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costFor4Hour: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costFor8Hour: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costForLongTerms: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      });
    }
    else {
      this.personalInforMationForm = this.formBuilder.group({
        firstname: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        lastName: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        email: [null, [Validators.required, WhiteSpaceValidators.emptySpace(), Validators.email]],
        phoneNumber: [null, [Validators.pattern("[0-9 ]{10}"), WhiteSpaceValidators.emptySpace()]],
        location: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        aboutDetails: [null, [Validators.required, WhiteSpaceValidators.emptySpace()]],
        selectedLanguage: [null]
      });

      this.updateDocumentForm = this.formBuilder.group({
        image: [''],
        document: [''],
        videoProfileBlobUrl: [''],
      });

    }
  }

  editPersonalInfo() {
    this.isEditPersonalInfo = true;
    this.getLanguage();
    this.firstname = this.personalInfo.name;
    this.lastName = this.personalInfo.surName;
    this.email = this.personalInfo.email;
    this.phoneNumber = this.personalInfo.phoneNumber;
    this.location = this.personalInfo.location;
    this.aboutDetails = this.personalInfo.aboutYourself;

  }
  editAvailabityInfo() {
    this.isEditAvailabilityInfo = true;
  }
  cancelPersonalInfo() {
    this.isEditPersonalInfo = false;
  }

  editEducationDetails() {
    this.editEducation = true;
  }

  cancelEditEducation() {
    this.editEducation = false;
  }

  updateEducationAndQualification() {
    if (this.qualificationAndSpecializationForm.valid) {
      if (this.qualificationAndSpecializationForm.value.qualification.split(',').length !== this.qualificationAndSpecializationForm.value.specialization.split(',').length) {
        this.toastr.warning("Mismatch in Qualification and Specialization");
        return;
      }
      let educationAndQualificationInfo: any = {};
      educationAndQualificationInfo.QualificationInfo = [];
      let qualificationList = this.qualificationAndSpecializationForm.value.qualification.split(',');
      let specializationList = this.qualificationAndSpecializationForm.value.specialization.split(',');
      for (let i = 0; i < this.qualificationAndSpecializationForm.value.qualification.split(',').length; i++) {
        educationAndQualificationInfo.QualificationInfo.push({ "qualification": qualificationList[i], "specialization": specializationList[i] });
      }
      educationAndQualificationInfo.conferencePapers = this.qualificationAndSpecializationForm.value.conferencePaper.split(',');
      educationAndQualificationInfo.honorsAndAwards = this.qualificationAndSpecializationForm.value.honorsAndAwards.split(',');
      educationAndQualificationInfo.AttentedConferenceAndSeminars = this.qualificationAndSpecializationForm.value.conferenceAttende.split(',');
      this.dataService.isLoading = true;
      this.modService.updateEducationQualification(this.platFormUserId, educationAndQualificationInfo).pipe(
        finalize(() => {
        })
      ).subscribe(res => {
        if (res.success) {
          this.getEducationQualification();
          this.toastr.success("Education qualification has been updated successfully");
          this.editEducation = false;
        }
      }, err => {
        this.toastr.error("Something went wrong, please try again");
      });
    }
  }

  editOrganizationDetails() {
    this.isEditOrganizationDetails = true;
    this.associationWithProfessionalBodies = this.organizationDetails.associationWithProfessionalBodies;
    this.department = this.organizationDetails.department;
    this.designation = this.organizationDetails.designation;
    this.administrativeAssignments = this.organizationDetails.administrativeAssignments;
    this.dateOfJoining = this.organizationDetails.dateOfJoiningInstitute;
    this.trainerCodeEmployeeCode = this.organizationDetails.mentorCode;
  }

  getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '/' + month + '/' + year;
  }

  updateOrganizatioDetails() {
    if (this.organizatioDetailsForm.valid) {
      this.dataService.isLoading = true;
      let organizationDetails = {
        mentorCode: this.trainerCodeEmployeeCode,
        department: this.department,
        designation: this.designation,
        dateOfJoiningInstitute: moment(this.dateOfJoining).format('YYYY-MM-DD'),
        administrativeAssignments: this.administrativeAssignments.split(','),
        associationWithProfessionalBodies: this.associationWithProfessionalBodies.split(',')
      };
      this.modService.updateOrganizationDetails(this.platFormUserId, organizationDetails).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })
      ).subscribe(data => {
        if (data.success) {
          this.toastr.success('Organization Details updated successfully');
          this.getOrganizationDetails();
          this.isEditOrganizationDetails = false;
        }
        this.modService.updateOrganizationDetails(this.platFormUserId, organizationDetails).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })
        ).subscribe(data => {
          if (data.success) {
            this.toastr.success('Organization Details updated successfully');
            this.getOrganizationDetails();
            this.isEditOrganizationDetails = false;
          }
        });
      });
    }
    else {
      this.toastr.warning("Please enter valid details");
    }
  }
  canceleditOrganizationDetails() {
    this.isEditOrganizationDetails = false;
  }

  eidtCostCalCulation() {
    this.isEditCostCalculationDetails = true;
    this.costOfCalculationArray = [];
    if (this.costForTrainer) {
      this.costForTrainer.filter(cost => cost.costTypeId === 1).map(res => { this.costFor15Minutes = res.cost; });
      this.costForTrainer.filter(cost => cost.costTypeId === 2).map(res => { this.costFor30Minutes = res.cost; });
      this.costForTrainer.filter(cost => cost.costTypeId === 3).map(res => { this.costFor45Minutes = res.cost; });
      this.costForTrainer.filter(cost => cost.costTypeId === 4).map(res => { this.costFor1Hour = res.cost; });
      this.costForTrainer.filter(cost => cost.costTypeId === 5).map(res => { this.costFor4Hour = res.cost; });
      this.costForTrainer.filter(cost => cost.costTypeId === 6).map(res => { this.costFor8Hour = res.cost; });
      this.costForTrainer.filter(cost => cost.costTypeId === 7).map(res => { this.costForLongTerms = res.cost; });
    }
  }

  updateCostCalCulation() {
    if (this.costCalCulationDetailsForm.valid) {
      if (this.costFor15Minutes) {
        let costObjectFor15Minutes = {
          costTypeId: 1,
          cost: this.costFor15Minutes
        };
        this.costValue.push(costObjectFor15Minutes);
      }
      if (this.costFor30Minutes) {
        let costObjectFor30minutes = {
          costTypeId: 2,
          cost: this.costFor30Minutes
        };
        this.costValue.push(costObjectFor30minutes);
      }
      if (this.costFor45Minutes) {
        let costObjectFor45minutes = {
          costTypeId: 3,
          cost: this.costFor45Minutes
        };
        this.costValue.push(costObjectFor45minutes);
      }
      if (this.costFor1Hour) {
        let costObjectFor1Hour = {
          costTypeId: 4,
          cost: this.costFor1Hour
        };
        this.costValue.push(costObjectFor1Hour);
      }
      if (this.costFor4Hour) {
        let costObjectFor4Hour = {
          costTypeId: 5,
          cost: this.costFor4Hour
        };
        this.costValue.push(costObjectFor4Hour);
      }
      if (this.costFor8Hour) {
        let costObjectFor8Hour = {
          costTypeId: 6,
          cost: this.costFor8Hour
        };
        this.costValue.push(costObjectFor8Hour);
      }
      if (this.costForLongTerms) {
        let costObjectForLoTerms = {
          costTypeId: 7,
          cost: this.costForLongTerms
        };
        this.costValue.push(costObjectForLoTerms);
      }

      let costObject = {
        trainingCost: this.costValue
      };
      this.dataService.isLoading = true;
      this.modService.updateCostCalCulation(this.platFormUserId, costObject).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })
      ).subscribe(data => {
        if (data && data.success) {
          this.toastr.success('Cost updated successfully');
          this.getCostCalCulationDetails();
          this.isEditCostCalculationDetails = false;
        }
      });
    }
    else {
      this.toastr.warning("Please enter valid details");
    }
  }

  cancelEidtCalCulationDetails() {
    this.isEditCostCalculationDetails = false;
  }

  editExperienceDetails() {
    this.isEditExperienceDetails = true;
    this.subjectTaughtPg = [];
    this.subjectTaughtUg = [];
    for (let i = 0; i < this.skillTechnology.length; i++) {
      for (let j = 0; j < this.allTechnology.length; j++) {
        if (this.skillTechnology[i].technologyId === this.allTechnology[j].id) {
          this.primaryTechnology = this.allTechnology[j].name;
          this.primaryTechnologyId = this.allTechnology[j].id;
          break;
        }
      }
    }
    for (let i = 0; i < this.skillTechnology.length; i++) {
      for (let j = 0; j < this.allSkills.length; j++) {
        if (this.skillTechnology[i].skillId === this.allSkills[j].id) {
          this.primarySkills = this.allSkills[j].name;
          this.primarySkillsId = this.allSkills[j].id;
          break;
        }
      }
    }
    for (let i = 0; i < this.subjectLevelTaught.length; i++) {
      if (this.subjectLevelTaught[i].levelId === 1) {
        this.subjectTaughtUgLevel = this.subjectLevelTaught[i].subject;
      }

      if (this.subjectLevelTaught[i].levelId === 2) {
        this.subjectTaughtPgLevel = this.subjectLevelTaught[i].subject;
      }
    }
    this.microtutoring = this.microtutoringValue;
    this.certiFication = this.certiFicationsValue;
    this.trainingProjectName = this.experienceDetails.trainingsOrProjectTaken.join(',');
    this.totalExperience = this.totalExperience;
    this.relevantExperience = this.relevantExperiences;
    this.subjectTaughtPGLevel = this.subjectTaughtPgLevel;
    this.subjectTaughtUGLevel = this.subjectTaughtUgLevel;
  }

  updateExperienceDetails() {
    if (this.experienceDetailsForm.valid) {
      this.subjectTaughtByTrainer = [];
      this.skillsTechnologyArray = [];
      let subjectPgLevel = {
        subject: this.subjectTaughtPGLevel,
        levelId: 1
      };
      this.subjectTaughtByTrainer.push(subjectPgLevel);
      let subjectUgLevel = {
        subject: this.subjectTaughtUGLevel,
        levelId: 2
      };

      this.subjectTaughtByTrainer.push(subjectUgLevel);
      let skillTechnologyDetails = {
        skillId: this.primarySkillsId,
        technologyId: this.primaryTechnologyId,
        skill: this.primarySkills,
        technology: this.primaryTechnology,
        isPrimary: true
      };
      this.skillsTechnologyArray.push(skillTechnologyDetails);
      let updateExperience = {
        totalExperience: this.totalExperience,
        relaventExperience: this.relevantExperience,
        subjectTaught: this.subjectTaughtByTrainer,
        skillTechnology: this.skillsTechnologyArray,
        microTutoring: this.microtutoring ? this.microtutoring.split(',') : [],
        trainingsOrProjectTaken: this.trainingProjectName ? this.trainingProjectName.split(',') : [],
        certification: this.certiFication ? this.certiFication.split(',') : [],
      }
      this.dataService.isLoading = true;
      this.modService.updateExperienceDetails(this.platFormUserId, updateExperience).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })
      ).subscribe(data => {
        if (data && data.success) {
          this.toastr.success('Experience details updated successfully');
          this.getExperienceDetails();
          this.isEditExperienceDetails = false;
        }
      });
    }
    else {
      this.toastr.warning("Please enter valid details");
    }
  }

  cancelExperienceDetails() {
    this.isEditExperienceDetails = false;
  }


  updateDocument() {
    const image = this.updateDocumentForm.controls.image.value;
    const doc = this.updateDocumentForm.controls.document.value;
    const video = this.updateDocumentForm.controls.videoProfileBlobUrl.value;
    this.formData = new FormData();
    if (image) {
      this.file = image.files;
      for (var i = 0; i < this.file.length; i++) {
        this.formData.append("files", this.file[i], this.file[i].name);
      }
    }
    if (doc) {
      this.file = doc.files;
      for (var i = 0; i < this.file.length; i++) {
        this.formData.append("files", this.file[i], this.file[i].name);
      }
    }
    if (video) {
      this.file = video.files;
      for (var i = 0; i < this.file.length; i++) {
        this.formData.append("files", this.file[i], this.file[i].name);
      }
    }
    this.modService.updateUserUploadDocument(this.formData, this.platFormUserId).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(data => {
      if (data && data.result) {
        this.toastr.success('document upload successfully');
        this.formData = [];
        this.isEditUploadDocument = false;
        this.getUploadDocument();
      }
      else {
        this.toastr.warning('document upload faild');
      }
    });
  }

  editDocument() {
    this.isEditUploadDocument = true;
  }

  cancelUploadDocument() {
    this.isEditUploadDocument = false;
  }

  getUploadDocument() {
    this.modService.getUploadUserDocuments(this.platFormUserId).subscribe(data => {
      this.getDocuments = data.result;
      this.getDocuments.filter(data => data.docType === 1).map(res => { this.videoUrl = res.blobUrl; });
      this.getDocuments.filter(data => data.docType === 3).map(res => { this.imageUrl = res.blobUrl; });
      this.getDocuments.filter(data => data.docType === 2).map(res => { this.documentUrl = res.blobUrl; });
    })
  }

  getUserDetails() {
    this.modService.getUserDetails(this.dataService.currentPlatformUserId).subscribe(data => {
      this.canbeMentorFlag = data.result.canBeMentor;
      if (this.canbeMentorFlag) {
        this.isTrainer = true;
      }
      else {
        this.isTrainer = false;
      }
      this.initForm();
    })
  }
 
  updateAvailabilityInfo(type) {
    if(this.validateAvailability()==true){
      var userAvailability = [];
      userAvailability.push({
        "userId": this.platFormUserId,
        "monday": this.isMonday,
        "tuesday": this.isTuesday,
        "wednesday": this.isWednesday,
        "thursday": this.isThursday,
        "friday": this.isFriday,
        "saturday": this.isSaturday,
        "sunday": this.isSunday,
        "loginTime": this.toUtcFormat(this.ngxloginTime),
        "logoutTime": this.toUtcFormat(this.ngxlogoutTime),
        "isActive": true,
        "corpTrainer": false,
        "createdBy": this.appSession.user.id
      });
      this.modService.updateUserAvilability(userAvailability).subscribe(data => {
        this.getUserAvilability();
      });
      this.toastr.success("User Avilability Time updated sucessfully");
      this.isEditAvailabilityInfo = false;
    
    }       
  }

  toUtcFormat(value) {
    if (value != null) {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();
      let convertedTime = moment(value, 'hh:mm A').format('HH:mm');
      let dateTime = year + "-" + month + "-" + date + " " + convertedTime + ":00";
      var newDate = new Date(dateTime).toISOString();
      let time = newDate.split('T')[1].replace(".000Z", "");
      return time;
    }
    else
      return null;
  }

  toLocalFormat(time) {
    if (time != null) {
      const convertedTime = moment(time, ["h:mm A"]).format("HH:mm");
      let splitTime = convertedTime.split(':');
      let minutes = (+splitTime[0]) * 60 + (+splitTime[1] + 30);
      let hours = Math.floor(minutes / 60) + 5;
      minutes = minutes % 60;
      return moment(`${hours}.${minutes}`, ["HH.mm"]).format("hh:mm a");
    }
    else
      return null;
  }
  cancelEditAvailabilityInfo() {
    this.isEditAvailabilityInfo = false;
    this.getUserAvilability();
  }
  
  validateAvailability() {    
    if( (this.isSunday == true || this.isMonday == true || this.isTuesday == true || this.isWednesday == true ||
      this.isThursday == true || this.isFriday == true || this.isSaturday == true)&&(this.ngxloginTime == "" || this.ngxloginTime == undefined)) {
        return this.toastr.warning("Please select LogIn Time")
    } 
    else if( (this.isSunday == true || this.isMonday == true || this.isTuesday == true || this.isWednesday == true ||
      this.isThursday == true || this.isFriday == true || this.isSaturday == true)&&(this.ngxlogoutTime == "" || this.ngxlogoutTime == undefined)) {
      return this.toastr.warning("Please select LogOut Time");
    }
    
    return true;
  }
  resetAvailability() {
    this.ngxloginTime = null;
    this.ngxlogoutTime = null;
    this.resetWeekAvaliability();
  }
  resetWeekAvaliability() {
    this.isSunday = false;
    this.isMonday = false;
    this.isTuesday = false;
    this.isWednesday = false;
    this.isThursday = false;
    this.isFriday = false;
    this.isSaturday = false;
  }
  isNgxLogin = false;
  ngxMinlogOutTime:any;
  ngDoCheck() {
    if (this.isSunday == true || this.isMonday == true || this.isTuesday == true || this.isWednesday == true ||
      this.isThursday == true || this.isFriday == true || this.isSaturday == true) {
      this.isNgxLogin = true;
    }
    if (this.isSunday == false && this.isMonday == false && this.isTuesday == false && this.isWednesday == false &&
      this.isThursday == false && this.isFriday == false && this.isSaturday == false) {
      this.isNgxLogin = false;
    }
    if(this.ngxloginTime!=undefined||this.ngxloginTime!=""){    
      this.ngxMinlogOutTime=this.checkStartTime(this.ngxloginTime);     
    }  
  }
  //increase the min end time by 1 minute
  checkStartTime(time) {
    const convertedTime = moment(time, ["h:mm A"]).format("HH:mm");
    let splitTime = convertedTime.split(':');
    let minutes = (+splitTime[0]) * 60 + (+splitTime[1]) + 1;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return moment(`${hours}.${minutes}`, ["HH.mm"]).format("hh:mm a");
  }  
}