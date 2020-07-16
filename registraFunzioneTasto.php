<?php

    include "connessione.php";

    $key=$_REQUEST["key"];
    $keyCode=$_REQUEST["keyCode"];
    $funzione=$_REQUEST["funzione"];

    $query2="DELETE FROM mappatura_tasti WHERE funzione='".$funzione."'";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $query3="INSERT INTO [dbo].[mappatura_tasti] ([key],[keyCode],[funzione]) VALUES ('".$key."',".$keyCode.",'".$funzione."')";
        $result3=sqlsrv_query($conn,$query3);
        if($result3==TRUE)
        {
            echo "ok";
        }
        else
            die("error");
    }
    else
        die("error");

?>