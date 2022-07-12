import { Component, OnInit } from '@angular/core';
import { dataService } from '@app/service/common/dataService';
import { ModService } from '@app/service';
import { MatTableDataSource } from '@angular/material';
import { DocumentFileType } from '@app/enums/document-type';

export interface PreviewDocs {
  document: string;
  documentName: number;
  type: string;
}

@Component({
  selector: 'app-view-assignment-document',
  templateUrl: './view-assignment-document.component.html',
  styleUrls: ['./view-assignment-document.component.css']
})

export class ViewAssignmentDocumentComponent implements OnInit {
  assignment: any;
  documentType: string;
  emptyMessage: string;
  showPreviewDocuments: boolean;
  isDocumentsAvailble: any;
  previewAssignmentTitle: any;
  previewDocumentsdatasource: MatTableDataSource<PreviewDocs>[];
  previewColumns: string[] = ['Documents Name', 'Type', 'Download'];

  constructor(private dataService : dataService,
    private modService : ModService) { }

  ngOnInit() {
    this.showPreviewDocuments = true;
    this.previewAssignmentTitle = this.assignment.title;
    this.previewDocumentsdatasource = this.assignment.documents.filter(obj => obj.type === this.documentType);
    this.isDocumentsAvailble = this.previewDocumentsdatasource.length;
    this.emptyMessage = this.documentType === DocumentType[1] ? "No Documents" : "No Resources";
    this.previewDocumentsdatasource = this.previewDocumentsdatasource;
  }

  download(url: string) {
    let downloadURL: any = [];
    downloadURL.push(url);
    let blobDetails = {
      "blobURLs": downloadURL,
      "assignmentId": this.assignment.id
    }
    this.modService.getDownloadURL(blobDetails).subscribe(res => {
      if (res.result) {
        window.location.href = res.result;
      }
    });
  }
}