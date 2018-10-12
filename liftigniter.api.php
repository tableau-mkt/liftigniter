<?php

/**
 * @file
 * Code documentation for the LiftIgniter module.
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
 * /sites/all/modules/my_module/templates/liftigniter-my-widget.mst.
 */
function hook_liftigniter_templates_alter(&$locations) {
  // Add your module to the front of the list of template locations.
  array_unshift($locations, drupal_get_path('module', 'my_module') . '/templates');
}

/**
 * Adjust meta data sent to LiftIgniter.
 *
 * @param array &$data
 *   Metadata.
 * @param string $type
 *   Entity type.
 * @param Drupal\Core\Entity\EntityInterface $entity
 *   Entity object.
 */
function hook_liftigniter_meta_alter(array &$data, $type, Drupal\Core\Entity\EntityInterface $entity) {
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
 * Adjust widget settings data sent to LiftIgniter.
 *
 * @param array &$data
 *   Settings data.
 * @param string $widget_id
 *   Machine name of custom LiftIgniter block.
 */
function hook_liftigniter_settings_alter(array &$data, $widget_id) {
  if ($widget_id === 'blogwidget') {
    $settings['fields'] = ['title', 'bundle', 'language', 'url', 'thumbnail'];
  }

}

/**
 * Set your function as a post-JSON request processor.
 *
 * See liftigniter_preprocess_page().
 */
function hook_preprocess_page(&$variables) {
  // Transform data after receiving from LiftIgniter.
  $js_settings = 'Drupal.behaviors.my_module.liftIgniter';

  // Add the settings to the page.
  $variables['#attached']['drupalSettings']['liftIgniter']['transformCallback'][] = $js_settings;

}
