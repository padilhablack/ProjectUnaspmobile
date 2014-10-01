
//variaveis globais 

var path = "";// caminho padrão
var USERSESSION; // variavel de sessão
var busyIndicator = null; // icone de loading;

//função inicial
function wlCommonInit(){

	verificaLogin();

	
	if (WL.Client.getEnvironment() == WL.Environment.WINDOWS_PHONE_8) {
		path = "www/default/";
	}

}

//função que verfica o login
function verificaLogin(){
	var invocationData = { // parametros para execução da função no adapter
			adapter : 'autenticacaoAdapter', // adapter
			procedure : 'getUsuarioActive',// procedure do adapater
			parameters : [] // parametros
	};

	WL.Client.invokeProcedure(invocationData,{
		onSuccess : sucess,// função de retorno com sucesso
		onFailure : failure // função de falha do retorno
	});
}

function sucess(result){

	var useractive = result.invocationResult.user; 	// recebe dados do usuario ativo

	if(useractive !== null ){ // se os dados do usuario ativo não estiverem vazios


		// grava os dados na sessão
	
		USERSESSION = { 
				//parametros da variavel
				RA : useractive.userId,
				NOME : useractive.displayName,
				EMAIL : useractive.email,
				FOTO : useractive.foto
		}
		//verifica se o dado não é null
		verificaDadoExistente(USERSESSION.NOME,"#display-name-user");
		verificaDadoExistente(USERSESSION.EMAIL,"#display-email-user");
		// carrega os cursos
		loadCurso(USERSESSION.RA);
		
//		$("#display-name-user").text(USERSESSION.NOME);
//		$("#display-email-user").text(USERSESSION.EMAIL);

		// carrega todos os módulos necessários 

		$.mobile.changePage("#perfil");
	}else{
		failure(); // função de erro
	}
}

//teste = JSON.stringify(USERSESSION);
////alert(RA);
//alert(teste);

function failure(){
	// colocar mensagem de alerta de conexão falhou!
	$.mobile.changePage("#login");
}











