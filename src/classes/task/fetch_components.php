<?php
namespace atto_reciteditor\task;

/**
 * An example of a scheduled task.
 */
class fetch_components extends \core\task\scheduled_task {

    /**
     * Return the task's name as shown in admin screens.
     *
     * @return string
     */
    public function get_name() {
        return get_string('fetch_components', 'atto_reciteditor');
    }

    /**
     * Execute the task.
     */
    public function execute() {
        
        $componentUrl = 'https://recitfad.ca/moodledocs/vitrine_editeur_v2/components.php';

        try {
            $content = file_get_contents($componentUrl);
            $json = json_decode($content);
            if ($json){
                file_put_contents(dirname(__FILE__) . '/../../build/assets/components.json', $content);
            }
        }catch(Exception $e){

        }
    }
}