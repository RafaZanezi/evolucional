import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sUrl: string;

  constructor(public oHttp: HttpClient) {
    this.sUrl = '../assets/data';
  }

  buscarAlunos() {
    return this.oHttp.get<any>(`${this.sUrl}/students.json`);
  }

  buscarClasses() {
    return this.oHttp.get<any>(`${this.sUrl}/classes.json`);
  }

  buscarSeries() {
    return this.oHttp.get<any>(`${this.sUrl}/degrees.json`);
  }

  buscarProfessores() {
    return this.oHttp.get<any>(`${this.sUrl}/teachers.json`);
  }

  buscarAssuntos() {
    return this.oHttp.get<any>(`${this.sUrl}/matters.json`);
  }

  buscarRelacionamentos() {
    return this.oHttp.get<any>(`${this.sUrl}/relationships.json`);
  }

}
