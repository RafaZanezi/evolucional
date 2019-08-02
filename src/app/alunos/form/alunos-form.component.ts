import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Aluno } from '../../model/aluno.model';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alunos-form',
  templateUrl: './alunos-form.component.html',
  styleUrls: ['./alunos-form.component.scss']
})
export class AlunosFormComponent implements OnInit {

  aClasses: Array<any>;
  oForm: FormGroup;
  nIdRegistro: number;

  @Input() aluno: Aluno = new Aluno();
  @Output() concluir = new EventEmitter<Aluno>();

  constructor(private oService: DatabaseService,
    oFormBuilder: FormBuilder) {
    this.oForm = oFormBuilder.group({
      edtNome: [null, [Validators.required]],
      cbxClasse: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  atualizar() {
    const oAluno = this.aluno;
    const oClasse = this.aClasses.find(item => item.id === Number(this.cbxClasse.value));

    oAluno.nome = this.edtNome.value;
    if(oClasse) {
      oAluno.classe.idClasse = oClasse.id;
      oAluno.classe.descricao = oClasse.name;
    }

    this.concluir.emit(oAluno);
  }

  private carregarDados() {
      this.oService.buscarClasses().subscribe(res => {
        this.aClasses = res.classes;

        if(this.aluno) {
          this.nIdRegistro = this.aluno.idAluno;
          this.edtNome.setValue(this.aluno.nome);
          this.cbxClasse.setValue(this.aluno.classe.idClasse);
        }
      });
  }

  get edtNome() {
    return this.oForm.get('edtNome');
  }

  get cbxClasse() {
    return this.oForm.get('cbxClasse');
  }

}
