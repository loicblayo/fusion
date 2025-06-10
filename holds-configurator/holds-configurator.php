<?php
/**
 * Plugin Name: Holds Configurator
 * Description: Configurateur 3D interactif basé sur Three.js pour prises d'escalade personnalisées.
 * Version: 1.0
 * Author: Loïc Blayo
 * Text Domain: holds-configurator
 * Domain Path: /languages
 */

defined('ABSPATH') or die( __( 'No direct access', 'holds-configurator' ) );

function holds_configurator_load_textdomain() {
    load_plugin_textdomain( 'holds-configurator', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'holds_configurator_load_textdomain' );

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

    wp_localize_script('holds-configurator', 'holdsConf', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('save_stl'),
    ]);
}
add_action('wp_enqueue_scripts', 'holds_configurator_enqueue_scripts');

function holds_configurator_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/configurator.php';
    return ob_get_clean();
}
add_shortcode('holds_configurator', 'holds_configurator_shortcode');

add_action('wp_ajax_nopriv_save_stl', 'holds_configurator_save_stl');
add_action('wp_ajax_save_stl', 'holds_configurator_save_stl');

function holds_configurator_save_stl() {
    check_ajax_referer('save_stl', 'nonce');

    $stl_data = isset($_POST['stl']) ? wp_unslash($_POST['stl']) : '';
    if (empty($stl_data)) {
        wp_send_json_error('No STL data');
    }

    $upload = wp_upload_dir();
    $dir = trailingslashit($upload['basedir']) . 'holds-configurator';
    if (!file_exists($dir)) {
        wp_mkdir_p($dir);
    }

    $filename = 'hold-' . uniqid() . '.stl';
    $filepath = trailingslashit($dir) . $filename;

    $result = file_put_contents($filepath, $stl_data);
    if ($result === false) {
        wp_send_json_error('Could not save file');
    }

    $url = trailingslashit($upload['baseurl']) . 'holds-configurator/' . $filename;
    wp_send_json_success(['url' => $url, 'path' => $filepath]);
}
