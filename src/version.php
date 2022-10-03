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
 * This atto plugin allows to build Bootstrap content without knowing HTML
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */
 
defined('MOODLE_INTERNAL') || die();

$plugin->version   = 2022100100;        // The current plugin version (Date: YYYYMMDDXX).
$plugin->requires  = 2020061500.00; // Moodle 3.9.0
$plugin->component = 'atto_reciteditor';  // Full name of the plugin (used for diagnostics).
$plugin->release = 'v1.17.1-beta';
$plugin->supported = [39, 400];      //  Moodle 3.9.x, 3.10.x and 3.11.x are supported.
$plugin->maturity = MATURITY_BETA; // MATURITY_ALPHA, MATURITY_BETA, MATURITY_RC or MATURITY_STABLE