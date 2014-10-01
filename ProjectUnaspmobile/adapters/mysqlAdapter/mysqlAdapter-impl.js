/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */


var UserIdentify; // variavel de identificação do login

// RETORNA TRUE SE PRECISAR FAZER LOGIN
function onAuthRequired(headers, errorMessage){
	errorMessage = errorMessage ? errorMessage : null;
	return {
		authRequired: true,
		errorMessage: errorMessage
	};
}

// LOGOUT
function onLogout(){
	WL.Server.setActiveUser("UnaspRealm", null);
	WL.Logger.debug("Logged out");
}

//RETORNA CURSO

var curso = WL.Server.createSQLStatement("select Curso.idCurso,Curso.nome from Curso inner join Matricula on Matricula.idAluno = ? and Curso.idCurso = Matricula.idCurso")
function retornaCurso(ra) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : curso,
		parameters : [ra]
	});
}

//RETORNA TURMA

var turma = WL.Server.createSQLStatement("select Turma.idTurma,Turma.nome from Turma " +
		"inner join Matricula on " +
		"Matricula.idAluno = ? and Turma.idTurma = Matricula.idTurma " +
"and Matricula.idCurso = ?");
function retornaTurma(ra,curso) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : turma,
		parameters : [ra,curso]
	});
}

//RETORNA PERIODO

var periodo = WL.Server.createSQLStatement("select Periodo.idPeriodo,Periodo.nome from Periodo inner join Matricula " +
		"on Matricula.idAluno = ? and Periodo.idPeriodo = Matricula.idPeriodo " +
"and Matricula.idCurso = ? and Matricula.idTurma = ?");

function retornaPeriodo(ra,curso,turma) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : periodo,
		parameters : [ra,curso,turma]
	});
}


//RETORNA DISCIPLINA

var disciplina = WL.Server.createSQLStatement("SELECT disciplina.idDisciplina,disciplina.nome FROM `disciplina` inner join matricula on matricula.idAluno = ? and disciplina.idDisciplina = matricula.idDisciplina inner join curso on curso.idCurso = ? inner join periodo on periodo.idPeriodo = ? inner join turma on turma.idTurma = ? ");
function retornaDisciplina(ra,curso,turma,periodo) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : disciplina,
		parameters : [ra,curso,turma,periodo]
	});
}

//RETORNA NOTAS

var notas = WL.Server.createSQLStatement("SELECT idNotas,data,titulo,nota,peso,professor.nome,matricula.status, " +
		" DATE_FORMAT( `data` , '%d/%m/%Y' ) AS `data`" +
		" from notas inner join professor on " +
		" notas.idProfessor = professor.idProfessor and idAluno = ? and " +
		" idCurso = ? and " +
		" idTurma = ? and" +
		" idPeriodo = ? and" +
		" idDisciplina = ? " +
		" inner join matricula on matricula.idAluno = ? " +
		" ORDER BY  `data`");

function retornaNotas(ra,curso,turma,periodo,disciplina) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : notas,
		parameters : [ra,curso,turma,periodo,disciplina,ra]
	});
}

//RETORNA AULAS

var aula = WL.Server.createSQLStatement("SELECT data, descricao, falta, presenca, professor.nome AS professor,disciplina.nome as disciplina FROM aulas" +
		" INNER JOIN professor ON professor.idProfessor = aulas.idProfessor" +
		" INNER JOIN disciplina ON aulas.idDisciplina = ? and disciplina.idDisciplina = aulas.idDisciplina" +
		" WHERE idAluno = ? " +
		" AND idCurso = ? " +
		" AND idTurma = ? " +
		" AND idPeriodo = ? ");

function retornaAulas(disciplina,ra,curso,turma,periodo) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : aula,
		parameters : [disciplina,ra,curso,turma,periodo]
	});
}

//RETORNA FINANCEIRO

var financeiro = WL.Server.createSQLStatement("SELECT idfinaceiro, financeiro.idano, ano.nome_ano AS ano, financeiro.idmes, mes.nome_mes AS mes, valor, vencimento, financeiro.status FROM  `financeiro` " +
		" INNER JOIN matricula ON financeiro.idAluno = ? " +
		" INNER JOIN ano ON ano.idano = financeiro.idano " +
		" INNER JOIN mes ON mes.idmes = financeiro.idmes " +
		" AND matricula.idAluno = financeiro.idAluno");

function selectFinanceiro(ra) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : financeiro,
		parameters : [ra]
	});
}

//RETORNA LOGIN

var sql = WL.Server.createSQLStatement("SELECT idAluno, nome,senha FROM aluno WHERE idAluno = ? and senha = ?");

function getLogin(ra,senha){
	var result =   WL.Server.invokeSQLStatement({
		preparedStatement : sql,
		parameters : [ra,senha]
	});
	
	aux = result.resultSet;
	
	if(aux.length > 0){
		WL.Logger.debug("Login e senha correta");

		// CRIA UM OBJETO DE IDENTIDADE DO USUÁRIO
		userIdentity = {
				userId: String(aux[0].idAluno),
				displayName: aux[0].nome, 
				attributes: {
					ra: aux[0].idAluno
				}
		}
		//GRAVA NA SECAO
		WL.Server.setActiveUser("UnaspRealm", userIdentity);
		WL.Logger.debug("Acesso autorizado");

		//RETORNA OS DADOS DO PROCESSO
		return { authRequired : false,userIdentity : userIdentity};
		
		// CASO OCORRER ERRO
	}else if(aux[0].isSuccessful == false){
		WL.Logger.debug("Falha na autenticação");
		return onAuthRequired(null, "Falha na autenticação");
	}
	
	
}


function getUsuarioActive(){
	return {
		user : WL.Server.getActiveUser("UnaspRealm")
	};
}
