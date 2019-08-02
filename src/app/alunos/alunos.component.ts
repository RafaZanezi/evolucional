import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { Aluno } from '../model/aluno.model';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.scss']
})
export class AlunosComponent implements OnInit {
  aAlunos: Array<any>;
  aSeries: Array<any>;
  aClasses: Array<any>;
  aDados: Array<Aluno>;
  aDadosFiltrados: Array<Aluno>;
  aDadosPaginados: Array<Aluno>;

  bFiltros: boolean;
  oForm: FormGroup;
  nIdEdicao: number;

  nPagIni: number;
  nPagTam: number;

  constructor(
    private oService: DatabaseService,
    oFormBuilder: FormBuilder
  ) {
    this.oForm = oFormBuilder.group({
      cbxSerie: [null, []],
      cbxClasse: [null, []]
    });

    this.bFiltros = false;
    this.nPagIni = 0;
    this.nPagTam = 10;

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
      this.aDadosPaginados = new Array<any>();

      for (let index = this.nPagIni; index < this.nPagTam + this.nPagIni; index++) {
        const oElement = this.aDadosFiltrados[index];
        if (oElement) {
          this.aDadosPaginados.push(oElement);
        }
      }

    }
  }

  showFiltros() {
    this.bFiltros = !this.bFiltros;
  }

  editar(nId: number) {
    this.nIdEdicao = nId;
  }

  atualizaDado(oAluno: Aluno) {
    const nIndexAluno = this.aAlunos.findIndex(item => item.id === this.nIdEdicao);
    this.aAlunos[nIndexAluno].name = oAluno.nome;
    this.aAlunos[nIndexAluno].classId = oAluno.classe.idClasse;
    this.nIdEdicao = null;
    this.listar();
    this.filtrar();
  }

  novosRegistros() {
    for (let index = 0; index < 300; index++) {
      const randSerie = this.aSeries[Math.floor(Math.random() * this.aSeries.length)].id;
      const randClasse = this.aClasses[Math.floor(Math.random() * this.aClasses.length)].id;
      const sNome = `Nome do aluno ${this.aAlunos.length + 1}`;
      const ra = this.gerarMatricula();

      const oAluno = {
        id: this.aAlunos.length + 1,
        ra: ra,
        name: sNome,
        degreeId: randSerie,
        classId: randClasse
      };

      this.aAlunos.push(oAluno);
    }
    this.listar();
  }

  /**
   * Função recursiva para impedir a criação de duas matrículas iguais
   */
  gerarMatricula() {
    const ra = Math.floor(Math.random() * (999999 + 1));

    if (this.aAlunos.some(item => item.ra === ra)) {
      this.gerarMatricula();
    } else {
      return ra;
    }
  }

  getPaginator() {
    const oPag = [];
    for (let index = 0; index < Math.round(this.aDadosFiltrados.length / this.nPagTam); index++) {
      const oIndex = {
        index: index + 1
      }
      oPag.push(oIndex);
    }

    return oPag;
  }

  close() {
    this.bFiltros = false;
    this.oForm.reset();
    this.listar();
  }

  paginacao(nIndex?: number) {
    if (nIndex) {
      this.nPagIni = (nIndex * 10) - this.nPagTam;
    } else {
      this.nPagIni = this.nPagIni + 10;
    }
    this.listar();
    this.filtrar();
  }

  paginacaoPrev() {
    if (this.nPagIni > 0) {
      this.nPagIni = this.nPagIni - 10;
      this.listar();
      this.filtrar();
    }
  }

  private listar() {
    this.aDados = new Array<any>();

    this.aAlunos.forEach(item => {
      const oSerie = this.aSeries.find(serie => serie.id === item.degreeId);
      const oClasse = this.aClasses.find(classe => classe.id === item.classId);

      const oAluno: Aluno = {
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
    this.aDadosPaginados = new Array<any>();

    for (let index = this.nPagIni; index < this.nPagTam + this.nPagIni; index++) {
      const oElement = this.aDadosFiltrados[index];
      if (oElement) {
        this.aDadosPaginados.push(oElement);
      }
    }
  }

  private buscarDados() {
    const oSubject = new Subject();
    const aRequests = [];

    aRequests.push(this.oService.buscarAlunos());
    aRequests.push(this.oService.buscarClasses());
    aRequests.push(this.oService.buscarSeries());

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
