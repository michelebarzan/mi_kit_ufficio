<?php
	
    $target_file = basename($_FILES["file"]["name"]);
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    
    //define ('SITE_ROOT', realpath(dirname(__FILE__)));
    define ('SITE_ROOT', 'C:\\xampp\\htdocs\\mi_kit_ufficio\files\txt');

    if (move_uploaded_file($_FILES["file"]["tmp_name"], SITE_ROOT.'\\'.$target_file)) 
    {
        echo "ok";
    } 
    else 
    {
        echo "error1";
    }

?>