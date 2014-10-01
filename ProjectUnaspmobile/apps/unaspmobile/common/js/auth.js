
// cria um dominio 
var unaspChallengeHandler = WL.Client.createChallengeHandler("UnaspRealm");

unaspChallengeHandler.isCustomResponse = function(response) {
	if (!response || !response.responseJSON	|| response.responseText === null) {
		return false;
	}
	if (typeof(response.responseJSON.authRequired) !== 'undefined'){
		return true;
	} else {
		return false;
	}
};

unaspChallengeHandler.handleChallenge = function(response){
	
	var authRequired = response.responseJSON.authRequired;
	var userSession = response.responseJSON.userIdentity;

	// se autenticacao falhar
	if (authRequired == true){
//		alert(JSON.stringify(authRequired));
		alert("Usuário ou senha incorreta");
		$("#user").val("");
		$("#password").val("");
		unaspChallengeHandler.submitFailure();

		// se autenticacao der certo
	} else if (authRequired == false){

//	teste = JSON.stringify(userSession);
//	alert(teste);
		
		USERSESSION = {
				NOME : userSession.displayName,
				RA : userSession.attributes.ra,
				EMAIL : userSession.email,
				FOTO : userSession.foto
		}
		
		verificaDadoExistente(USERSESSION.NOME,"#display-name-user");
		verificaDadoExistente(USERSESSION.EMAIL,"#display-email-user");
		loadCurso(USERSESSION.RA);
		$("#header-menu").show();
		$.mobile.changePage("#perfil");
		
		
	}
};

//envia dados para login
$("#entrar").bind('click', function () {
	var username = $("#user").val();
	var password = $("#password").val();
	
	if(username == "" || password == ""){
		showAlert("alert-error","Digite os dados corretamente!");
		$("#user").val("");
		$("#password").val("");
	}
	
	var invocationData = {
			adapter : "autenticacaoAdapter",
			procedure : "getStories",
			parameters : [username, password]
	};

	unaspChallengeHandler.submitAdapterAuthentication(invocationData, {});
	return false;
});

//faz logout
$(".bar").click(function(){
	WL.Client.logout('UnaspRealm', {onSuccess:function(){
		setTimeout(function(){
			$.mobile.changePage("#login");
			$("#header-menu").hide();
			}, 2000);
	}});
	$('#cursos-matriculados ul').html("");
	$("#user").val("");
	$("#password").val("");


});


$("#desligar").click(function(){
	loading("show-page-loading-msg","Saindo..");
	WL.Client.logout('UnaspRealm', {onSuccess:function(){
		setTimeout(function(){sair()}, 5000);
	}});
	
	function sair(){
		$.mobile.loading( "hide" );
		WL.App.close();
	}
	
});



