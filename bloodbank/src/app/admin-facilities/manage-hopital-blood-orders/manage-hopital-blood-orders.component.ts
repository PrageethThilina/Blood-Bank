import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";


import { HospitalBloodRequest } from '../../shared/hospital-blood-request.model';
import { HospitalBloodRequestService } from '../../shared/hospital-blood-request.service'

declare const toggleSidebar : any;

@Component({
  selector: 'app-manage-hopital-blood-orders',
  templateUrl: './manage-hopital-blood-orders.component.html',
  styleUrls: ['./manage-hopital-blood-orders.component.scss']
})
export class ManageHopitalBloodOrdersComponent implements OnInit {


    showSucessMessage: boolean;
    acceptMessage: boolean;
  
    constructor(public hospitalbloodrequestService: HospitalBloodRequestService, private router : Router) { }
  
    ngOnInit() {
      this.getHospitalBloodRequests_here();
    }
  
    getHospitalBloodRequests_here() {
      this.hospitalbloodrequestService.getHospitalBloodRequests().subscribe((res) => {
        this.hospitalbloodrequestService.hospitalbloodrequests = res as HospitalBloodRequest[];
      });
    }
    onAccept(
      
      _id: string,
      hospital_name: string,
      contact: string,
      email: string,
      date: string,
      blood_group: string,
      quantity: string,
      order_status: string,) {
      if (confirm('Are you sure to Accept the Order ?') == true) {
        order_status = "Accepted";
        this.hospitalbloodrequestService.onAccept(_id, order_status).subscribe((res) => {
          console.log(res);
          this.acceptMessage = true;
          setTimeout(() => this.acceptMessage = false, 3000);
          window.location.reload();
        });
  
      }
    }
  
    onDelete(_id) {
      if (confirm('Are you sure to delete this record ?') == true) {
        this.hospitalbloodrequestService.onDelete(_id).subscribe((res) => {
          this.showSucessMessage = true;
          setTimeout(() => this.showSucessMessage = false, 2000);
          this.getHospitalBloodRequests_here();
        });
      }
    }

  toggleSidebar(){ 
    toggleSidebar();
  }

}
