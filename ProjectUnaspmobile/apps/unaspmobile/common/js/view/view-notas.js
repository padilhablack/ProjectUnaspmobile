
/**
 * by Jonas Padilha - UNASPMOBILE
 * view-notas
 * */


var CURSO = " ", TURMA = "", PERIODO = "" , DISCIPLINA = ""; // variaveis globais 


/**faz chamada á pasta controller que executa os métodos **/

$.getScript(path+'js/controller/controller-notas.js', function(){
	
	loadCurso(RA);// carega o curso com o RA
	
	desabilita("#turma");
	desabilita("#periodo");
	desabilita("#disciplina");
	desabilita("#navbar0");

	$("#curso").change(function(){
		$( "#curso option:selected" ).each(function() {
			
			if(!$("#conteudo").is(":empty")){
				desabilita("#turma");
				desabilita("#periodo");
				desabilita("#disciplina");
				desabilita("#navbar0");
				$("#conteudo").empty();
			}
			
			CURSO = $( this ).val() + " ";
			loadTurma(RA,CURSO);
			habilita("#turma");
		});
		return false;
	});

	$("#turma").change(function(){
		$( "#turma option:selected" ).each(function() {
			TURMA = $( this ).val() + " ";
			loadPeriodo(RA,CURSO,TURMA);
			habilita("#periodo");
		});
		return false;
	});

	$("#periodo").change(function(){
		$( "#periodo option:selected" ).each(function() {
			PERIODO = $( this ).val();
			loadDisciplina(RA,CURSO,TURMA,PERIODO);
			habilita("#disciplina");
		});
		return false;
	});

	$("#disciplina").change(function(){
		$( "#disciplina option:selected" ).each(function() {
			DISCIPLINA = $( this ).val();
			loadNotas(RA,CURSO,TURMA,PERIODO,DISCIPLINA);
			habilita("#navbar0");
//			loadNotas(86539,5,4,4,41);
			
		});
		return false;
	});
	
	$("#faltas-menu").click(function(){
		loadAulas(RA,CURSO,TURMA,PERIODO,DISCIPLINA);
	});

});