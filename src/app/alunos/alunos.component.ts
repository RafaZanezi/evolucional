import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { forkJoin, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.scss']
})
export class AlunosComponent implements OnInit {
  aAlunos: Array<any>;
  aSeries: Array<any>;
  aClasses: Array<any>;
  aDados: Array<any>;
  aDadosFiltrados: Array<any>;

  bFiltros: boolean;

  oForm: FormGroup;

  constructor(
    private oService: DatabaseService,
    oFormBuilder: FormBuilder
  ) {
    this.oForm = oFormBuilder.group({
      cbxSerie: [null, []],
      cbxClasse: [null, []]
    });

    this.bFiltros = false;

    this.cbxSerie.valueChanges.subscribe(() => this.filtrar());
    this.cbxClasse.valueChanges.subscribe(() => this.filtrar());
  }

  ngOnInit() {
    this.buscarDados().subscribe(() => this.listar());
  }

  filtrar() {
    let aFiltrados = [];

    if (!Number(this.cbxSerie.value) && !Number(this.cbxClasse.value)) {
      this.listar();
    } else {
      if (Number(this.cbxSerie.value)) {
        aFiltrados = this.aDados.filter(item => item.serie.idSerie === Number(this.cbxSerie.value));
      }

      if (Number(this.cbxClasse.value)) {
        if (aFiltrados.length > 0) {
          aFiltrados = aFiltrados.filter(item => item.classe.idClasse === Number(this.cbxClasse.value));
        } else {
          aFiltrados = this.aDados.filter(item => item.classe.idClasse === Number(this.cbxClasse.value));
        }
      }

      this.aDadosFiltrados = aFiltrados;
    }
  }

  showFiltros() {
    this.bFiltros = !this.bFiltros;
  }

  private listar() {
    this.aDados = new Array<any>();

    this.aAlunos.forEach(item => {
      const oSerie = this.aSeries.find(serie => serie.id === item.degreeId);
      const oClasse = this.aClasses.find(classe => classe.id === item.classId);

      const oAluno = {
        idAluno: item.id,
        ra: item.ra,
        nome: item.name,
        serie: {
          idSerie: item.degreeId,
          descricao: oSerie ? oSerie.name : null
        },
        classe: {
          idClasse: item.classId,
          descricao: oClasse ? oClasse.name : null
        }
      }

      this.aDados.push(oAluno);
    });

    this.aDadosFiltrados = this.aDados;
  }

  private buscarDados() {
    const oSubject = new Subject();
    const aRequests = [];

    aRequests.push(this.oService.buscarAlunos())
    aRequests.push(this.oService.buscarClasses())
    aRequests.push(this.oService.buscarSeries())

    forkJoin(aRequests).subscribe(res => {
      this.aAlunos = res[0];
      this.aClasses = res[1].classes;
      this.aSeries = res[2];

      oSubject.next();
    });

    return oSubject;
  }

  get cbxSerie() {
    return this.oForm.get('cbxSerie');
  }

  get cbxClasse() {
    return this.oForm.get('cbxClasse');
  }

}
