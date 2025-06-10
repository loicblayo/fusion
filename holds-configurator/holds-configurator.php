<?php
/**
 * Plugin Name: Holds Configurator
 * Description: Configurateur 3D interactif basé sur Three.js pour prises d'escalade personnalisées.
 * Version: 1.0
 * Author: Loïc Blayo
 */

defined('ABSPATH') or die('No direct access');

function holds_configurator_enqueue_scripts() {
    // Utilisation de la version r147 de Three.js
    wp_enqueue_script(
        'three-js',
        plugin_dir_url(__FILE__) . 'assets/js/three.min.js',
        [],
        '0.147.0',
        true
    );

    // Add-ons locaux version r147 (fichiers dans assets/js/)
    wp_enqueue_script(
        'orbit-controls',
        plugin_dir_url(__FILE__) . 'assets/js/OrbitControls.js',
        ['three-js'],
        '0.147.0',
        true
    );
    wp_enqueue_script(
        'stl-exporter',
        plugin_dir_url(__FILE__) . 'assets/js/STLExporter.js',
        ['three-js'],
        '0.147.0',
        true
    );
    wp_enqueue_script(
        'simplex-noise',
        plugin_dir_url(__FILE__) . 'assets/js/simplex-noise.min.js',
        [],
        '2.4.0',
        true
    );
    wp_enqueue_script(
        'holds-configurator',
        plugin_dir_url(__FILE__) . 'assets/js/configurator.js',
        ['three-js', 'stl-exporter', 'orbit-controls'],
        '1.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'holds_configurator_enqueue_scripts');

function holds_configurator_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/configurator.php';
    return ob_get_clean();
}
add_shortcode('holds_configurator', 'holds_configurator_shortcode');
