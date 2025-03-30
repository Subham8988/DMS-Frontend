import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserActionService } from 'src/app/services/_dms.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  constructor(private toastrService: ToastrService, private service: UserActionService,private fb: FormBuilder, private http: HttpClient,private router: Router) {
    this.searchForm = this.fb.group({
      filters: this.fb.array([]),
      generalSearch: ['']
    });
    this.gridSearchForm = this.fb.group({
      filters: this.fb.array([]),
      generalSearch: ['']
    });
   }

  test: Date = new Date();



  allDocuments:any = [];
  dropdownSettings = {};
  selectedOCR: any;
  keyValuePairsArray: { key: string; value: string }[] = [];
  selectedFile: File | null = null;
  fileError: string = '';
  searchForm!: FormGroup;
  documents: any[] = [];
  gridSearchForm: FormGroup;
  searchResults: any[] = [];


  


  async ngOnInit() {
    this.addFilter();

    await this.generateToken();
    await this.getAllDoc();
  }

  async generateToken() {
    var payload: any = {
      "projectId": "12345",
      "projectKey": "abcdef123456"
    }
    let res = await this.service.tokenGenration(payload);
    if (res) {
      localStorage.setItem('token', res?.token);
    }
  }

  async getAllDoc() {

    let res = await this.service.getAllDoc();
    if (res.status == 200) {
      this.allDocuments = res.data;
    }
  }

  openModal(ocrData: any) {
    if (ocrData) {
      this.selectedOCR = ocrData;
      this.keyValuePairsArray = Object.keys(ocrData.keyValuePairs || {}).map(key => ({
        key: key,
        value: ocrData.keyValuePairs[key]
      }));
  
      // Open Bootstrap Modal
      const modal = document.getElementById('ocrModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open'); // Prevent background scroll
      }
    }
  }
  
  closeModal() {
    const modal = document.getElementById('ocrModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open'); // Restore background scroll
    }
  }
  openUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedFile = null;
    this.fileError = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.fileError = 'Please select a file';
      return;
    }

    // if (file.type !== 'application/pdf') {
    //   this.fileError = 'Only PDF files are allowed!';
    //   this.selectedFile = null;
    //   return;
    // }

    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'File size should be less than 5MB';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.fileError = '';
  }

  async uploadFile() {
    if (!this.selectedFile) {
      alert('No file selected!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authorization token not found!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
  let res=await this.service.uploadDoc(formData,token);
  this.closeUploadModal();

  }

  get filters() {
    return this.searchForm.get('filters') as FormArray;
  }

  addFilter() {
    this.filters.push(this.fb.group({ key: '', value: '' }));
  }

  removeFilter(index: number) {
    this.filters.removeAt(index);
  }

  searchDocuments() {
    const filters: any = {};
    this.filters.controls.forEach((control: any) => {
      if (control.value.key && control.value.value) {
        filters[control.value.key] = control.value.value;
      }
    });

    const payload = { filters };
    this.http.post('http://34.122.150.214:5000/dms/v1/serachDocOcr', payload)
      .subscribe((res: any) => {
        this.documents = res.data || [];
      }, error => {
        console.error('Search Error:', error);
      });
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  clearSearch() {
    this.searchForm.reset(); // Reset the form
    this.filters.clear(); // Clear all filters
  }

  get gridFilters() {
    return this.gridSearchForm.get('filters') as FormArray;
  }

  // Add filter row dynamically
  addGridFilter() {
    this.gridFilters.push(this.fb.group({ key: '', value: '' }));
  }

  // Remove a specific filter row
  removeGridFilter(index: number) {
    this.gridFilters.removeAt(index);
  }

  // Clear search fields
  clearGridSearch() {
    this.gridSearchForm.reset();
    this.gridFilters.clear();
    this.searchResults = [];
  }

  // Search function
  searchGrid() {
    const filters = this.gridSearchForm.value.filters.reduce((acc: any, filter: any) => {
      if (filter.key && filter.value) {
        acc[filter.key] = filter.value;
      }
      return acc;
    }, {});

    const requestData = { filters };

    this.http.post('http://34.122.150.214:5000/dms/v1/searchDoc', requestData).subscribe((response: any) => {
      if (response.success) {
        this.searchResults = response.data;
      } else {
        this.searchResults = [];
      }
    });
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/Admin/Login']);
  }
  
  

  

}
