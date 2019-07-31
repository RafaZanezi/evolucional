interface Serie {
    idSerie: number;
    descricao: string;
}

interface Classe {
    idClasse: number;
    descricao: string;
}

export class Aluno {
    idAluno: number;
    ra: number;
    nome: string;
    serie: Serie;
    classe: Classe;

    constructor() {
        this.idAluno = null;
        this.ra = null;
        this.nome = null;
        this.serie = {} as Serie;
        this.classe = {} as Classe;
    }
}