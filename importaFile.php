<?php

    include "Session.php";
    include "connessione.php";

    $fileName=$_REQUEST["fileName"];

    $rows=[];

    $rowN=1;
    $file = fopen("files/txt/$fileName", "r") or die("error");
    while(!feof($file))
    {
        $rowString=fgets($file);

        $dirtyRow=explode(";",$rowString);
        
        if(sizeof($dirtyRow)>1)
        {
            $row=[];
            foreach($dirtyRow as $dirtyItem)
            {
                $item=str_replace('"','',$dirtyItem);
                array_push($row,$item);
            }
            array_push($rows,$row);
        }
        $rowN++;
    }
    fclose($file);

    $n=0;
    foreach($rows as $row)
    {
        if($n==0)
        {
            $commessa=$row[0];
            $lotto=$row[1];
            $q3="UPDATE lotti SET producibile='false',data_importazione=GETDATE(),utente_importazione=".$_SESSION['id_utente']." WHERE lotto='$lotto' AND commessa='$commessa'";
            $r3=sqlsrv_query($conn,$q3);
            if($r3==FALSE)
            {
                die("error1: ".$q3);
            }
            $q4="INSERT INTO lotti(lotto,commessa,producibile,data_importazione,utente_importazione) SELECT '$lotto','$commessa','false',GETDATE(),".$_SESSION['id_utente']." WHERE '$lotto' NOT IN (SELECT lotto FROM lotti WHERE commessa='$commessa')";
            $r4=sqlsrv_query($conn,$q4);
            if($r4==FALSE)
            {
                die("error1: ".$q4);
            }
            $q1="DELETE FROM dati_gea WHERE commessa='$row[0]' AND lotto='$row[1]'";
            $r1=sqlsrv_query($conn,$q1);
            if($r1==FALSE)
            {
                die("error1: ".$q1);
            }
        }
        $q2="INSERT INTO [dbo].[dati_gea]
                    ([commessa]
                    ,[lotto]
                    ,[anno]
                    ,[lancio_produzione]
                    ,[numero_cabina]
                    ,[disegno_cabina]
                    ,[kit]
                    ,[posizione]
                    ,[qnt])
            VALUES
                    ('$row[0]'
                    ,'$row[1]'
                    ,'$row[2]'
                    ,'$row[3]'
                    ,'$row[4]'
                    ,'$row[5]'
                    ,'$row[6]'
                    ,'$row[7]'
                    ,'$row[8]')";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error2: ".$q2);
        }
        $n++;
    }
    
    $q5="SELECT * FROM lotti WHERE commessa='$commessa' AND lotto='$lotto'";
    $r5=sqlsrv_query($conn,$q5);
    if($r5==FALSE)
    {
        die("error1: ".$q5);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r5))
        {
            $arrayResponse["id_lotto"]=$row["id_lotto"];
        }
    }
    $arrayResponse["commessa"]=$commessa;
    $arrayResponse["lotto"]=$lotto;

    echo json_encode($arrayResponse);
   
?>