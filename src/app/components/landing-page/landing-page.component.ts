import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserActionService } from 'src/app/services/user-action.service';
import { generate } from 'rxjs';
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
  userListArray: any;
  roleListArray: any;
  permissionListArray: any;
  p: number = 1;

  dropdownList = [];
  selectedItems = [];


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


  

  userData!: FormGroup;
  roleData!: FormGroup;
  permissonData!: FormGroup;

  async ngOnInit() {
    this.addFilter();

    await this.generateToken();
    await this.getAllDoc();

    this.userData = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      mobile_no: new FormControl('', Validators.pattern("^((?!(0))[0-9]{10})?(?:,((?!(0))[0-9]{10}))*$")),
      Status: new FormControl('true')
    });
    this.roleData = new FormGroup({
      role_Name: new FormControl(''),
      role_Status: new FormControl('true')
    });
    this.permissonData = new FormGroup({
      permission_Name: new FormControl(''),
      permission_Status: new FormControl('true')
    })

    // this.userlists();
    // this.roleLists();
    // this.permissonslist();



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

    if (file.type !== 'application/pdf') {
      this.fileError = 'Only PDF files are allowed!';
      this.selectedFile = null;
      return;
    }

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
    this.http.post('http://35.193.158.197:5000/dms/v1/serachDocOcr', payload)
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

    this.http.post('http://35.193.158.197:5000/dms/v1/searchDoc', requestData).subscribe((response: any) => {
      if (response.success) {
        this.searchResults = response.data;
      } else {
        this.searchResults = [];
      }
    });
  }

  logout() {
    // Clear session storage & local storage
    sessionStorage.clear();
    localStorage.clear();

    // Redirect to login page
    this.router.navigate(['/Admin/Login']);
  }
  
  

  

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }


  //getter seeter
  get mobile_no() {
    return this.userData.get('mobile_no');
  }



  // use list
  async userlists() {
    let res = await this.service.allUserList();
    if (res.status == 200) {
      this.userListArray = res.result;
    }
    else { this.toastrService.error('Message please enter email!', ' Error!'); }
  }

  //role lists
  async roleLists() {
    let res = await this.service.roleList();
    if (res.status == 200) {
      this.roleListArray = res.result;
    }
    else { this.toastrService.error('Message!', res.msg); }

  }

  //permission list
  async permissonslist() {
    let res = await this.service.permissionList();
    if (res.status == 200) {
      this.permissionListArray = res.data;
    }
    else { this.toastrService.error('Message!', res.msg); }
  }

  //create user
  async createUser() {
    const payload = this.userData.value;
    if (payload['name'] != '' && payload['name'] != null && payload['name'] != undefined) {
      if (payload['mobile_no'] != '' && payload['mobile_no'] != null && payload['mobile_no'] != undefined) {
        if (payload['email'] != '' && payload['email'] != null && payload['email'] != undefined) {
          let res = await this.service.createUser(payload);
          if (res.status == 201) {
            this.toastrService.success('Succes', res.msg);
            document.getElementById('close_modal')?.click();
            this.userlists();
          }
          else { this.toastrService.error('Error!', res.msg); }
        }
        else { this.toastrService.error('Message please enter email!'); }
      }
      else { this.toastrService.error('Message please enter mobile no!'); }
    }
    else { this.toastrService.error('Message please enter name!'); }
  }

  // create role
  async createRole() {
    const payload = this.roleData.value;
    if (payload['role_Name'] != '' && payload['role_Name'] != null && payload['role_Name'] != undefined) {
      let res = await this.service.createRole(payload);
      if (res.status == 200) {

        this.toastrService.success('Succes', res.msg);
        document.getElementById('close_modal_role')?.click();
        this.roleLists();
      }
      else { this.toastrService.error('Error!', res.msg); }

    }
    else { this.toastrService.error('Message please enter role name!'); }
  }

  // create Permissons
  async createPermisons() {
    const payload = this.permissonData.value;
    if (payload['permission_Name'] != '' && payload['permission_Name'] != null && payload['permission_Name'] != undefined) {
      let res = await this.service.createPermission(payload);
      if (res.status == 201) {
        this.toastrService.success('Succes', res.msg);
        document.getElementById('close_modal_p')?.click();
        this.permissonslist();
      }
      else { this.toastrService.error('Error!', res.msg); }

    }
    else { this.toastrService.error('Message please enter permission_Name name!'); }
  }


  // delete user
  async delteUser(user_id: any) {
    let res = await this.service.delteUser(user_id);
    if (res.status == 200) {
      this.toastrService.success('Succes', res.msg);
      this.userlists();
    } else { this.toastrService.error('Error!', res.msg); }
  }

}
