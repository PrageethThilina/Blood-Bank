import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../shared/hospital.model';
import { HospitalService } from '../../shared/hospital.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-hospital-header',
  templateUrl: './hospital-header.component.html',
  styleUrls: ['./hospital-header.component.scss']
})
export class HospitalHeaderComponent implements OnInit {

  hospitalDetails;
 
  constructor(private hospitalService: HospitalService, private router: Router) { }

  ngOnInit(): void {
    this.hospitalService.getUserProfile().subscribe(
      res => {
        this.hospitalDetails = res['hospital'];
      },
      err => { 
        console.log(err);
        
      }
    );
  }

  onEdit(hospital: Hospital) {
    this.hospitalService.selectedUser = hospital;
    setTimeout(() => this.router.navigateByUrl('/hospital-order-blood'));
  }
 
  onLogout(){
    this.hospitalService.deleteToken();
    this.router.navigate(['/hospital-login']);
  }

}
