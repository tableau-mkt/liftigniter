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
 * Declare entity meta data properties for output.
 *
 * @return array
 *   Values will be merged into entity data searched for and output.
 */
function hook_liftigniter_meta() {
  return array(
    'created';
  );
}


/**
 * Alter or add to meta data output.
 *
 * @param array &$data
 */
function hook_liftigniter_meta_alter(&$data) {
  // Add something.
  $menu_route = menu_get_active_trail();
  $data['menu-parent'] = $menu_route[1]['title'];

  // Change something.
  $bundle = $data['bundle'];
  $data['bundle'] = ($bundle === 'my_type') ? 'My Fancy Type' : $bundle;
}
