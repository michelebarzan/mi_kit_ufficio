<?php

    include "Session.php";
    include "connessione.php";

    $lotto=$_REQUEST["lotto"];
    $commessa=$_REQUEST["commessa"];

    $pdf_mancanti=[];

    $q5="SELECT kit FROM dati_gea WHERE commessa='$commessa' AND lotto='$lotto'";
    $r5=sqlsrv_query($conn,$q5);
    if($r5==FALSE)
    {
        die("error1: ".$q5);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r5))
        {
            if(file_exists("C:\\xampp\\htdocs\\mi_kit_pdf\\pdf.js\\web\\pdf\\kit\\".$row['kit'].".pdf")!=1)
            {
                $pdf_mancante["text"]="PDF del kit <b>".$row['kit'] ."</b> mancante";
                $pdf_mancante["tipo"]="kit";
                $pdf_mancante["codice"]=$row['kit'];
                array_push($pdf_mancanti,$pdf_mancante);
            }
            //$myfile = fopen("C:\\xampp\\htdocs\\mi_kit_pdf\\pdf.js\\web\\pdf\\kit\\".$row['kit'].".pdf", "w");
        }
    }
    $q6="SELECT DISTINCT disegno_cabina FROM [view_cabine] WHERE commessa='$commessa' AND lotto='$lotto'";
    $r6=sqlsrv_query($conn,$q6);
    if($r6==FALSE)
    {
        die("error1: ".$q6);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r6))
        {
            if(file_exists("C:\\xampp\\htdocs\\mi_kit_pdf\\pdf.js\\web\\pdf\\cabine_corridoi\\".$row2['disegno_cabina'].".pdf")!=1)
            {
                $pdf_mancante["text"]="PDF della cabina <b>".$row2['disegno_cabina'] ."</b> mancante";
                $pdf_mancante["tipo"]="cabina";
                $pdf_mancante["codice"]=$row2['disegno_cabina'];
                array_push($pdf_mancanti,$pdf_mancante);
            }
            //$myfile = fopen("C:\\xampp\\htdocs\\mi_kit_pdf\\pdf.js\\web\\pdf\\cabine_corridoi\\".$row2['disegno_cabina'].".pdf", "w");
        }
    }
    echo json_encode($pdf_mancanti);
   
?>