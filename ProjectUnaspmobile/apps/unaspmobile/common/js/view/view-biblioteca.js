
/**
 * by Jonas Padilha - UNASPMOBILE
 * view-Biblioteca
 * */


/**faz chamada � pasta controller que executa os m�todos **/

$.getScript(path+'js/controller/controller-biblioteca.js', function(){

	loadEmprestimos(RA);
	loadReservas(RA);
	
	var PESQUISA = "";
	
	
	$('#pesquisa').click(function(){
		PESQUISA = $("#search").val();
		if(PESQUISA != ""){
			$("#conteudo_material").empty();
			pesquisaMaterial(PESQUISA);
		}
		return false;
	});
	
	
});