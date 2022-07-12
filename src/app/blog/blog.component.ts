import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteBlogComponent } from "../dialog/delete-blog/delete-blog.component";
import { ModService } from '@app/service';
import { dataService } from '@app/service/common/dataService';
import { Router } from '@angular/router';
import { NewBlogTopicComponent } from './new-topic/new-topic.component';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { UserRoles } from '@app/enums/user-roles';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {
  isGlobalSearch:string;
  searchInput:string;
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  rolePermissions: any[] = [];
  Code: string = "BLOGS";
  blogs: any;
  searchBlog: string;
  filterblogs: any = [];
  popularBlogs: any = [];
  currentUserType = this.dataService.currentUserType;
  userRoles = UserRoles;
  filterblogsDataSource: MatTableDataSource<any>;
  filterblogsObservable: Observable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private modService: ModService,
    private dataService: dataService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    //for global search
    this.route.queryParams.subscribe(params => {
      this.isGlobalSearch = params['globalSearch'];
      this.searchInput=params['name'];
    });
    if(this.isGlobalSearch=="true"&& this.searchInput!=="Blogs")
    {
      this.loadGlobalBlogs();
    }
    else{
      this.getAllBlogs();
    }
    this.dataService.pageName = "Blogs";
    this.getAllBlogs();
    this.getPermissions();
  }

  deleteBlog(blog: any): void {
    if (this.deletePermission) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '40vw';
      const dialogRef = this.dialog.open(DeleteBlogComponent, dialogConfig);
      dialogRef.componentInstance.blogId = blog.id;
      dialogRef.componentInstance.blogName = blog.topic;
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.getAllBlogs();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to delete an article");
    }
  }

  editBlog(blog: any) {
    if (this.updatePermission) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '80vw';
      const dialogRef = this.dialog.open(NewBlogTopicComponent, dialogConfig);
      dialogRef.componentInstance.blog = blog;
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.getAllBlogs();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to update an article");
    }
  }

  getPermissions() {
    if (this.dataService.currentUserRole === UserRoles[1]) {
      this.createPermission = this.updatePermission = this.deletePermission = true;
    }
    else {
      this.rolePermissions = this.dataService.rolePermissions;
      let permissions = this.rolePermissions.find(val => val.feature.featureCode === this.Code);
      if (permissions) {
        this.createPermission = permissions.create;
        this.updatePermission = permissions.update;
        this.deletePermission = permissions.delete;
      }
      else {
        this.createPermission = this.updatePermission = this.deletePermission = false;
      }
    }
  }

  readMore(blogId: string) {
    let blog = btoa(blogId);
    this.router.navigate(['/app/blogs-topic', blog]);
  }

  applyFilter(filterValue: string) {
    this.filterblogs = this.blogs.filter((data) => data.topic.toLowerCase().includes(filterValue.trim().toLowerCase()) || data.tags.toLowerCase().includes(filterValue.trim().toLowerCase()));
    if (!this.blogs.length && filterValue.length) {
      this.filterblogs = this.blogs;
    }
    this.filterblogsDataSource = new MatTableDataSource<any>(this.filterblogs);
    this.filterblogsDataSource.paginator = this.paginator;
    this.filterblogsObservable = this.filterblogsDataSource.connect();
  }

  getAllBlogs() {
    this.dataService.isLoading = true;
    this.modService.getAllBlogs().subscribe(res => {
      this.blogs = res.result ? res.result : [];
      this.filterblogs = this.blogs;
      this.popularBlogs = [];
      this.blogs.forEach(blog => {
        this.popularBlogs.push(blog);
      });
      this.popularBlogs.sort(this.predicateBy("upVoteCount"));
      this.popularBlogs = this.popularBlogs.slice(0, 5);
      this.dataService.isLoading = this.dataService.doneLoading();
      this.filterblogsDataSource = new MatTableDataSource<any>(this.filterblogs);
      this.filterblogsDataSource.paginator = this.paginator;
      this.paginator.firstPage();
      this.filterblogsObservable = this.filterblogsDataSource.connect();
    });
  }

  predicateBy(value) {
    return function (a, b) {
      if (a[value] < b[value]) {
        return 1;
      } else if (a[value] > b[value]) {
        return -1;
      }
      return 0;
    }
  }

  newArticle() {
    if (this.createPermission) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '80vw';
      const dialogRef = this.dialog.open(NewBlogTopicComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.getAllBlogs();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to create a new article");
    }
  }

  //for global search
  loadGlobalBlogs(){
    this.dataService.isLoading = true;
    this.modService.getGlobalBlog(this.searchInput).subscribe(res => {
      this.blogs = res.result ? res.result : [];
      this.filterblogs = this.blogs;
      this.dataService.isLoading = this.dataService.doneLoading();
      this.filterblogsDataSource = new MatTableDataSource<any>(this.filterblogs);
      this.filterblogsDataSource.paginator = this.paginator;
      this.paginator.firstPage();
      this.filterblogsObservable = this.filterblogsDataSource.connect();
    });
  }
}
