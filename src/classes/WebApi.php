<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto HTML editor
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */

require('../../../../../../config.php');

require_login();

$webApi = new WebApi($DB);
$webApi->readRequest();
$webApi->processRequest();

/**
 * TreeTopics Web API.
 *
 * @author RECITFAD
 */
class WebApi{
    /** @var mysqli_native_moodle_database */
    protected $db = null;

    /** @var stdClass */
    protected $request = null;

    /**
     * @param mysqli_native_moodle_database $db
     */
    public function __construct($db){
        $this->db = $db;
    }

    /**
     * Read the input data
     */
    public function readRequest(){
        $this->request = (object) json_decode(file_get_contents('php://input'), true);
        $this->request->data = (object) $this->request->data;
    }

    /**
     * Process the request
     */
    public function processRequest(){
        $serviceWanted = $this->request->service;

		if(method_exists($this, $serviceWanted)){
            $this->$serviceWanted();
        }
        else{
            $this->reply(false, null, "The service $serviceWanted was not found.");
        }
    }


    /**
     * Reply the client
     */
    protected function reply($success, $data = null, $msg = ""){
        $result = new stdClass();
        $result->success = $success;
        $result->data = $data;
        $result->msg = $msg;

        echo json_encode($result);
    }

    protected function saveTemplate() {
        global $CFG, $USER;
        try {

            $item = $this->request->data;

            $this->db->insert_record('atto_reciteditor_templates', array('name' => $item->name, 'type' => $item->type, 'userid' => $USER->id, 'htmlstr' => $item->htmlStr, 'img' => $item->img));
            $this->reply(true);
        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }

    protected function importTemplates() {
        global $USER;

        try {
            $data = $this->request->data;

            $data->fileContent = json_decode($data->fileContent);

            if(!is_array($data->fileContent)){
                $data->fileContent = array($data->fileContent);
            }

            foreach($data->fileContent as $item){
                if (!isset($item->htmlStr)) $item->htmlStr = $item->htmlstr; //JSON sometimes voids capit keys
                $this->db->insert_record('atto_reciteditor_templates', array('name' => $item->name, 'type' => $item->type, 'userid' => $USER->id, 'htmlstr' => $item->htmlStr, 'img' => $item->img));
            }


            $this->reply(true);

        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }

    protected function getTemplateList() {
        global $USER;

        try {

            $rst = $this->db->get_records('atto_reciteditor_templates', array('userid' => $USER->id), 'name');

            $result = array('c' => array(), 'l' => array());
            foreach($rst as $obj){
                $result[$obj->type][] = $obj;
            }

            $this->reply(true, $result);

        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }

    protected function deleteTemplate() {
        try {
            $data = $this->request->data;

            $this->db->delete_records('atto_reciteditor_templates', array('id' => $data->id));

            $this->reply(true);

        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }
}