import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { dataService } from '@app/service/common/dataService';

@Component({
    templateUrl: './home.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./home.component.css'],

})
export class HomeComponent extends AppComponentBase implements AfterViewInit {
    max: any;
    courseId: any;
    courses: any = [];
    enrolmentId: any;
    courseList: any = [];
    selectedCourse: any = 0;
    totalWatchedTime: any;
    courseDetails: any = {};
    allCourseDetails: any = [];
    totalDuration: any;
    totalTimeDuration: any;
    enrolmentDetails: any;
    courseProgress = 0;
    assessmentProgress = 0;
    labProgress = 0;
    progressJson: any = {};
    isLoading: boolean;

    constructor(
        injector: Injector,
        private dataService: dataService
    ) {
        super(injector);
    }


    ngAfterViewInit(): void {

        $(function () {
            // Widgets count
            $('.count-to').countTo();

            // Sales count to
            $('.sales-count-to').countTo({
                formatter: function (value) {
                    return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ' ').replace('.', ',');
                }
            });
        });
    }

    ngOnInit() {
        this.dataService.pageName = 'Dashboard';
        this.dataService.isLoading = false;
    }    
}
