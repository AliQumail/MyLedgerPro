import { Component, EventEmitter, Output } from '@angular/core';
import { faFilePdf, faFileExcel, faFileCsv, faDownload } from '@fortawesome/free-solid-svg-icons';

export type DownloadFormat = 'pdf' | 'excel' | 'csv';

@Component({
  selector: 'app-download-dropdown',
  templateUrl: './download-dropdown.component.html',
  styleUrls: ['./download-dropdown.component.css']
})
export class DownloadDropdownComponent {
  @Output() download: EventEmitter<DownloadFormat> = new EventEmitter();

  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faFileCsv = faFileCsv;
  faDownload = faDownload;

  choose(format: DownloadFormat) {
    this.download.emit(format);
  }
}
