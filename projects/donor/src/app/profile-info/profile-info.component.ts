import { Component } from '@angular/core';
import { HeaderWithBackComponent } from '../sharedComponent/header-with-back/header-with-back.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  Storage,
} from '@angular/fire/storage';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DataProviderService } from '../auth/service/data-provider.service';
import { ProfileInfoService } from './service/profile-info.service';
import { Auth } from '@angular/fire/auth';
import { SaveBtnComponent } from '../../../../shared-ui/src/save-btn/save-btn.component';
import { AuthService } from '../auth/service/auth.service';
@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [HeaderWithBackComponent, ReactiveFormsModule,SaveBtnComponent],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent {
  constructor(
    private storage: Storage,
    private firestore: Firestore,
    private Router: Router,
    private dataProvider: DataProviderService,
    private ProfileInfoService: ProfileInfoService,
    private Auth: Auth,
    private AuthService:AuthService
  ) {}

  userForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    gender: new FormControl('male', Validators.required),
    dob: new FormControl('', Validators.required),
    active: new FormControl(true),
    photoURL: new FormControl('assets/login/loginPageLogo.svg'),
    age: new FormControl(''),
    uid: new FormControl(''),
    phoneNumber: new FormControl(''),
  });
  isImgSizeValid: boolean = false;

  openDatePicker() {
    const dateInput = document.getElementById('startDate') as HTMLInputElement;
    dateInput.focus();
    dateInput.click();
  }

  ngOnInit() {
    console.log(this.dataProvider.currentUser);
  }

  async changePhoto(e: any) {
    const file = e.target.files[0];
    const fileSizeKB = file.size / 1024;
    const maxSizeKB = 500;

    if (fileSizeKB > maxSizeKB) {
      this.isImgSizeValid = true;
      return;
    } else {
      this.isImgSizeValid = false;

      const date = new Date();
      const timestamp = date.getTime();
      const fileName = `${timestamp}.${file.name.split('.').pop()}`;

      const filePath = `donorProfile/${fileName}`;
      await uploadBytesResumable(ref(this.storage, filePath), file);
      const fileUrl = await getDownloadURL(ref(this.storage, filePath));
      this.userForm.patchValue({
        photoURL: fileUrl,
      });
    }
  }
  removePhoto() {
    this.userForm.value.img = 'assets/add-user/dummyProfile.jpg';
  }
  cancel() {
    this.Router.navigate(['login']);
  }
  submit() {
    if (this.userForm.valid) {
      console.log(this.dataProvider.currentUser);
      this.userForm.value.uid = this.dataProvider.currentUser?.user.uid;
      this.userForm.value.phoneNumber =
        this.dataProvider.currentUser?.userData.phoneNumber;
      this.userForm.value.age =
        new Date().getFullYear() -
        new Date(this.userForm.value.dob).getFullYear();
      this.userForm.value.dob = new Date(this.userForm.value.dob).toISOString();
      this.ProfileInfoService.updateProfileInfo(this.userForm.value).then(
        () => {
          this.Router.navigate(['add-address']);
        }
      );
    }
  }
}
