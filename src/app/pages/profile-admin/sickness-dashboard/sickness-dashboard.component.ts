import { Component, OnInit } from '@angular/core';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { ProfileAdminService } from '../profile-admin.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sickness-dashboard',
  templateUrl: './sickness-dashboard.component.html',
  styleUrls: ['./sickness-dashboard.component.css'],
})
export class SicknessDashboardComponent implements OnInit {
  sicknesses?: SicknessInterface[];
  sicknessUsb?: Subscription;
  currentSicknessId?: number;
  sicknessModal: string = 'none';
  deleteSicknessModal: string = 'none';


  constructor(private adminProfileService: ProfileAdminService, private router:Router) {}

  ngOnInit(): void {
    this.sicknessUsb = this.adminProfileService
      .getAllSickness()
      .subscribe((sicknesses) => {
        this.sicknesses = sicknesses;
      });
  }

  openModalSickness(idSickness: number) {
    this.currentSicknessId = idSickness;
    this.sicknessModal = 'block';
  }

  editSickness(currentSicknessId:number) {
  this.router.navigateByUrl(`edit-sickness/${currentSicknessId}`)
  }
  closeSicknessModal() {
    this.currentSicknessId = undefined;
    this.sicknessModal = 'none';
  }

  openDeleteSicknessModal() {
    this.sicknessModal = 'none';
    this.deleteSicknessModal = 'block';
  }
  closeDeleteSicknessModal() {
    this.currentSicknessId = undefined;
    this.deleteSicknessModal = 'none';
  }

  deleteSickness() {
    this.adminProfileService.deleteSickness(this.currentSicknessId!.toString()).subscribe((response) => {
      this.sicknesses = this.sicknesses!.filter(sickness=> sickness.sicknessId !== this.currentSicknessId);
      this.deleteSicknessModal = 'none';
    })
  }
}
