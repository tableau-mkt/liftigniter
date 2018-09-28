<?php
/**
 * @file Code documentation for the LiftIgniter module.
 *
 * This file contains no working PHP code; it exists to provide additional
 * documentation for doxygen as well as to document hooks in the standard
 * Drupal manner.
 */


/**
 * Alter template suggestions before it's output for client-side rendering.
 *
 * Place your templates at:
 * /sites/all/modules/my_module/templates/liftigniter-default.mst
 * /sites/all/modules/my_module/templates/liftigniter-my-widget.mst
 */
function hook_liftigniter_templates_alter(&$locations) {
  // Add your module to the front of the list of template locations.
  array_unshift($locations, drupal_get_path('module', 'my_module') . '/templates');
}


/**
 * Adjust meta data sent to LiftIgniter.
 *
 * @param array &$data
 * @param string $type
 * @param Entity $entity
 */
function hook_liftigniter_meta_alter(&$data, $type, $entity) {
  if ($type === 'node') {

    // Simple swapping.
    switch ($object->bundle) {
      case 'my_type':
        $data['my-property'] = 'thing';
        $data['bundle'] = 'My Fancy Type';
        break;
      case 'another_type':
        $data['my-property'] = 'that';
        break;
    }
  }

}


/**
 * Set your function as a post-JSON request processor.
 */
function hook_preprocess_page(&$variables) {
  // Transform data after receiving from LiftIgniter.
  $js_settings = [
    'transformCallback' => 'Drupal.behaviors.my_module.liftIgniter',
  ];

  // Add the settings to the page.
  $variables['#attached']['drupalSettings']['liftIgniter'] = $js_settings;

}
