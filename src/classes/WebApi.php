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
 * Set the gateway.
 *
 * @copyright  RECITFAD
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
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

    /** @var mysqli */
    protected $mysqli = null;

    /** @var stdClass */
    protected $request = null;

    /**
     * @param mysqli_native_moodle_database $db
     */
    public function __construct($db){
        $this->db = $db;
        $refmoodledb = new ReflectionObject($db);
        $refprop1 = $refmoodledb->getProperty('mysqli');
        $refprop1->setAccessible(true);
        $this->mysqli = $refprop1->getValue($db);
    }

    public function execSQL($query){
		try{
			$result = $this->mysqli->query($query);
			
			if($result === FALSE){
				$msg  = sprintf("MySQL Error: %s", $this->mysqli->error);
				$msg .= '<b>Query:</b>' . $query . '<br/><br/>';
				throw new Exception($msg);
			}
			
			return $result;
		}
		catch(Exception $e){
			throw $e;
		}
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
            $prefix = $CFG->prefix;

            $data = $this->request->data;
            $data->name = $this->mysqli->real_escape_string($data->name);
            $query = "insert into {$prefix}atto_reciteditor_templates (name, type, userid, htmlstr, img)
            values('$data->name', '$data->type', $USER->id, '$data->htmlStr', '$data->img')";

            $this->execSQL($query);
            $this->reply(true);
        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }

    protected function importTemplates() {
        global $CFG, $USER;

        try {
            $data = $this->request->data;
            $prefix = $CFG->prefix;

            $data->fileContent = json_decode($data->fileContent);

            $values = array();
            foreach($data->fileContent as $item){
                $item->name = $this->mysqli->real_escape_string($item->name);
                $item->htmlStr = $this->mysqli->real_escape_string($item->htmlStr);
                $values[] = "('$item->name', '$item->type', $USER->id, '$item->htmlStr', '$item->img')";
            }

            $query = sprintf("insert into {$prefix}atto_reciteditor_templates (name, type, userid, htmlstr, img) values %s", implode(",", $values));

            $this->execSQL($query);

            $this->reply(true);

        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }

    protected function getTemplateList() {
        global $CFG, $USER;

        try {
            $data = $this->request->data;
            $prefix = $CFG->prefix;

            $data = $this->request->data;
            $query = "select id, name, userid as userId, htmlstr as htmlStr, type, img from {$prefix}atto_reciteditor_templates 
                        where userid = $USER->id order by name ";

            $rst = $this->execSQL($query);

            $result = array('c' => array(), 'l' => array());
            while($obj = $rst->fetch_object()){
                $result[$obj->type][] = $obj;
            }

            $this->reply(true, $result);

        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }

    protected function deleteTemplate() {
        global $CFG;

        try {
            $data = $this->request->data;
            $prefix = $CFG->prefix;

            $data = $this->request->data;
            $query = "delete from {$prefix}atto_reciteditor_templates where id = $data->id";

            $this->execSQL($query);

            $this->reply(true);

        } catch (Exception $ex) {
            $this->reply(false, null, $ex->GetMessage());
        }
    }
}