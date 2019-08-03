import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Subject, forkJoin } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-professores-form',
  templateUrl: './professores-form.component.html',
  styleUrls: ['./professores-form.component.scss']
})
export class ProfessoresFormComponent implements OnInit {

  aProfessores: Array<any>;
  aSeries: Array<any>;
  aClasses: Array<any>;

  oForm: FormGroup;

  @Output() concluir = new EventEmitter<any>();

  constructor(
    private oService: DatabaseService,
    oFormBuilder: FormBuilder) {
    this.oForm = oFormBuilder.group({
      cbxProfessor: [null, []],
      cbxSeries: [null, []],
      cbxClasses: [null, []],
    });
  }

  ngOnInit() {
    this.buscarDados().subscribe();
  }

  salvar() {
    this.concluir.emit({
      teacherId: this.cbxProfessor.value,
      degreeId: this.cbxSeries.value,
      classId: this.cbxClasses.value,
    });
  }

  private buscarDados() {
    const oSubject = new Subject();
    const aRequests = [];

    aRequests.push(this.oService.buscarProfessores());
    aRequests.push(this.oService.buscarClasses());
    aRequests.push(this.oService.buscarSeries());

    forkJoin(aRequests).subscribe(res => {
      this.aProfessores = res[0];
      this.aClasses = res[1].classes;
      this.aSeries = res[2];

      oSubject.next();
    });

    return oSubject;
  }

  get cbxProfessor() {
    return this.oForm.get('cbxProfessor');
  }

  get cbxSeries() {
    return this.oForm.get('cbxSeries');
  }

  get cbxClasses() {
    return this.oForm.get('cbxClasses');
  }

}
