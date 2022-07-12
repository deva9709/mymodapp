import { Component, OnInit, ViewChild } from '@angular/core';
import { ModService } from '@app/service';
import * as Chart from 'chart.js';
import { dataService } from '@app/service/common/dataService';
import { AppSessionService } from '@shared/session/app-session.service';
import { MatTableDataSource, MatDatepicker, MatPaginator } from '@angular/material';
import { Moment } from 'moment';
import { UserRoles, SessionStatus, SessionType, TenantName } from '@app/enums/user-roles';
import { ReportType, ChartType } from '@app/enums/report-type';
import 'chartjs-plugin-labels';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IFilters } from '@app/mod-sessions/mod-sessions.component';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface TopMentors {
  mentorName: string,
  rating: number
}
export interface feedbackDetails {
  sessionTitle: string;
  trainerName: string;
  traineeRating: number;
  feedback: string;
  date: Date;
}

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})

export class AdmindashboardComponent implements OnInit {
  mentorEngagementForm: FormGroup;
  trendingSessionForm: FormGroup;
  mentorOnlineHoursForm: FormGroup;
  mentors: any = [];
  minDate: Date;
  minDateForMentorOnlineHour: Date;
  showMentorEngagementChart: boolean = false;
  showTrendingSessionChart: boolean = false;
  showMentorOnlineHoursChart: boolean = false;
  mentorEngagementChart: any;
  trendingSessionChart: any;
  mentorOnlineHoursChart: any;
  mentorEngagementChartColors: any = [];
  trendingSessionChartColors: any = [];
  mentorOnlineHoursChartColors: any = [];
  showNoReportsForMentorEngagement: boolean = false;
  showNoReportsForTrendingSession: boolean = false;
  showNoReportsForOnlineHours: boolean = false;
  currentUserRole: string;
  currentUserType: string;
  startDate: Date;
  endDate: Date;
  totalMentors: number = 0;
  totalMentees: number = 0;
  onlineMentors: number = 0;
  onlineMentees: number = 0;
  topMentors: string[] = ['mentorName', 'rating'];
  showJoin: boolean;
  data: {
    'StartDate': string,
    'EndDate': string,
    'MentorId': number
  };
  trendingSession: {
    'StartDate': string,
    'EndDate': string,
    'TenantId': number
  }
  dataSource: MatTableDataSource<TopMentors>;
  dataSourceForFeedback: MatTableDataSource<TopMentors>;
  todaySession: any = [];
  upcomingSessions: any = [];
  displayUpcomingSessions: any = [];
  displayIndex: number = 0;
  showtimer: string;
  dataSetForMentorEngagement: number[];
  dataSetForTrendingSession: number[];
  dataSetForOnlineHours: any = [];
  dataSetForOnlineHoursInTimeFormat: any = [];
  labelNameForOnlineHours: string[];
  labelNameForMentorEngagement: string[];
  labelNameForTrendingSession: string[];
  showTopTrainers: boolean = false;
  userRoles = UserRoles;
  chartType = ChartType;
  reportType = ReportType;
  mentorEngagementChartType: string = ChartType[1];
  trendingSessionChartType: string = ChartType[1];
  onlineHourChartType: string = ChartType[1];
  errorMessage = {
    selectedMentorRequired: "Please select the mentor.",
    startDateRequired: "Please select the start date.",
    endDateRequired: "Please select the end date.",
    noMentorAvailable: "--none--"
  }
  selectedTenantUserRolesDetails: any[] = [];
  selectedTenant: number;
  isSuperAdmin: boolean;
  isSiteAdmin: boolean = false;
  tenantList: any = [];
  isPending: boolean = false;
  filters: IFilters;
  dataSourceFeedback: MatTableDataSource<feedbackDetails>;
  allFeedback: any[] = [];
  sessionScheduleId: number;
  feedBackDetailsColumns: string[] = ['sessionTitle', 'trainerName', 'traineeRating', 'date', 'feedback'];
  isMenteeBlockFlag: boolean = false;
  canBeMentee: boolean = false;
  menteePlatformId: number;
  isMentorBlockFlag: boolean = false;
  canBeMentor: boolean = false;
  isusersbarchart = false;
  isTrendingsessionschart = false;
  isTrainerengagementchart = false;
  istrainerOnlineHourschart = false;
  isTrainerfeedback = false;
  isTopTrainer = false;
  mentorPlatformId: number;
  tenantId: number;
  curruntTenantName: string;
  tenantValue = TenantName;
  @ViewChild(MatPaginator)
  paginator: MatPaginator; 
  constructor(
    private modService: ModService,
    private dataService: dataService,
    private sessionService: AppSessionService,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder) { }
  public barChartColors = [
    { backgroundColor: 'purple' },
    { backgroundColor: 'brown' }
  ]
  public barChartOptions = {
    responsive: true,
    legend: {
      labels: {
        fontSize: 30,
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontSize: 30
        }
      }],
      yAxes: [{
        ticks: {
          fontSize: 30
        }
      }]
    }
  };
  public barChartLabels = ['Site Admin', 'Trainer', 'Trainee', 'IRIS Learner', 'IRIS Admin']; 
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData = [{ data: [], label: 'Total', categoryPercentage: 1 },
  { data: [], label: 'Online', categoryPercentage: 1 }]
  ngOnInit() {
    this.isSuperAdmin = this.dataService.isSuperAdmin;
    this.isSiteAdmin = this.dataService.isSiteAdmin; 
    if(!this.isSuperAdmin){
       this.barChartLabels=['Site Admin', 'Trainer', 'Trainee']
    }    
    this.curruntTenantName = this.dataService.currentTenantName;
    if (this.curruntTenantName === this.tenantValue[1]) {
      this.router.navigate(['app/mod-sessions'])
    }
    this.initForm();
    this.currentUserType = this.dataService.currentUserType;
    if (this.isSuperAdmin) {
      this.dataService.isLoading = true;
      this.modService.getTenants().subscribe(res => {
        if (res.result) {
          this.tenantList = res.result;
          this.tenantList.sort(this.predicateBy("tenantName"));
        }
        this.selectedTenant = this.tenantList.length ? this.tenantList.find(x => x.id != undefined).id : 0;
        let tenantId = this.dataService.currentTenentId ? this.dataService.currentTenentId : this.selectedTenant;

        this.loadTenant(tenantId);
      });
      this.minDate = new Date();
    }
    if (this.currentUserType === UserRoles['8']) {
      this.dataService.isLoading = true;
      this.currentUserRole = this.dataService.currentUserRole;
      this.filters = {
        pageSize: 1000,
        pageNumber: 1,
        tenantId: this.dataService.currentTenentId,
        timeZone: this.getTimeZone(),
        sessionStatus: [SessionStatus.Requested, SessionStatus.Scheduled, SessionStatus.InProgress],
        sessionType: SessionType.Scheduled,
        startDate: "01/03/2020 05:00 PM",
        endDate: "11/03/2030 05:00 PM",
        platformUserId: this.dataService.currentPlatformUserId,
        readAll: false
      };

      this.modService.getAllSchedule(this.filters).pipe(
        finalize(() => {
          this.dataService.isLoading = this.dataService.doneLoading();
        })).subscribe(res => {
          let currentDate = new Date();
          let sessionList = res.result ? res.result.sessions : [];
          sessionList.map(s => (s.startDate = new Date(`${s.startDate}.000Z`), s.endDate = new Date(`${s.endDate}.000Z`)));
          sessionList = sessionList.sort((a, b) => +a.endDate - +b.endDate);
          sessionList.forEach(element => {
            let sessionDate = element.startDate;
            if (sessionDate.getFullYear() >= currentDate.getFullYear() && sessionDate.getMonth() >= currentDate.getMonth() && sessionDate.getDate() >= currentDate.getDate()) {
              if (sessionDate.getDate() == currentDate.getDate() && sessionDate.getMonth() == currentDate.getMonth() && sessionDate.getFullYear() == currentDate.getFullYear()) {
                let timeleft = (sessionDate.getTime() - currentDate.getTime()) / 1000;
                if (timeleft < 300) {
                  element.timeleft = Math.ceil(timeleft);
                  this.startTimer(timeleft);
                }
                this.todaySession.push(element);
              }
              else {
                this.upcomingSessions.push(element);
              }
            }
          });
        });
    }
    this.mentorPlatformId = this.dataService.currentPlatformUserId;
    if (this.mentorPlatformId) {
      this.getUserProfileDetail();
    }
    if (this.canBeMentor == true) {
      this.isMentorBlockFlag = true;
    }
    if (this.dataService.currentUserId) {
      this.trainerFeedback();
    }
    this.menteePlatformId = this.dataService.currentPlatformUserId;
    if (this.menteePlatformId) {
      this.getUserProfileDetail();
    }
    if (this.canBeMentee == true) {
      this.isMenteeBlockFlag = true;
    }
    if (this.dataService.currentUserId) {
      this.getTraineeFeedbackByTraineeId();
    }
    if (this.dataService.canBeMentor == true) {
      this.getTraineeFeedbackByTrainerId();
    }
    if (this.dataService.currentUserRole == "SiteAdmin") {
      this.getSiteAdminfeedback();
    }
    if (this.dataService.currentUserRole == "SUPERADMIN") {
      this.getSuperAdminFeedbackDetails();
    }
    this.loadTenant(this.dataService.tenantId);
  }

  loadTenant(tenantId: number) {
    //get users count for all roles and online users count for all roles
    if (this.selectedTenant != undefined) {
      this.loadtnt(this.selectedTenant);
    }
    else {
      this.loadtnt(tenantId);
    }
  }
  loadtnt(tenant) {
    this.dataService.isLoading = true;
    this.modService.GetUserDetailsForSelectedTenant(tenant).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })).subscribe(res => {
        if (res.result) {
          let usersList = res.result;
          this.selectedTenantUserRolesDetails = usersList.map(function (data) {
            return {
              "roleName": data.roleName,
              "roleId": data.roleId,
              "userCount": data.users.length,
              "onlineUsersCount": data.onlineUsersCount
            }
          });
          var chartdata = [];
          var chartdata1 = [];
          for (let i = 0; i < this.selectedTenantUserRolesDetails.length; i++) {
            chartdata.push(this.selectedTenantUserRolesDetails[i].userCount)
            chartdata1.push(this.selectedTenantUserRolesDetails[i].onlineUsersCount)
          }
          this.barChartData[0].data = chartdata;
          this.barChartData = [...this.barChartData];
          this.barChartData[1].data = chartdata1;
          this.barChartData = [...this.barChartData];
        }

      });
    this.modService.getUsersWithTrainerPermission(tenant).subscribe(res => {
      if (res.result) {
        this.mentors = res.result;
      }
    });
    this.modService.getTopTrainers(tenant).subscribe(res => {
      let topMentorsList = res.result ? res.result : [];
      this.dataSourceForFeedback = new MatTableDataSource<TopMentors>(topMentorsList.trainerRating);
      this.dataSource = new MatTableDataSource<TopMentors>(topMentorsList.topTrainers);
      if (this.dataSource.data.length) {
        this.showTopTrainers = true;
      }
      else
        this.showTopTrainers = false;
    });
    this.paginator.firstPage();
    this.dataSource.paginator = this.paginator;

  }

  getEngagementLevel() {
    if (this.mentorEngagementForm.value.startDate <= this.mentorEngagementForm.value.endDate) {
      this.dataSetForMentorEngagement = [];
      this.labelNameForMentorEngagement = [];
      this.mentorEngagementChartColors = [];
      this.data = {
        'StartDate': this.getFullDateTime(this.mentorEngagementForm.value.startDate, "start"),
        'EndDate': this.getFullDateTime(this.mentorEngagementForm.value.endDate, "end"),
        'MentorId': this.mentorEngagementForm.value.mentor
      }
      this.modService.GetMentorEngagement(this.data).subscribe(res => {
        let mentorEngagementList = res.result ? res.result : [];
        this.getdataForChart(mentorEngagementList, ReportType['1']);
      });
    }
    else {
      this.toastrService.warning("Please select valid Date");
    }
  }

  getTrendingSessions() {
    if (this.trendingSessionForm.value.startDate <= this.trendingSessionForm.value.endDate) {
      this.dataSetForTrendingSession = [];
      this.labelNameForTrendingSession = [];
      this.trendingSessionChartColors = [];
      this.trendingSession = {
        'StartDate': this.getFullDateTime(this.trendingSessionForm.value.startDate, "start"),
        'EndDate': this.getFullDateTime(this.trendingSessionForm.value.endDate, "end"),
        'TenantId': this.dataService.currentTenentId ? this.dataService.currentTenentId : this.selectedTenant,
      }
      this.modService.GetTrendingSession(this.trendingSession).subscribe(res => {
        let trendingSessionList = res.result ? res.result : [];
        this.getdataForChart(trendingSessionList, ReportType['2']);
      });
    }
    else {
      this.toastrService.warning("Please select valid Date");
    }
  }

  getdataForChart(result: any, type: string) {
    var labelId: any = [];
    var labelName: any = [];
    var dataSet: any = [];
    var showChart: boolean;
    var showNoReports: boolean;
    if (!result.length) {
      if (type == ReportType['1']) {
        this.showMentorEngagementChart = false;
        this.showNoReportsForMentorEngagement = true;
        if (this.mentorEngagementChart)
          this.mentorEngagementChart.destroy();
      }
      else {
        this.showTrendingSessionChart = false;
        this.showNoReportsForTrendingSession = true;
        if (this.trendingSessionChart)
          this.trendingSessionChart.destroy();
      }
    }
    else {
      showChart = true;
      showNoReports = false;
      result.forEach(element => {
        if (!labelId.includes(element.skillId)) {
          labelId.push(element.skillId);
          labelName.push(element.skillName);
        }
      });
      labelId.forEach(element => {
        let count = 0;
        result.forEach(innerelement => {
          if (innerelement.skillId === element) {
            count++;
          }
        });
        this.getRandomColor(type);
        dataSet.push(count);
      });
      if (type == ReportType['1']) {
        this.showMentorEngagementChart = showChart;
        this.showNoReportsForMentorEngagement = showNoReports;
        this.labelNameForMentorEngagement = labelName;
        this.dataSetForMentorEngagement = dataSet;
        this.showChartForEngagement(this.mentorEngagementChartType);
      }
      else {
        this.showTrendingSessionChart = showChart;
        this.showNoReportsForTrendingSession = showNoReports;
        this.labelNameForTrendingSession = labelName;
        this.dataSetForTrendingSession = dataSet;
        this.showChartForTrendingSession(this.trendingSessionChartType);
      }
    }
  }

  getFullDateTime(date: any, type: string) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    var time = new Date(date);
    if (type === "end") {
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(59);
    }
    return `${year}-${month}-${day} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  }
    showChartForEngagement(type: string) {
    if (this.mentorEngagementChart) {
      this.mentorEngagementChart.destroy();
    }
    this.mentorEngagementChartType = type;
    this.createChart(ReportType['1'], 'mentorEngagement', type, this.labelNameForMentorEngagement, this.dataSetForMentorEngagement, this.mentorEngagementChartColors, this.mentorEngagementForm.value.startDate, this.mentorEngagementForm.value.endDate)
  }

  showChartForTrendingSession(type: string) {
    if (this.trendingSessionChart) {
      this.trendingSessionChart.destroy();
    }
    this.trendingSessionChartType = type;
    this.createChart(ReportType['2'], 'trendingSession', type, this.labelNameForTrendingSession, this.dataSetForTrendingSession, this.trendingSessionChartColors, this.trendingSessionForm.value.startDate, this.trendingSessionForm.value.endDate)
  }

  showChartForMentorOnlineHours(type: string) {
    if (this.mentorOnlineHoursChart) {
      this.mentorOnlineHoursChart.destroy();
    }
    this.onlineHourChartType = type;
    this.createChart(ReportType['3'], ReportType[3], type, this.labelNameForOnlineHours, this.dataSetForOnlineHours, this.mentorOnlineHoursChartColors, this.mentorOnlineHoursForm.value.startDate, this.mentorOnlineHoursForm.value.endDate, this.dataSetForOnlineHoursInTimeFormat);
  }

  getMentorOnlineHours() {
    if (this.mentorOnlineHoursForm.value.startDate <= this.mentorOnlineHoursForm.value.endDate) {
      this.isPending = true;
      if (this.mentorOnlineHoursChart) {
        this.mentorOnlineHoursChart.destroy();
      }
      this.showNoReportsForOnlineHours = false;
      this.dataSetForOnlineHours = [];
      this.mentorOnlineHoursChartColors = [];
      this.dataSetForOnlineHoursInTimeFormat = [];
      let mentor = {
        'PlatformUserId': this.mentorOnlineHoursForm.value.mentor,
        'StartDate': this.getFullDateTime(this.mentorOnlineHoursForm.value.startDate, "start"),
        'EndDate': this.getFullDateTime(this.mentorOnlineHoursForm.value.endDate, "end")
      };
      this.modService.getMentorOnlineHours(mentor).subscribe(res => {
        let onlineHours = res.result ? res.result : [];
        let sum = 0;
        onlineHours.data.forEach(element => {
          if (element < 60)
            element = 0;
          this.getRandomColor(ReportType['3']);
          let hours: any = Math.floor(element / 3600);
          let minutes: any = Math.floor((element % 3600) / 60);
          hours = hours <= 9 ? `0${hours}` : hours;
          minutes = minutes <= 9 ? `0${minutes}` : minutes;
          let timeData = `${hours}.${minutes}`;
          this.dataSetForOnlineHoursInTimeFormat.push(timeData);
          minutes = minutes * 1.67;
          timeData = `${hours}.${minutes.toFixed(0)}`;
          this.dataSetForOnlineHours.push(timeData);
          sum += element;
        });
        this.labelNameForOnlineHours = onlineHours.labels;
        if (!onlineHours.labels.length || !sum) {
          this.showNoReportsForOnlineHours = true;
          this.showMentorOnlineHoursChart = false;
          this.isPending = false;
        }
        else {
          this.showMentorOnlineHoursChart = true;
          this.showChartForMentorOnlineHours(this.onlineHourChartType);
        }
      });
    }
    else {
      this.toastrService.warning("Please select valid date");
    }
  }

  getRandomColor(type: string) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    if (type === ReportType['1']) {
      if (this.mentorEngagementChartColors.includes(color)) {
        this.getRandomColor(type);
        return;
      }
      this.mentorEngagementChartColors.push(color);
    }
    else if (type === ReportType['2']) {
      if (this.trendingSessionChartColors.includes(color)) {
        this.getRandomColor(type);
        return;
      }
      this.trendingSessionChartColors.push(color);
    }
    else if (type === ReportType['3']) {
      if (this.mentorOnlineHoursChartColors.includes(color)) {
        this.getRandomColor(type);
        return;
      }
      this.mentorOnlineHoursChartColors.push(color);
    }
  }

  createChart(chartType: string, chartId: string, type: string, label: string[], data: any[], colors: string[], startDate: Date, endDate: Date, ToolTipData?: any[]) {
    var chart = new Chart(chartId, {
      type: type,
      data: {
        labels: label,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            fill: false
          },
        ],
      },
      options: {
        plugins: {
          display: true,
          labels: type === ChartType[1] ? [{
            render: 'percentage',
            fontSize: 20,
            fontStyle: 'bold',
            fontColor: '#000',
          },
          {
            render: function (args) {
              return `${args.label}`;
            },
            position: 'outside',
            fontSize: 15,
            fontStyle: 'bold',
            fontColor: colors,
          }] : {
            render: function (args) {
              if (chartId === ReportType[3]) {
                if (parseFloat(args.value) <= 0)
                  return;
                else {
                  let minutes = (ToolTipData[args.index]).split(".")[1];
                  let hours = Math.floor(ToolTipData[args.index]);
                  return hours ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;
                }
              }
              else
                return `${args.value}`
            },
            position: 'outside',
            fontSize: 15,
            fontStyle: 'bold',
            fontColor: colors,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              if (chartId === ReportType[3]) {
                let minutes = (ToolTipData[tooltipItem.index]).split(".")[1];
                let hours = Math.floor(ToolTipData[tooltipItem.index]);
                if (type === ChartType[1]) {
                  return hours ? `${data['labels'][tooltipItem.index]} - ${hours} hrs ${minutes} mins` : `${data['labels'][tooltipItem.index]} - ${minutes} mins`;
                }
                else
                  return hours ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;
              }
              else if (type === ChartType[1])
                return `${data['labels'][tooltipItem.index]}:${data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem.index]}`;
              else
                return `${data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem.index]}`
            }
          }
        },
        legend: {
          display: type === ChartType[1] ? true : false,
          position: "right",
          onClick: null,
        },
        layout: {
          padding: {
            bottom: 25
          }
        },
        title: {
          display: true,
          position: "top",
          text: `${chartType.replace(/([A-Z])/g, ' $1')} [ "${this.dateFormat(startDate)}-${this.dateFormat(endDate)}" ]`,
          fontSize: 20,
          padding: 17
        },
        scales: {
          xAxes: [{
            display: type === ChartType[1] ? false : true,
            scaleLabel: {
              display: true,
              labelString: chartId == ReportType[3] ? 'Period' : 'Skills',
              fontSize: 15
            }
          }],
          yAxes: [{
            display: type === ChartType[1] ? false : true,
            ticks: {
              beginAtZero: true,
              precision: 0
            },
            scaleLabel: {
              display: true,
              labelString: chartId === ReportType[3] ? 'Hours' : 'No of Sessions',
              fontSize: 15
            }
          }]
        }
      }
    });
    if (chartType == ReportType['1']) {
      if (this.mentorEngagementChart) {
        this.mentorEngagementChart.destroy();
      }
      this.mentorEngagementChart = chart;
    }
    if (chartType == ReportType['2']) {
      if (this.trendingSessionChart) {
        this.trendingSessionChart.destroy();
      }
      this.trendingSessionChart = chart;
    }
    if (chartType == ReportType['3']) {
      if (this.mentorOnlineHoursChart) {
        this.mentorOnlineHoursChart.destroy();
      }
      this.mentorOnlineHoursChart = chart;
      this.isPending = false;    
    }
  }

  dateFormat(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;    
  }

  loadUpcomingSessions() {
    this.displayIndex += 3;
    this.displayUpcomingSessions = this.upcomingSessions.slice(0, this.displayIndex);
  }

  startTimer(duration) {
    let timer: number = duration;
    let interval = setInterval(() => {
      let minutes: any = parseInt((timer / 60).toString());
      let seconds: any = parseInt((timer % 60).toString());
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      this.showtimer = `${minutes}:${seconds}`;
      if (--timer < 0) {
        this.showtimer = '';
        this.showJoin = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  onMonthSelect(type: string, normalizedMonth, datepicker: MatDatepicker<Moment>) {
    if (type == 'start') {
      this.mentorOnlineHoursForm.value.startDate = new Date(normalizedMonth);
    }
    else if (type == 'end') {
      this.mentorOnlineHoursForm.value.endDate = new Date(normalizedMonth);
      if (normalizedMonth.getFullYear() === this.minDate.getFullYear() && normalizedMonth.getMonth() === this.minDate.getMonth()) {
        normalizedMonth.setDate(this.minDate.getDate());
        this.mentorOnlineHoursForm.value.endDate = new Date(normalizedMonth);
      }
      else {
        var totalDaysInTheMonth = new Date(this.mentorOnlineHoursForm.value.endDate.getFullYear(), this.mentorOnlineHoursForm.value.endDate.getMonth() + 1, 0).getDate();
        this.mentorOnlineHoursForm.value.endDate.setDate(totalDaysInTheMonth);
      }
    }
    this.mentorOnlineHoursForm.setValue({
      mentor: this.mentorOnlineHoursForm.value.mentor,
      startDate: this.mentorOnlineHoursForm.value.startDate,
      endDate: this.mentorOnlineHoursForm.value.endDate
    });
    datepicker.close();
  }

  closeChart(reportType: string) {
    if (reportType == ReportType[1]) {
      this.showMentorEngagementChart = false;
      this.showNoReportsForMentorEngagement = false;
      this.mentorEngagementForm.reset();
    }
    else if (reportType == ReportType[2]) {
      this.showTrendingSessionChart = false;
      this.showNoReportsForTrendingSession = false;
      this.trendingSessionForm.reset();
    }
    else {
      this.showMentorOnlineHoursChart = false;
      this.showNoReportsForOnlineHours = false;
      this.mentorOnlineHoursForm.reset();
    }
  }

  refresh() {
    this.mentorEngagementForm.reset();
    this.trendingSessionForm.reset();
    this.mentorOnlineHoursForm.reset();

    this.showMentorEngagementChart = false;
    this.showMentorOnlineHoursChart = false;
    this.showTrendingSessionChart = false;

    this.showNoReportsForMentorEngagement = false;
    this.showNoReportsForTrendingSession = false;
    this.showNoReportsForOnlineHours = false;
    this.dataService.isLoading = true;
    this.onlineMentors = this.onlineMentees = 0;
    this.loadTenant(this.selectedTenant);
    this.getSuperAdminFeedbackDetails();
  }

  initForm(): void {
    this.mentorEngagementForm = this.formBuilder.group({
      mentor: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
    this.trendingSessionForm = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
    this.mentorOnlineHoursForm = this.formBuilder.group({
      mentor: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  predicateBy(value: string) {
    return function (a, b) {
      if (a[value].toLocaleLowerCase() > b[value].toLocaleLowerCase()) {
        return 1;
      } else if (a[value].toLocaleLowerCase() < b[value].toLocaleLowerCase()) {
        return -1;
      }
      return 0;
    }
  }

  getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }
  trainerFeedback(): void {
    this.modService.trainerFeedback(this.dataService.currentPlatformUserId).subscribe(res => {
      this.allFeedback = res.result;
      this.dataSourceFeedback = new MatTableDataSource<feedbackDetails>(this.allFeedback);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageSize = 5;
    });
  }
  // fetching trainee detail based on traineeUserId
  getTraineeFeedbackByTraineeId(): void {
    this.modService.getTraineeFeedbackByTraineeId(this.dataService.currentPlatformUserId).subscribe(res => {
      this.allFeedback = res.result;
      this.dataSourceFeedback = new MatTableDataSource<feedbackDetails>(this.allFeedback);
      this.paginator.firstPage();
      this.dataSourceFeedback.paginator = this.paginator;
    });
  }
  // fetching trainer feedback based on trainerUserId
  getTraineeFeedbackByTrainerId(): void {
    this.modService.getTraineeFeedbackByTrainerId(this.dataService.currentPlatformUserId).subscribe(res => {
      this.allFeedback = res.result;
      this.dataSourceFeedback = new MatTableDataSource<feedbackDetails>(this.allFeedback);
      this.paginator.firstPage();
      this.dataSourceFeedback.paginator = this.paginator;
    });
  }
  // fetching trainer and trainee feedback for siteadmin
  getSiteAdminfeedback() {
    this.modService.getSiteAdminFeedback().subscribe(res => {
      this.allFeedback = res.result;
      this.dataSourceFeedback = new MatTableDataSource<feedbackDetails>(this.allFeedback);
      this.paginator.firstPage();
      this.dataSourceFeedback.paginator = this.paginator;

    });
  }
  // fetching trainer and trainee feedback based on tenantId
  getSuperAdminFeedbackDetails() {
    this.tenantId = this.dataService.currentTenentId ? this.dataService.currentTenentId : this.selectedTenant;
    this.modService.GetSuperAdminFeedbackDetails(this.selectedTenant).subscribe(res => {
      this.allFeedback = res.result;
      this.dataSourceFeedback = new MatTableDataSource(this.allFeedback);
      this.paginator.firstPage();
      this.dataSourceFeedback.paginator = this.paginator;
    });
  }
  getUserProfileDetail() {
    this.modService.getUserDetails(this.menteePlatformId).subscribe(res => {
      if (res.result) {
        this.canBeMentee = res.result.canBeMentee;
      }
    }, err => {
    });
  }
  editFeedback() {
    this.dataService.selectedTenant = this.selectedTenant;
    this.router.navigate(["/app/feedback"]);
  }  
  usersbarchart() {
    this.isusersbarchart = true;
  } 
  trendingSessionschart() {
    this.isTrendingsessionschart = true;
  }  
  trainerEngagementchart() {
    this.isTrainerengagementchart = true;
  } 
  trainerOnlineHourschart() {
    this.istrainerOnlineHourschart = true;
  }  
  toptrainer() {
    this.isTopTrainer = true;
  }
  
  trainerfeedback() {
    this.isTrainerfeedback = true;
  } 

  // To press back button  to retun back Dashboard
  return(type) {

    if (type == 'totalandonlineusers') {
      this.isusersbarchart = !this.isusersbarchart;
    }
    if (type == 'trendingsession') {
      this.isTrendingsessionschart = !this.isTrendingsessionschart;
      this.showTrendingSessionChart = false;
      this.showNoReportsForTrendingSession = false;
      this.trendingSessionForm.reset();
    }
    if (type == 'trainerfeedback') {
      this.isTrainerfeedback = !this.isTrainerfeedback;
    }
    if (type == 'traineronlinehours') {
      this.istrainerOnlineHourschart = !this.istrainerOnlineHourschart;
      this.showMentorOnlineHoursChart = false;
      this.showNoReportsForOnlineHours = false;
      this.mentorOnlineHoursForm.reset();
    }
    if (type == 'toptrainers') {
      this.isTopTrainer = !this.isTopTrainer;
    }
    if (type == 'totalengagement') {
      this.isTrainerengagementchart = !this.isTrainerengagementchart;
      this.showMentorEngagementChart = false;
      this.showNoReportsForMentorEngagement = false;
      this.mentorEngagementForm.reset();
    }

  }
}