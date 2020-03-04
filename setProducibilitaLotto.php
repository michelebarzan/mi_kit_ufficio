<?php

    include "Session.php";
    include "connessione.php";

    $producibile=$_REQUEST["producibile"];
    $lotto=$_REQUEST["lotto"];
    $commessa=$_REQUEST["commessa"];

    $q1="UPDATE lotti SET producibile='$producibile' WHERE commessa='$commessa' AND lotto='$lotto'";
    $r1=sqlsrv_query($conn,$q1);
    if($r1==FALSE)
    {
        die("error1: ".$q1);
    }
   
?>