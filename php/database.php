<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    if (!empty($name) ||!empty($email) || !empty($password)){
         //create database connection
         //Data base values
        $serverName = "localhost";
        $userName = "root";
        $psswrd = "";
        $dbName = "SQLdata_base";
        $con = mysql_connect($serverName, $userName, $psswrd, $dbName);

        if(mysqli_connect_error()){
            die('Connect error('.mysqlo_connect_errno().')'.mysqlo_connect_error());
        }else{
            $SELECT = "SELECT email From register Where email = ? Limit 1";
            $INSERT = "INSERT Into register (name, password) values (?,?)";

            //Prepare Statement
            $stmt = $conn->prepare($SELECT);
            $stmt->bind_param("s",$email);
            $stmt->execute();
            $stmt->bind_result($email);
            $stmt->store_result();
            $rnum = $stmt->num_rows;

            if($rnum == 0){
                $stmt->close();

                $stmt = $conn->prepare($INSERT);
                $stmt->bind_param("ssssii", $name, $email, $password);
                $stmt->execute();
                echo "New record instered successfully";
            }else{
                echo "Someone already registered using this email";
            }
            $stmt->close();
            $conn->close();
        }
    }else{
        echo "All Fields Are Required";
        die();
    }
?>