<?php
function getTemplates($dir){
    $myBase = '//' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']);

    $templates = array();
    $files = scandir($dir);
    foreach ($files as $f){
        $content = file_get_contents($dir."/".$f);
        $json = json_decode($content, true);

        if ($json){
            if (!isset($json['desc'])) $json['desc'] = ""; 

            if (!isset($json['img']) && isset($json['image'])){
                $json['img'] = $json['image']; 
            } 

            $json['file'] = $myBase."/download.php?file=".urlencode($f);
            $templates[] = $json;
        }
    }
    return $templates;
}