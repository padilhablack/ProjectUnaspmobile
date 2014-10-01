/**
 * 
 */

$.getScript(path+'js/controller/controller-financeiro.js', function(){
	 
	carregaAno(RA);

	$("#option-ano").change(function(){
		$("#option-ano :selected" ).each(function() {
			id = $( this ).val();
			$("#conteudo-financeiro").empty();
			loadFinanceiro(RA,id);
		
		});
		return false;
	});
	
});