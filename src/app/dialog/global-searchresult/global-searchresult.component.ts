import { Component, OnInit,ViewChild,Inject} from '@angular/core';
import { ModService } from '@app/service/api/mod.service';
import { dataService } from '@app/service/common/dataService';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-global-searchresult',
  templateUrl: './global-searchresult.component.html',
  styleUrls: ['./global-searchresult.component.css']
})
export class GlobalSearchresultComponent implements OnInit {
  navigateURL:string;
  currentPageUrl:string;
  isGlobalTextSearched:boolean;
  searchText:string;
  currentTenantId: number;
  sessionStatus:string;
  globalSearchList: any[] = [];
  globalSearchResultList: any[] = [];
  globalSearch: MatTableDataSource<any>;
  @ViewChild('globalSearchSort') globalSearchSort: MatSort;
  @ViewChild('globalSearchPagination') globalSearchPagination: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA)  data,private modService: ModService,
    private dataService: dataService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<GlobalSearchresultComponent>, private route: ActivatedRoute,private router : Router,) {
    this.searchText=data.searchString;
   }

  ngOnInit() {
  this.getFullTextSearchData();
  }
  getFullTextSearchData():void{
    this.isGlobalTextSearched=true;
    this.modService.getFullTextSearch(this.searchText).pipe(
      finalize(() => {
        this.dataService.isLoading = this.dataService.doneLoading();
      })
    ).subscribe(res => {
      if (res.result) {
        this.globalSearchList = [];
        this.globalSearchList = res.result;
      }
    }, err => {
      this.toastr.error("Please try again later");
    });
    console.log(this.globalSearchList);
  }
//event to be triggered
navigateToEntity(data) {
  this.navigateURL=data.target.name;
  this.sessionStatus=data.target.id;
  this.dialogRef.close();
  if(this.sessionStatus==="UpcomingSession"||this.sessionStatus==="CompletedSession"){
    this.router.navigate([this.navigateURL], { queryParams: {globalSearch:'true',name:this.searchText ,status:this.sessionStatus } });
  }
  else{
  this.router.navigate([this.navigateURL], { queryParams: {globalSearch:'true',name:this.searchText } });
  }
}
}
