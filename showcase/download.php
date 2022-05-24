<?php

if (!isset($_GET['file'])) die('Invalid argument');
$file = "templates/".$_GET['file'];
if (!file_exists($file)) die('Invalid argument');
$path = 'templates';



if ($path == dirname($file) && strpos($file, '.json') !== false){

    $content = file_get_contents($file);
    $json = json_decode($content);
    if (!$json) die('Invalid argument');
    
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    echo $content;

}