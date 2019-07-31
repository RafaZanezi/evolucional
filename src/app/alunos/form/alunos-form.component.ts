import { Component, OnInit, Input } from '@angular/core';
import { Aluno } from '../../model/aluno.model';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alunos-form',
  templateUrl: './alunos-form.component.html',
  styleUrls: ['./alunos-form.component.scss']
})
export class AlunosFormComponent implements OnInit {

  aSeries: Array<any>;
  aClasses: Array<any>;

  oForm: FormGroup;

  nIdRegistro: number;

  @Input() aluno: Aluno = new Aluno();

  constructor(private oService: DatabaseService,
    oFormBuilder: FormBuilder) {
    this.oForm = oFormBuilder.group({
      edtNome: [null, [Validators.required]],
      cbxSerie: [null, [Validators.required]],
      cbxClasse: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  private carregarDados() {
    this.oService.buscarSeries().subscribe(res => {
      this.aSeries = res;
      this.oService.buscarClasses().subscribe(res => {
        this.aClasses = res.classes;

        if(this.aluno) {
          this.nIdRegistro = this.aluno.idAluno;
          this.edtNome.setValue(this.aluno.nome);
          this.cbxSerie.setValue(this.aluno.serie.idSerie);
          this.cbxClasse.setValue(this.aluno.classe.idClasse);
        }
      });
    });
  }

  get edtNome() {
    return this.oForm.get('edtNome');
  }

  get cbxSerie() {
    return this.oForm.get('cbxSerie');
  }

  get cbxClasse() {
    return this.oForm.get('cbxClasse');
  }

}
