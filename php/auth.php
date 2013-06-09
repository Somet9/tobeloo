<?php
require_once("TumblrOAuth");

function auth_build_query($parameters){
	$query = "";
	
	$not_first = FALSE;
	foreach($parameters as $key => $value){
		if($not_first){
			$query .= "&";
		}
		$query .= $key . "=" . rawurlencode($value);
		
		$not_first = TRUE;
	}
	
	return $query;
}

function genLinkInputTag($parameters){
	return '<input id="redirect_to" type="hidden" value="http://www16.atpages.jp/rikuta0209/tombloa/getByJson.php?'.auth_build_query($parameters).'" />';
}

function genRedirectInfoPage($parameters = array()){
	$p_str  = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	$p_str .= '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"'."\n";
	$p_str .= '    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'."\n";
	$p_str .= "<html>\n<head>\n\t<title>tombloa認証ページ</title>\n</head>\n<body>\n";
	$p_str .= "/t".genLinInputTag($parameters)."\n</body>\n</html>";
	
	return $p_str;
}

session_start();
/* Consumer key from twitter */
$consumer_key = '';
/* Consumer Secret from twitter */
$consumer_secret = '';
/* Set up placeholder */
$content = NULL;
/* Set state if previous session */
$state = $_SESSION['oauth_state'];
/* Checks if oauth_token is set from returning from twitter */
$session_token = $_SESSION['oauth_request_token'];
/* Checks if oauth_token is set from returning from twitter */
$oauth_token = $_REQUEST['oauth_token'];
/* Set section var */
$section = $_REQUEST['section'];

/* Clear PHP sessions */
if ($_REQUEST['test'] === 'clear') {/*{{{*/
	session_destroy();
	session_start();
}/*}}}*/

/* If oauth_token is missing get it */
if ($_REQUEST['oauth_token'] != NULL && $_SESSION['oauth_state'] === 'start') {/*{{{*/
	$_SESSION['oauth_state'] = $state = 'returned';
}/*}}}*/

if(strcmp($_REQUEST['auth'], "auth") == 0){
	$_SESSION['oauth_consumer_key'] = $consumer_key = $_REQUEST['key'];
	$_SESSION['oauth_consumer_secret'] = $consumer_secret = $_REQUEST['secret'];
} else {
	$consumer_key = $_SESSION['oauth_consumer_key'];
	$consumer_secret = $_SESSION['oauth_consumer_secret'];
}

switch($state){
	default:
		$to = new TumblrOAuth($consumer_key, $consumer_secret);
		$tok = $to->getRequestToken();
		
		$_SESSION['oauth_request_token'] = $token = $tok['oauth_token'];
		$_SESSION['oauth_request_token_secret'] = $tok['oauth_token_secret'];
		$_SESSION['oauth_state'] = "start";
		
		$request_link = $to->getAuthorizeURL($token);
		header("Location: ".$request_link);
		exit;
		break;
		
	case 'returned':
		if($_SESSION['oauth_access_token'] === NULL && $_SESSION['oauth_access_token_secret'] === NULL){
			$oauth_verifier = $_REQUEST['oauth_verifier'];
			$to = new TumblrOAuth($consumer_key, $consumer_secret, $_SESSION['oauth_request_token'], $_SESSION['oauth_request_token_secret']);
			
			$tok = $to->getAccessToken($oauth_verifier);
			$_SESSION['oauth_access_token'] = $tok['oauth_token'];
			$_SESSION['oauth_access_token_secret'] = $tok['oauth_token_secret'];
		}
		
		$parameters = array('access_token'=>$_SESSION['oauth_access_token'], 'access_token_secret'=>$_SESSION['oauth_access_token_secret']);
		header("Content-type: text/html; charset=utf-8");
		echo genRedirectInfoPage($parameters);
		
		break;
}
?>