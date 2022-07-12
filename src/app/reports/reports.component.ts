import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ModService } from "@app/service";
import { dataService } from "@app/service/common/dataService";
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DownloadReportType } from '@app/enums/report-type';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportTypes: any[] = [{ "id": 0, "name": "Trainer Sessions List" },
  { "id": 1, "name": "Trainers List" },{ "id": 2, "name": "Trainee Manual Attendance" }];
  trainerSessionDisplayedColumns: string[] = ['Session Title', 'Trainer', 'Trainee Count', 'Trainees', 'Start Date', 'End Date'];
  trainersDisplayedColumns: string[] = ['Trainer', 'Trainer Email', 'Department', 'Designation', 'Specialization', 'Skill', 'Technology'];
  traineeAttendanceDisplayedColumns: string[] = ['Session Title', 'Trainer', 'Skill','Trainee Name', 'Trainee Email','Start Date', 'End Date', 'Attended'];
  code: string = "REPORTS";
  selectedReport: DownloadReportType;
  selectedTrainer: number;
  selectedTenant: number;
  selectedTrainerName: string;
  selectedTenantName: string;
  selectedSessionTitle:string;
  tenantsList: any = [];
  trainersList: any[] = [];
  sessionTitleList: any[] = [];
  rolePermissions: any[] = [];
  showTrainers: boolean;
  showTrainerSessions: boolean;
  showTraineeAttendance:boolean;
  showTenantDPForAttendance:boolean;
  isLoading: boolean;
  trainerSessionsList: any[] = [];
  traineeAttendanceList: any[] = [];
  selectedSessionStatus: number;
  showExport: boolean;
  filteredTenantList: any[] = [];
  filteredTraineeAttendanceList: any[] = [];
  filteredSessionTitleList: any[] = [];
  showTenantDropDown: boolean;
  createPermission: boolean;
  trainerSessions: MatTableDataSource<any>;
  trainersData: MatTableDataSource<any>;
  traineeAttendance: MatTableDataSource<any>;
  sessionStatusList: any = [
    { "id": 2, "name": "Scheduled" },
    { "id": 4, "name": "Completed" },
    { "id": 6, "name": "Canceled" }];

  @ViewChild('trainersListSort') trainersListSort: MatSort;
  @ViewChild('trainersListPagination') trainersListPagination: MatPaginator;
  @ViewChild('trainerSessionsSort') trainerSessionsSort: MatSort;
  @ViewChild('trainerSessionsPagination') trainerSessionsPagination: MatPaginator;
  @ViewChild('traineeAttendanceSort') traineeAttendanceSort: MatSort;
  @ViewChild('traineeAttendancePagination') traineeAttendancePagination: MatPaginator;

  constructor(
    private modService: ModService,
    public dataService: dataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getPermissions();
    this.dataService.pageName = "Reports";
    if (this.dataService.isSuperAdmin) {
      this.showTenantDropDown = true;
      this.getAllTenants();
    }
    else {
      this.showTenantDropDown = false;
      this.selectedTenant = this.dataService.currentTenentId;
      this.selectedTenantName = this.dataService.currentTenantName;
      this.getTrainers();
      this.getSessionTitle();
    }
  }

  getPermissions() {
    if (this.dataService.isSuperAdmin) {
      this.createPermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.code);
      this.createPermission = permissions ? permissions.create : false;
    }
  }

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

  search(query: string, filterFor: string): void {
    if (filterFor.toLowerCase() === 'tenant') {
      this.filteredTenantList = this.performFilter(query, this.tenantsList, 'tenantName');
    }
  }

  performFilter(query: string, filterArray: string[], filterBy: string): string[] {
    query = query.toLocaleLowerCase();
    return filterArray.filter(value => value[filterBy].toLocaleLowerCase().indexOf(query) !== -1);
  }

  getTrainerSessions(): void {
    this.dataService.isLoading = true;
    let data = {
      TenantId: this.selectedTenant,
      SessionStatus: this.selectedSessionStatus,
      UserId: this.selectedTrainer
    }
    this.modService.getAllSessionsForTrainer(data).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.trainerSessionsList = [];
          this.trainerSessionsList = res.result;
          this.loadTrainerSessions();
        }
      }, err => {
        this.toastr.error("Please try again later");
      });
  }
  // get Traineeattendance
  getTraineeAttendance(): void {
    this.dataService.isLoading = true;
      var TenantId=this.selectedTenant;
      var SessionTitle= this.selectedSessionTitle;
    this.modService.getTraineeAttendance(TenantId,SessionTitle).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          this.traineeAttendanceList = [];
          this.traineeAttendanceList = res.result;
          this.loadTraineeAttendance();
        }
      }, err => {
        this.toastr.error("Please try again later");
      });
  }

  loadTraineeAttendance() {
    if (this.createPermission) {
      this.traineeAttendanceList = this.traineeAttendanceList.map(x => { return { sessionTitle: x.sessionTitle, trainerName: x.trainerName, sessionSkill: x.skillName, traineeName: x.traineeName,traineeEmail:x.traineeEmail,startDate: new Date(`${x.startDate}.00Z`), endDate: new Date(`${x.endDate}.00Z`) ,isAttended:x.isAttended} }); ////new Date(Date.parse('06/14/2020 4:41:48 PM UTC')
      this.traineeAttendance = new MatTableDataSource<any>(this.traineeAttendanceList);
      this.traineeAttendancePagination.firstPage();
      this.traineeAttendance.paginator = this.traineeAttendancePagination;
      this.traineeAttendance.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
      this.traineeAttendance.sort = this.traineeAttendanceSort;
      if (this.traineeAttendanceList.length) {
        this.showExport = true;
      }
      else {
        this.showExport = false;
      }
    }
    else {
      this.toastr.warning("You don't have permission to for search a report");
    }
  }

  loadTrainerSessions() {
    if (this.createPermission) {
      this.trainerSessionsList = this.trainerSessionsList.map(x => { return { sessionTitle: x.sessionTitle, trainerName: x.trainerName, traineeCount: x.traineeCount, participants: x.participants, start: new Date(`${x.start}.00Z`), end: new Date(`${x.end}.00Z`) } }); ////new Date(Date.parse('06/14/2020 4:41:48 PM UTC')
      this.trainerSessions = new MatTableDataSource<any>(this.trainerSessionsList);
      this.trainerSessionsPagination.firstPage();
      this.trainerSessions.paginator = this.trainerSessionsPagination;
      this.trainerSessions.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
      this.trainerSessions.sort = this.trainerSessionsSort;
      if (this.trainerSessionsList.length) {
        this.showExport = true;
      }
      else {
        this.showExport = false;
      }
    }
    else {
      this.toastr.warning("You don't have permission to for search a report");
    }
  }

  loadTrainerDetails() {
    if (this.createPermission) {
      this.trainersData = new MatTableDataSource<any>(this.trainersList);
      this.trainersListPagination.firstPage();
      this.trainersData.paginator = this.trainersListPagination;
      this.trainersData.sortingDataAccessor = (data, sortHeaderId) => data[sortHeaderId] ? data[sortHeaderId].toLocaleLowerCase() : '';
      this.trainersData.sort = this.trainersListSort;
      if (this.trainersList.length) {
        this.showExport = true;
      }
      else {
        this.showExport = false;
      }
    }
    else {
      this.toastr.warning("You don't have permission to for search a report");
    }
  }

  getReportsData() {
    if (this.showTrainers) {
      if (this.selectedTenant) {
        this.loadTrainerDetails();
      }
      else {
        this.toastr.warning("Please select a valid tenant");
      }
    }
    else if(this.showTraineeAttendance){
      if(this.selectedTenant && this.selectedSessionTitle)
      {
        this.getTraineeAttendance();
      }
      else{
        this.toastr.warning("Please select a valid tenant/session title");
      }
    }
    else {
      if (this.selectedTenant && this.selectedTrainer && this.selectedSessionStatus) {
        this.getTrainerSessions();
      }
      else {
        this.toastr.warning("Please select a valid tenant/trainer/session status");
      }
    }
  }

  getAllTenants() {
    this.modService.getTenants().subscribe(res => {
      if (res.result) {
        this.tenantsList = res.result;
        this.filteredTenantList = this.tenantsList;
      }
    }, err => { });
  }

  //To get sessionTitle
  getSessionTitle() {
    this.modService.getSessionTitle(this.selectedTenant).subscribe(res => {
      if (res.result) {
        this.sessionTitleList = res.result;
        this.filteredSessionTitleList = this.sessionTitleList;
      }
    }, err => { });
  }

  refresh() {
    if (this.selectedReport === DownloadReportType.TrainerList) {
      this.showTrainerSessions = false;
      this.showTraineeAttendance=false;
      this.showTrainers = true;
      this.selectedTrainer = undefined;
      this.selectedSessionStatus = undefined;
      this.trainersData = new MatTableDataSource<any>();
    }
    else if (this.selectedReport === DownloadReportType.TrainerSession) {
      this.showTrainers = false;
      this.showTraineeAttendance=false;
      this.showTrainerSessions = true;
      this.trainerSessions = new MatTableDataSource<any>();
    }
    else if (this.selectedReport === DownloadReportType.TraineeManualAttendance) {
      this.showTrainers = false;
      this.showTrainerSessions = false;
      this.showTraineeAttendance=true;
      this.traineeAttendance = new MatTableDataSource<any>();
    }
    this.showExport = false;
  }

  downloadAsPDF(selectedReport: DownloadReportType) {
    if (this.selectedReport === DownloadReportType.TrainerList) {
      let body = [];
      let itemNew = [...this.trainersList];
      itemNew.forEach(element => {
        let content = [];
        if (element.externalTrainer)
          content = [element.name + '(Ext)', element.email, element.department, element.designation, element.qualifications, element.skillTechnologyCategory.skill, element.skillTechnologyCategory.technology];
        else
          content = [element.name, element.email, element.department, element.designation, element.qualifications, element.skillTechnologyCategory.skill, element.skillTechnologyCategory.technology];
        body.push(content);
      });

      this.createPdf("Trainers List", [...this.trainersDisplayedColumns], body, "Trainers_Report");
    }
    else if (this.selectedReport === DownloadReportType.TrainerSession) {
      let body = [];
      let itemNew = [...this.trainerSessionsList];
      itemNew.forEach(element => {
        let content = [element.sessionTitle, element.trainerName, element.traineeCount, element.participants.join(', '), this.getFormattedTime(element.start), this.getFormattedTime(element.end)];
        body.push(content);
      });

      this.createPdf("Trainer Sessions List", [...this.trainerSessionDisplayedColumns], body, "Trainer_Sessions_Report");
    }
    else if (this.selectedReport === DownloadReportType.TraineeManualAttendance) {
      let body = [];
      let itemNew = [...this.traineeAttendanceList];
      itemNew.forEach(element => {
        let content = [element.sessionTitle, element.trainerName, element.sessionSkill,element.traineeName,element.traineeEmail, this.getFormattedTime(element.startDate), this.getFormattedTime(element.endDate),element.isAttended];
        body.push(content);
      });
      this.createPdf("Trainee Manual Attendence List", [...this.traineeAttendanceDisplayedColumns], body, "Trainee_Manual_Attendnace_Report");
    }
  }

  createPdf(title, headers, body, fileName) {
    let doc = new jsPDF('l')
    let finalY = doc.lastAutoTable.finalY || 10;
    doc.text(title, 14, finalY + 15);
    doc.autoTable({
      startY: finalY + 20,
      head: [headers],
      body: body
    });
    doc.save(`${fileName}.pdf`);
    this.toastr.success("Your report has been downloaded. Please check your downloads.");
  }

  downloadAsCSV() {
    var csvHeaders, data, fileName;
    if (!this.showTrainerSessions && !this.showTraineeAttendance) {
      fileName = "Trainers_Report";
      csvHeaders = this.trainersDisplayedColumns;
      data = this.trainersList.map(x => {
        if (x.externalTrainer)
          return { name: x.name + '(Ext)', email: x.email, department: x.department, designation: x.designation, qualifications: x.qualifications, skill: x.skillTechnologyCategory.skill, technology: x.skillTechnologyCategory.technology }
        else
          return { name: x.name, email: x.email, department: x.department, designation: x.designation, qualifications: x.qualifications, skill: x.skillTechnologyCategory.skill, technology: x.skillTechnologyCategory.technology }
      });
    }
    else if(!this.showTrainers && !this.showTraineeAttendance) {
      fileName = "Trainer_Sessions_Report";
      csvHeaders = this.trainerSessionDisplayedColumns;
      data = this.trainerSessionsList.map(x => { return { sessionTitle: x.sessionTitle, trainerName: x.trainerName, traineeCount: x.traineeCount, participants: x.participants.join(', '), start: this.getFormattedTime(x.start), end: this.getFormattedTime(x.end) } });
    }
    else {
      fileName = "Trainee_Manual_Attendance_Report";
      csvHeaders = this.traineeAttendanceDisplayedColumns;
      data = this.traineeAttendanceList.map(x => { return { sessionTitle: x.sessionTitle, trainerName: x.trainerName, sessionSkill:x.sessionSkill,traineeName:x.traineeName, traineeEmail:x.traineeEmail, startDate: this.getFormattedTime(x.startDate), endDate: this.getFormattedTime(x.endDate) ,isAttended:x.isAttended} });
    }
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      headers: csvHeaders
    };
    new ngxCsv(data, fileName, options);
    this.toastr.success("Your report has been downloaded. Please check your downloads.");
  }

  getFormattedTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let AmOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    hours = hours <= 9 ? `0${hours}` : hours;
    minutes = minutes < 30 ? "00" : "30";

    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes} ${AmOrPm}`;
  }
}