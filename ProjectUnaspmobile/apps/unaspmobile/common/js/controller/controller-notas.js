/**
 * by Jonas Padilha - UNASPMOBILE
 * titulo: controller-notas
 * descri��o : func�es que se comunicam com o adpater do banco de dados e
 * devolvem os resultados na tela
 * */


/** PROCEDIMENTO PARA CARREGAR O CURSO**/ 
function loadCurso(ra){
	
	executaProcedure([ra], 'StoreHTTP', 'retornaCurso', loadCursoSuccess, loadFailure);
}

function loadCursoSuccess(result){
	if (result.invocationResult.array.length > 0) {
		displayCurso(result.invocationResult.array);
	}else 
		loadFailure();	 
//	teste = JSON.stringify(result.invocationResult.array);
//	alert(teste);
}

function displayCurso(items){
	var selectCurso = $('#cursos-matriculados ul');		
	for (var i = 0; i < items.length; i++) {
		var li = $('<li/>').html(items[i].nome_curso).val(items[i].id_curso);
		selectCurso.append(li);
	}
}




/** FIM  PROCEDIMENTO CURSO **/ 


/** PROCEDIMENTO PARA CARREGAR TURMA**/ 
function loadTurma(ra,curso){
	executaProcedure([ra,curso], 'mysqlAdapter', 'retornaTurma', loadTurmaSuccess, loadFailure);
}
//função de sucesso
function loadTurmaSuccess(result){
	if (result.invocationResult.resultSet.length > 0) {
		displayTurma(result.invocationResult.resultSet);
	}else 
		loadFailure();	 
}

//Mostra no Option
function displayTurma(items){
	var selectTurma = $('#turma select');   
	for (var i = 0; i < items.length; i++) {
		var li = $('<option/>').html(items[i].nome).val(items[i].idTurma);
		$('#turma select option:eq(1)').remove();
		selectTurma.append(li);
	}

}
/** FIM PROCEDIMENTO TURMA**/ 

/** PROCEDIMENTO PARA CARREGAR O PERIODO**/ 
function loadPeriodo(ra,curso,turma){
	
	executaProcedure([ra,curso,turma], 'mysqlAdapter', 'retornaPeriodo', loadPeriodoSuccess, loadFailure);
}

function loadPeriodoSuccess(result){
	if (result.invocationResult.resultSet.length > 0) {
		displayPeriodo(result.invocationResult.resultSet);
	}else 
		loadFailure();	 
}

function displayPeriodo(items){
	var selectPeriodo = $('#periodo select');   
	for (var i = 0; i < items.length; i++) {
		var li = $('<option/>').html(items[i].nome).val(items[i].idPeriodo);
		$('#periodo select option:eq(1)').remove();
		selectPeriodo.append(li);
	}
}
/** FIM PROCEDIMENTO CURSO**/ 

/** PROCEDIMENTO PARA CARREGAR DISCIPLINA**/ 
function loadDisciplina(ra,curso,turma,periodo){

	executaProcedure([ra,curso,turma,periodo], 'mysqlAdapter', 'retornaDisciplina', loadDiscilinaSuccess, loadFailure);
}

function loadDiscilinaSuccess(result){
	if (result.invocationResult.resultSet.length > 0) {
		displayDisciplina(result.invocationResult.resultSet);
	}else 
		loadFailure();	 
}

//Mostra no Option
function displayDisciplina(items){
	var selectDisciplina = $('#disciplina select');   
	for (var i = 0; i < items.length; i++) {
		var li = $('<option/>').html(items[i].nome).val(items[i].idDisciplina);
		$('#disciplina select option:eq(1)').remove();
		selectDisciplina.append(li);
	}
}
/** FIM PROCEDIMENTO DISCIPLINA**/ 


/** PROCEDIMENTO PARA CARREGAR NOTAS*/ 
function loadNotas(ra,curso,turma,periodo,disciplina,mostra){

	executaProcedure( [ra,curso,turma,periodo,disciplina], 'mysqlAdapter', 'retornaNotas', loadNotasSuccess, loadFailure);
}
//função de sucesso
function loadNotasSuccess(result){
	if (result.invocationResult.resultSet.length > 0) {
		displayAvaliacoes(result.invocationResult.resultSet);
		
		$("#faltas-menu").removeClass('ui-btn-active'); // começam desativados caso já exista uma consulta ativa e comece outra
		$("#notas-menu").removeClass('ui-btn-active');// começam desativados caso já exista uma consulta ativa e comece outra
		
		$("#notas-menu").click(function(){
			displayNotas(result.invocationResult.resultSet);

		});
		$("#avaliacao-menu").click(function(){
			displayAvaliacoes(result.invocationResult.resultSet);
			$("#notas-menu").removeClass('ui-btn-active');
		});

	}else 
		loadFailure();	 
}


//Mostra no Option
function displayAvaliacoes(items){
	var notas 	 = document.getElementById('conteudo'); // pegar o id onde será mostrado o conteudo
	table = ['<table class="ui-responsive table-stroke" style="width:100%;">']; // cria uma tabela com os dados 
	table.push('<thead>');
	table.push('<tr>'+
			'<th data-priority="1">Data</th>'+
			'<th data-priority="1">Titulo</th>'+
			'<th data-priority="1">Peso</th>'+
			'<th data-priority="1">Nota</th>'+
	'</tr>');
	table.push('</thead>');
	//fim do cabeçalho da  tabela 
	
	//corpo da tabela 
	table.push('<tbody style="text-align:center">');

	for (var i = 0; i < items.length; i++) {
		table.push('<tr><td>');
		table.push(items[i].data);// concatena
		table.push('</td><td>');
		table.push(items[i].titulo);
		table.push('</td><td>');
		table.push(items[i].peso);
		table.push('</td><td>');
		table.push(items[i].nota);
		table.push('</td></tr>');
	}
	table.push('</tbody>');
	table.push('</table>');
	//fim da tabela 
	notas.innerHTML = table.join(''); // adiciona a tabela na div 
	$("#avaliacao-menu").addClass("ui-link ui-btn ui-btn-active");// ativa o menu por padrão toda vez que iniciar uma nova consulta
}

function displayNotas(items){
	var media = 0,mediaFinal = 0, professor = "", mostraStatus = "";
	var notas 	 = document.getElementById('conteudo'); // pegar o id onde será mostrado o conteudo
	table = ['<table class="ui-responsive table-stroke" style="width:100%">']; // cria uma tabela com os dados 
	table.push('<thead>');
	table.push('<tr>'+
			'<th data-priority="1">Status</th>'+
			'<th data-priority="1">Professor(a)</th>'+
			'<th data-priority="1">Média</th>'+
			'<th data-priority="1">Situação</th>'+
	'</tr>');
	table.push('</thead>');

	table.push('<tbody style="text-align:center">');
	table.push('<tr>');

	for (var i = 0; i < items.length; i++){
		var status = items[i].status;
		professor = items[i].nome;
		media = items[i].nota + media;
		mediaFinal = media/ items.length;
		if(status > 0)
			mostraStatus = "Concluído";
		else
			mostraStatus = "Cursando";
	}
	table.push('<tr><td>');
	table.push(mostraStatus);
	table.push('</td><td>');
	table.push(professor);
	table.push('</td><td>');
	table.push(mediaFinal.toFixed(2));
	table.push('</td><td>');
	table.push();
	table.push('</td></tr>');
	table.push('</tr>');
	table.push('</tbody>');
	table.push('</table>');
	notas.innerHTML = table.join(''); 
}
/** FIM PROCEDIMENTO NOTAS**/ 


/** PROCEDIMENTO PARA CARREGAR AULAS**/ 
function loadAulas(ra,curso,turma,periodo,dsciplina){
	
	executaProcedure([ra,curso,turma,periodo,dsciplina],  'mysqlAdapter', 'retornaAulas', loadAulasSuccess, loadFailure);
}

//função de sucesso
function loadAulasSuccess(result){
	if (result.invocationResult.resultSet.length > 0) {
		displayAulas(result.invocationResult.resultSet);
	}else 
		loadFailure();	 
}
//Mostra no Option
function displayAulas(items){

	var conteudo = document.getElementById('conteudo'); // pegar o id onde será mostrado o conteudo
	table = ['<table class="ui-responsive table-stroke" style="width:100%">']; // cria uma tabela com os dados 
	table.push('<thead>');
	table.push('<tr>'+
			'<th data-priority="1">Data</th>'+
			'<th data-priority="1">Descrição</th>'+
			'<th data-priority="1">Presença</th>'+
			'<th data-priority="1">Falta</th>'+
	'</tr>');
	table.push('</thead>');	
	table.push('<tbody style="text-align:center">');
	for (var i = 0; i < items.length; i++) {

		var data  = items[i].data, 
		dia = data.substr(8,2),
		mes = data.substr(6,1),
		ano = data.substr(0,4);


		table.push('<tr><td>');
		table.push(dia+'/'+mes+'/'+ano);
		table.push('</td><td>');
		table.push(items[i].descricao);
		table.push('</td><td>');
		table.push(items[i].presenca);
		table.push('</td><td>');
		table.push(items[i].falta);
		table.push('</td></tr>');
	}
	table.push('</tbody>');
	table.push('</table>');
	conteudo.innerHTML = table.join('');

}
/** FIM  PROCEDIMENTO AULAS **/ 


/**função que será executada caso as procedures não funcionarem**/
function loadFailure(result){
	WL.Logger.error("falha ao receber os dados ");
	WL.SimpleDialog.show("Falha ao Carregar aluno", 
			[{
				text : 'Reload App',
				handler : WL.Client.reloadApp 
			}]);
}



