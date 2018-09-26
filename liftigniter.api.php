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
 * @param Entity $object
 */
function hook_liftigniter_meta_alter(&$data, $type, $obj, $entity_info) {
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

  // Add something.
  // @FIXME
// The active trail system has been removed in Drupal 8 because the routing and
// linking systems have been completely rewritten. You will need to rewrite this
// code to use the menu.active_trail service, or override the service if you need
// to alter the active trail.
// 
// 
// @see https://www.drupal.org/node/2240003
// $menu_route = menu_get_active_trail();

  $data['menu-parent'] = $menu_route[1]['title'];
}


/**
 * Set your function as a post-JSON request processor.
 */
function hook_preprocess_page(&$variables) {
  // Transform data after receiving from LiftIgniter.
  // @FIXME
// The Assets API has totally changed. CSS, JavaScript, and libraries are now
// attached directly to render arrays using the #attached property.
// 
// 
// @see https://www.drupal.org/node/2169605
// @see https://www.drupal.org/node/2408597
// drupal_add_js(array(
//     'liftIgniter' => array(
//       'transformCallback' => 'Drupal.behaviors.my_module.liftIgniter',
//     ), 'setting')
//   );

}
