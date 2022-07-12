import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { WhiteSpaceValidators } from '@shared/validators/whitespace.validator';
import { ModService } from '@app/service/api/mod.service';
import { ToastrService } from 'ngx-toastr';
import { dataService } from '@app/service/common/dataService';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  singleRegistrationForm: FormGroup;
  isFlagforRollApplyField: boolean;
  registrationForm: FormGroup;
  addMoreRow: boolean;
  primaryTechnology: any[] = [];
  primaryTechnologyObject: any;
  addQualificationForTrainer: any[] = [];
  allTechnology: any[];
  allSkills: any[];
  isSuperAdmin: boolean;
  filteredTenants: any[] = [];
  tenants: any[] = [];
  tenantId: number;
  roles: any[] = [];
  tenantRoles: any[] = [];
  canBeTrainer: boolean;
  canBeTrainee: boolean;
  researchPaperData: any[] = [];
  userProfileDocuments: any[] = [];
  UploadUserData: any;
  formData: any;
  file: any;
  values: any;
  emailFlage: any;
  duplicateEmail: string;
  registrationFormValidationMessages = {
    tenantRequired: 'Please select a tenant',
    roleRequired: 'Please select a role',
    fNameRequired: 'Please enter first name',
    lastNameRequired: 'Please enter last name',
    emailRequired: 'Please enter the valid email',
    phoneNumberRequired: 'Please enter the phone number',
    locationRequired: 'Please enter location name',
    languageRequired: 'Please enter the spoken language',
    aboutYourSelfRequired: 'Please enter about your self',
    qualificationRequired: 'Please enter highest qualification',
    specializationRequired: 'Please enter specialization',
    conferencePaperRequired: 'Please enter conference paper',
    researchWhitePaperRequired: 'Please enter research white paper',
    researchPaperLinkRequired: 'Please enter research paper link',
    departmentRequired: 'Please enter the department name',
    designationRequired: 'Please enter designation',
    dateOfJoiningRequired: 'Please enter joining date',
    trainerCodeEmployeeCodeRequired: 'Please enter trainer code / employee code',
    primaryTechnologyRequired: 'Please enter primary technology',
    primarySkillsRequired: 'Please enter primary skils',
    microtutoringRequired: 'Please enter microtutoring name',
    trainingProjectNameRequired: 'Please enter training project name',
    totalExperienceRequired: 'Please enter your total experience',
    relevantExperienceRequired: 'Please enter your relevant experience',
    costOf15MinRequired: 'Please enter cost for 15 minutes',
    costOf30MinRequired: 'Please enter cost for 30 minutes',
    costOf45MinRequired: 'Please enter cost for 45 minutes',
    costOf1HourRequired: 'Please enter cost for 1 hour',
    costOf4HourRequired: 'Please enter cost for 4 hour',
    costOf8HourRequired: 'Please enter cost for 8 hour',
    costOfLongTermRequired: 'Please enter cost for long Term assignment'
  };

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    private modService: ModService,
    private toastr: ToastrService,
    private dataService: dataService
  ) { }

  back(): void {
    this._router.navigate(['/login']);
  }

  ngOnInit() {
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    if (!this.isSuperAdmin)
      this.tenantId = this.dataService.currentTenentId;
    this.getAllTenants();
    this.getAllRoles();
    this.initSingleRegistrationForm();
    this.getTechnology();
    this.getSkills();
  }

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'tenant') {
      this.filteredTenants = this.performFilter(query, this.tenants, 'tenantName');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenants = res.result;
        this.filteredTenants = this.tenants;
      }
    }, err => { });
  }

  getAllRoles() {
    this.roles = [];
    this.modService.getAllRoles().subscribe(res => {
      if (res.result) {
        this.roles = res.result.items;
        if (!this.isSuperAdmin)
          this.filterTenantRoles(this.tenantId);
      }
    }, err => { });
  }

  filterTenantRoles(tenantId: number) {
    this.tenantRoles = this.roles.filter(x => x.tenantId == tenantId);
  }

  initSingleRegistrationForm(): void {
    if (this.isSuperAdmin) {
      this.singleRegistrationForm = this.formBuilder.group({
        tenant: ['', [Validators.required]],
        role: ['', [Validators.required]],
        firstName: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        lastName: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.maxLength(10), Validators.minLength(10)]],
        location: ['', [Validators.required]],
        canBeTrainer: [''],
        canBeTrainee: [''],
        qualification: [''],
        specialization: [''],
        dateOfJoining: ['', [Validators.required]],
        primaryTechnology: ['', [Validators.required]],
        primarySkills: ['', [Validators.required]],
        totalExperience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        relevantExperience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costOf15Min: ['', [Validators.pattern("^[0-9]*$")]],
        costOf1Hour: ['', [Validators.pattern("^[0-9]*$")]],
        costOfLongTerm: ['', [Validators.pattern("^[0-9]*$")]],
        spokenLanguage: ['', [Validators.required]],
        aboutYourSelf: [''],
        awards: [''],
        conferenceAttende: [''],
        conferencePapers: [''],
        researchWhitePaper: [''],
        researchPaperLink: [''],
        researchProjectGuidance: [''],
        researchProject: [''],
        journalPublication: [''],
        bookPublished: [''],
        department: [''],
        designation: [''],
        administrative: [''],
        trainerCodeEmployeeCode: ['', [Validators.required]],
        secondaryTechnology: [''],
        secondarySkills: [''],
        secondaryTechnologyMore: [''],
        microtutoring: [''],
        certifications: [''],
        trainingProjectName: [''],
        subjectTaughtPG: [''],
        subjectTaughtUG: [''],
        trainingsOrProjectTaken: [''],
        associationWithProfessionalBodies: [''],
        costOf4Hour: ['', [Validators.pattern("^[0-9]*$")]],
        costOf8Hour: ['', [Validators.pattern("^[0-9]*$")]],
        costOf30Min: ['', [Validators.pattern("^[0-9]*$")]],
        costOf45Min: ['', [Validators.pattern("^[0-9]*$")]],
        image: [''],
        document: [''],
        videoProfileBlobUrl: [''],
        addQualification: this.formBuilder.array([
          this.initQualification(),
        ])
      });
    }
    else {
      this.singleRegistrationForm = this.formBuilder.group({
        role: ['', [Validators.required]],
        firstName: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        lastName: ['', [Validators.required, WhiteSpaceValidators.emptySpace()]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
        location: ['', [Validators.required]],
        canBeTrainer: [''],
        canBeTrainee: [''],
        qualification: [''],
        specialization: [''],
        dateOfJoining: ['', [Validators.required]],
        primaryTechnology: ['', [Validators.required]],
        primarySkills: ['', [Validators.required]],
        totalExperience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        relevantExperience: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        costOf15Min: ['', [Validators.pattern("^[0-9]*$")]],
        costOf1Hour: ['', [Validators.pattern("^[0-9]*$")]],
        costOfLongTerm: ['', [Validators.pattern("^[0-9]*$")]],
        spokenLanguage: ['', [Validators.required]],
        aboutYourSelf: [''],
        awards: [''],
        conferenceAttende: [''],
        conferencePapers: [''],
        researchWhitePaper: [''],
        researchPaperLink: [''],
        researchProjectGuidance: [''],
        researchProject: [''],
        journalPublication: [''],
        bookPublished: [''],
        department: [''],
        designation: [''],
        administrative: [''],
        trainerCodeEmployeeCode: ['', [Validators.required]],
        secondaryTechnology: [''],
        secondarySkills: [''],
        secondaryTechnologyMore: [''],
        microtutoring: [''],
        certifications: [''],
        trainingProjectName: [''],
        subjectTaughtPG: [''],
        subjectTaughtUG: [''],
        trainingsOrProjectTaken: [''],
        associationWithProfessionalBodies: [''],
        costOf4Hour: ['', [Validators.pattern("^[0-9]*$")]],
        costOf8Hour: ['', [Validators.pattern("^[0-9]*$")]],
        costOf30Min: ['', [Validators.pattern("^[0-9]*$")]],
        costOf45Min: ['', [Validators.pattern("^[0-9]*$")]],
        image: [''],
        document: [''],
        videoProfileBlobUrl: [''],
        addQualification: this.formBuilder.array([
          this.initQualification(),
        ])
      });
    }
  }

  submitRegistrationDetails() {
    Object.keys(this.singleRegistrationForm.controls).forEach(field => {
      const control = this.singleRegistrationForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      }
    });
    this.modService.getEmailVerification(this.singleRegistrationForm.controls.email.value).subscribe(response => {
      this.emailFlage = response.result;
      if (this.emailFlage) {
        this.toastr.error("Email Id  allready exist");
        return;
      }
      else {
        const formData = new FormData();
        const image = this.singleRegistrationForm.controls.image.value;
        const doc = this.singleRegistrationForm.controls.document.value;
        const video = this.singleRegistrationForm.controls.videoProfileBlobUrl.value;
        if (image) {
          this.file = image.files;
          for (var i = 0; i < this.file.length; i++) {
            formData.append("files", this.file[i], this.file[i].name);
          }
        }
        if (doc) {
          this.file = doc.files;
          for (var i = 0; i < this.file.length; i++) {
            formData.append("files", this.file[i], this.file[i].name);
          }
        }
        if (video) {
          this.file = video.files;
          for (var i = 0; i < this.file.length; i++) {
            formData.append("files", this.file[i], this.file[i].name);
          }
        }
        this.primaryTechnology = [];
        if (!this.singleRegistrationForm.valid) {
          this.toastr.warning("Please enter valid details");
          return;
        }
        this.primaryTechnologyObject = {
          skill: this.singleRegistrationForm.controls.primarySkills.value,
          technology: this.singleRegistrationForm.controls.primaryTechnology.value,
          isPrimary: true
        }
        let researchPaperLink = this.singleRegistrationForm.controls.researchPaperLink.value.split(',');
        let researchPaperName = this.singleRegistrationForm.controls.researchWhitePaper.value.split(',');
        this.researchPaperData = [];
        for (let index = 0; index < researchPaperName.length; index++) {
          let researchData = {
            rearchPaperName: researchPaperName[index],
            paperLink: researchPaperLink[index]
          }
          this.researchPaperData.push(researchData);
        }
        this.primaryTechnology.push(this.primaryTechnologyObject);
        this.addQualificationForTrainer = this.singleRegistrationForm.controls.addQualification.value;
        let registrationObject = {
          tenantDisplayName: this.tenants.find(x => x.id == this.tenantId).tenantDisplayName ? this.tenants.find(x => x.id == this.tenantId).tenantDisplayName : null,
          tenantName: this.tenants.find(x => x.id == this.tenantId).tenantName ? this.tenants.find(x => x.id == this.tenantId).tenantName : null,
          role: this.singleRegistrationForm.controls.role.value ? this.singleRegistrationForm.controls.role.value : null,
          email: this.singleRegistrationForm.controls.email.value ? this.singleRegistrationForm.controls.email.value : null,
          name: this.singleRegistrationForm.controls.firstName.value ? this.singleRegistrationForm.controls.firstName.value : null,
          surName: this.singleRegistrationForm.controls.lastName.value ? this.singleRegistrationForm.controls.lastName.value : null,
          canBeMentor: this.canBeTrainer ? this.canBeTrainer : false,
          canBeMentee: this.canBeTrainee ? this.canBeTrainee : false,
          mentorCode: this.singleRegistrationForm.controls.trainerCodeEmployeeCode.value ? this.singleRegistrationForm.controls.trainerCodeEmployeeCode.value : null,
          designation: this.singleRegistrationForm.controls.designation.value ? this.singleRegistrationForm.controls.designation.value : null,
          department: this.singleRegistrationForm.controls.department.value ? this.singleRegistrationForm.controls.department.value : null,
          educationalQualification: this.addQualificationForTrainer ? this.addQualificationForTrainer : null,
          totalExperience: this.singleRegistrationForm.controls.totalExperience.value ? this.singleRegistrationForm.controls.totalExperience.value : null,
          relaventExperience: this.singleRegistrationForm.controls.relevantExperience.value ? this.singleRegistrationForm.controls.relevantExperience.value : null,
          subjectTaughtUG: (this.singleRegistrationForm.controls.subjectTaughtUG.value).split(','),
          subjectTaughtPG: (this.singleRegistrationForm.controls.subjectTaughtPG.value).split(','),
          skillTechnology: this.primaryTechnology ? this.primaryTechnology : null,
          microTutoring: this.singleRegistrationForm.controls.microtutoring.value ? this.singleRegistrationForm.controls.microtutoring.value : null,
          certification: this.singleRegistrationForm.controls.certifications.value ? this.singleRegistrationForm.controls.certifications.value : null,
          administrativeAssignments: (this.singleRegistrationForm.controls.administrative.value).split(','),
          associationWithProfessionalBodies: (this.singleRegistrationForm.controls.associationWithProfessionalBodies.value).split(','),
          trainingsOrProjectTaken: (this.singleRegistrationForm.controls.trainingProjectName.value).split(','),
          researchPaperLink: this.researchPaperData ? this.researchPaperData : null,
          honoursAndAwards: (this.singleRegistrationForm.controls.awards.value).split(','),
          conferencePapers: (this.singleRegistrationForm.controls.conferencePapers.value).split(','),
          researchOrProjectGuidance: (this.singleRegistrationForm.controls.researchProjectGuidance.value).split(','),
          researchProjects: (this.singleRegistrationForm.controls.researchProject.value).split(','),
          journalPublication: (this.singleRegistrationForm.controls.journalPublication.value).split(','),
          booksPublished: (this.singleRegistrationForm.controls.bookPublished.value).split(','),
          conferenceOrSeminarAttended: (this.singleRegistrationForm.controls.conferenceAttende.value).split(','),
          dateOfJoiningInstitution: moment(this.singleRegistrationForm.controls.dateOfJoining.value).format('YYYY-MM-DD') ? moment(this.singleRegistrationForm.controls.dateOfJoining.value).format('YYYY-MM-DD') : null,
          location: this.singleRegistrationForm.controls.location.value ? this.singleRegistrationForm.controls.location.value : null,
          languageKnown: this.singleRegistrationForm.controls.spokenLanguage.value ? this.singleRegistrationForm.controls.spokenLanguage.value : null,
          phoneNumber: this.singleRegistrationForm.controls.phoneNumber.value ? this.singleRegistrationForm.controls.phoneNumber.value : 0,
          costFor15Minutes: this.singleRegistrationForm.controls.costOf15Min.value ? this.singleRegistrationForm.controls.costOf15Min.value : 0,
          costFor30Minutes: this.singleRegistrationForm.controls.costOf30Min.value ? this.singleRegistrationForm.controls.costOf30Min.value : 0,
          costFor45Minutes: this.singleRegistrationForm.controls.costOf45Min.value ? this.singleRegistrationForm.controls.costOf45Min.value : 0,
          costFor1Hour: this.singleRegistrationForm.controls.costOf1Hour.value ? this.singleRegistrationForm.controls.costOf1Hour.value : 0,
          costFor4Hour: this.singleRegistrationForm.controls.costOf4Hour.value ? this.singleRegistrationForm.controls.costOf4Hour.value : 0,
          costFor8Hour: this.singleRegistrationForm.controls.costOf8Hour.value ? this.singleRegistrationForm.controls.costOf8Hour.value : 0,
          costForLongTermAssignment: this.singleRegistrationForm.controls.costOfLongTerm.value ? this.singleRegistrationForm.controls.costOfLongTerm.value : 0,
          aboutYourself: this.singleRegistrationForm.controls.aboutYourSelf.value ? this.singleRegistrationForm.controls.aboutYourSelf.value : null,
        }

        formData.append('uploaduserdata', JSON.stringify(registrationObject));
        // if(!this.emailFlage){
        this.modService.singleRegistration(formData).pipe(
          finalize(() => {
            this.dataService.isLoading = this.dataService.doneLoading();
          })
        ).subscribe(data => {
          if (data) {
            if (data.result === "") {
              this.ngOnInit();
              this.singleRegistrationForm.reset('');
              this.toastr.success("User Registration has been updated successfully");
              this.reloadPage();
            }
            else {
              this.toastr.error(data.result);
            }
          }
        }, err => {
          this.toastr.error("Something went wrong, please try again");
        });
      }
    })
  }



  initQualification() {
    return this.formBuilder.group({
      qualification: [''],
      specialization: ['']
    });
  }

  addQualiFication() {
    const control = <FormArray>this.singleRegistrationForm.controls['addQualification'];
    control.push(this.initQualification());
  }

  addButtonClick() {
    this.addMoreRow = true;
  }

  getTechnology() {
    this.modService.getAllTechnology().subscribe(data => {
      if (data.result) {
        this.allTechnology = data.result.items;
      }
    });
  }

  getSkills() {
    this.modService.getAllSkill().subscribe(data => {
      if (data.result) {
        this.allSkills = data.result.items;
      }
    });
  }
  reloadPage() {
    window.location.reload();
 }
}