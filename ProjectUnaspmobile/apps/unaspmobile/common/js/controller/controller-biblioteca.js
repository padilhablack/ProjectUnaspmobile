/**
 * Controller Biblioteca 
 * Jonas Padilha Rodrigues
 */

urlImagens = "http://localhost/unaspmobile-admin/server/php"; // endereco de imagens dos livros

//MOSTRA A QUANTIDADE DE EMPRESTIMOS 

existeEmprestimo = "";
existeReserva = "";

function loadEmprestimos (ra){
	div = $("#conteudo_material");
	executaProcedure([ra], "mysqlAdapter", "selectEmprestimos", ativosSucess, null);

	function ativosSucess(result){

		auxE = result.invocationResult.resultSet;
		existeEmprestimo = auxE.length;
		if (auxE.length > 0) {
			$("#emprestimo").empty();
			mostraNoButton(auxE , "#emprestimo");
			emprestimoAtivo(auxE,div);
			
		}
	}
}

//MOSTRA A QUANTIDADE DE RESERVAS

function loadReservas (ra){

	executaProcedure([ra], "mysqlAdapter", "selectReserva",reservaSucess, null);

	function reservaSucess(result){
		aux = result.invocationResult.resultSet;
		existeReserva = aux.length; 
		if (aux.length > 0) {
			 $("#reserva").empty();
			mostraNoButton(aux, "#reserva");
			
			 
		}
	}
}

function emprestimoAtivo(items,elemento){

	content = $(elemento);

	dado = '<table class="ui-responsive'; 
	dado += '<tbody style="text-align:left">';

	for (var i = 0; i < items.length; i++) {

		dado += '<tr><td>';
		dado +='<a><img src = "'+urlImagens+"/"+items[i].foto+'"style="width: 100px;"></a>';
		dado +='</td><td>';
		dado +='<ul class="material">';
		dado +='<li> Titulo: '+items[i].titulo+'</li>';
		dado +='<li> Autor: '+items[i].autor+'</li>';
		dado +='<li> Tipo: '+items[i].tipo+'</li>';
		dado +='<li> Data de Saída: '+items[i].data_saida+'</li>';
		dado +='<li> Data de Devolução: '+items[i].data_devolucao+'</li>';
		dado +='</ul></td>';
		dado +='</tr>';

	}

	dado +='</tbody>';
	dado +='</table>';

	$(content).html(dado);
}

//FUNÇÃO GENERICA QUE CONCATENA UM NUMERO DE QUANTIDADE A UM ELEMENTO

function mostraNoButton(itens, elemento){

	var button = $(elemento), texto = $(elemento).attr('title');

	vetor = [];

	numero = "";

	for(var i = 0; i < itens.length; i++){

		vetor.push(itens[i].idemprestimo);

		numero = vetor.length;
	}

	button.text(texto+" ("+numero+")");
}

//PESQUISA

function pesquisaMaterial (pesquisa){

	executaProcedure([pesquisa], "mysqlAdapter", "retornaMaterial", pesquisaSuccess, failConnection);


}


function pesquisaSuccess(result){

	if (result.invocationResult.resultSet.length > 0) {

		displayMaterial(result.invocationResult.resultSet);

	}else{
		pesquisaFailure();
	}
}

function displayMaterial(items){
	var conteudo = document.getElementById('conteudo_material'), // pegar o id onde será mostrado o conteudo

	table = ['<table class="ui-responsive']; // cria uma tabela com os dados 

	table.push('<tbody style="text-align:left">');

	for (var i = 0; i < items.length; i++) {

		var foto = String(items[i].foto) ,statusBD = "";

		if(items[i].disponivel == 0)

			statusBD =  "Disponível";

		else
			statusBD =  "Não Disponível";

		table.push('<tr><td>');
		table.push('<a><img src = "'+urlImagens+"/"+foto+'"style="width: 100px;" class = '+items[i].idmaterial+'></a>');
		table.push('</td><td>');
		table.push('<ul>');
		table.push('<li>Tipo:</li>');
		table.push('<li>Título;</li>');
		table.push('<li>Autor:</li>');
		table.push('<li>Ano:</li>');
		table.push('<li>Editora</li>');
		table.push('<li>Status:</li>');
		table.push('</ul></td>');
		table.push('</td><td>');
		table.push('<ul id = "'+items[i].idmaterial+'">');
		table.push('<li>'+items[i].tipo+'</li>');
		table.push('<li>'+items[i].titulo+'</li>');
		table.push('<li>'+items[i].autor+'</li>');
		table.push('<li>'+items[i].ano+'</li>');
		table.push('<li>'+items[i].editora+'</li>');
		table.push('<li>'+statusBD+'</li>');
		table.push('</ul></td>');
		table.push('<td><a href="#popupBiblioteca" data-rel="popup" data-position-to="window" data-transition="fade" tipo= "emprestimo" material="'+items[i].idmaterial+'" class="material_click ui-link ui-btn ui-shadow ui-corner-all">Emprestar</a>');
		table.push('<a href="#popupBiblioteca" data-rel="popup" data-position-to="window" data-transition="fade"  tipo= "reserva" material="'+items[i].idmaterial+'" class="material_click ui-link ui-btn ui-shadow ui-corner-all">Reservar</a></td>');
		table.push('</tr>');

	}
	table.push('</tbody>');
	table.push('</table>');
	conteudo.innerHTML = table.join('');

	// EXECUTA UM EMPRESTIMO OU RESERVA

	$("#material").click(function(){

			botao = $(this).attr('tipo');
			// RECEBE O ID DO BOTAO

			ra = RA, // PASSA O RA GLOBAL DA SESSÃO

			data_de_devolucao = '2014-12-12'; // criar data do current_timestamp


			material = $(this).attr('material');

			ul = $('#'+material);

			li = $(ul).children("li");

			atributo_imagem = $("."+material).attr('src');// pegar a url da imagem atual

			div = '<table class="ui-responsive'; 
			div += '<tbody style="text-align:left">';
			div += '<tr><td>';
			div +='<a><img src = "'+atributo_imagem+'" style="width: 200px;"></a>';
			div +='</td><td>';
			div +='<ul class="material">';
			div +='<li>'+$(li).eq(0).text()+'</li>';
			div +='<li>'+$(li).eq(1).text()+'</li>';
			div +='<li>'+$(li).eq(2).text()+'</li>';
			div +='<li>'+$(li).eq(3).text()+'</li>';
			div +='<li>'+$(li).eq(4).text()+'</li>';
			div +='<li>'+$(li).eq(5).text()+'</li>';
			div +='</ul></td>';
			div +='</tr>';
			div +='</tbody>';
			div +='</table>';
			div +='<div class="ui-content">';
			div +='<a href="#" id="confirmar" class="ui-btn ui-btn ui-shadow ui-corner-all"  data-rel="back"style="background-color:#64FF60;">Confirmar</a>';
			div +='<a href="#" id="confirmar" class="ui-btn ui-btn ui-shadow ui-corner-all"  data-rel="back" style="background-color:#FF530D;color:#ffffff">Cancelar</a>';
			div +='</div>';

			if(botao == "reserva"){
				if(existeReserva  == 3){
					$("#popupBiblioteca").html("Não é possivel realizar reservas");
				}else{
					$("#popupBiblioteca").html(div);
				}
			}else if(botao == "emprestimo"){
				if(existeEmprestimo == 3){
					$("#popupBiblioteca").html("Não é possivel realizar emprestimos");
				}else{
					$("#popupBiblioteca").html(div);
				}
			}
			

			// verfica stuatus de emprestimo e reserva se podem ser feitos
		
			
	

			// Se estiver possui emprestimo ou reserva suficiente...executa		
		

				$('#confirmar').click(function(){
					if(botao == "reserva"){
						fazReserva(ra, material);
					}

					else if(botao == "emprestimo"){
						setEmprestimo(ra, material,data_de_devolucao);
					}
				});
			
//		alert("Jonas");
		});

	}

	function pesquisaFailure(){
		var conteudo = document.getElementById('conteudo_material');
		conteudo.innerHTML = "Livro não encontrado";
		WL.Logger.error("falha ao receber os dados ");
		console.log("Livro não encontrado");

	}

//	FIM PESQUISA 


//	FUNCAO DE EMPRESTIMO

	function setEmprestimo (ra,material,data){
		executaProcedure([ra,material,data], "mysqlAdapter", "setEmprestimos",
				function(){ 
			location.reload();
			showAlert('alert-success','Realizado com sucesso');
		},

		function(){
			location.reload();
			showAlert('alert-error','Não foi possivel realizar o emprestimo');
		}
		);

	}

//	FUNCAO DE RESERVA

	function fazReserva(ra, material){
		executaProcedure([ra,material], "mysqlAdapter", "criaReserva",
				function(){ 
			location.reload();
			showAlert('alert-success','Realizado com sucesso');
		},

		function(){
			location.reload();
			showAlert('alert-error','Não foi possivel realizar a Reserva');
		}

		);
	}







