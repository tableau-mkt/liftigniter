<?php
/**
 * @file Admin-only functionality.
 */

/**
 * Form callback for module configuration.
 */
function liftigniter_settings_form($form_state) {
  $form = array();
  // Check previous, note: assignment compare.
  if ($api_key = variable_get('liftigniter_api_key', '')) {
    drupal_http_request('https://query.petametrics.com/v1/model', array(
      'method' => 'GET',
      'headers' => array(
        'Content-Type' => 'application/json',
        'apiKey' => $api_key,
        'maxCount' => variable_get('liftigniter_max_items', 5)
      ),
    ));
  }

  // Extra notes.
  if (!drupal_get_library('liftigniter')) {
    drupal_set_message(t(
      'Avoid recommendation loading until scrolling to the block(s) with the !waypoints library', array(
        '!waypoints' => l('Waypoints', 'https://github.com/imakewebthings/waypoints')
    )), 'warning');
  }
  if (!drupal_get_library('liftigniter')) {
    $form['#prefix'] = t('Javascript library not found, loading via remote CDN.');
  }

  $form['liftigniter_api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('Javascript API key'),
    '#default_value' => $api_key,
    '#description' => t('Service API key for use within javascript.'),
  );

  $form['liftigniter_waypoints'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use Waypoints'),
    '#default_value' => variable_get('liftigniter_waypoints', ''),
    '#description' => t('Use waypoints to delay looking up recommendations until scrolled-to.'),
  );

  // $form['liftigniter_datalayer'] = array(
  //   '#type' => 'checkbox',
  //   '#title' => t('Send DataLayer details'),
  //   '#default_value' => variable_get('liftigniter_waypoints', ''),
  //   '#description' => t('Send page data from DataLayer to Lift Igniter.'),
  // );

  $form['liftigniter_max_items'] = array(
    '#type' => 'textfield',
    '#title' => t('Max items'),
    '#default_value' => variable_get('liftigniter_max_items', 5),
    '#description' => t('Number of items displayed in widgets.'),
  );

  $form['liftigniter_request_fields'] = array(
    '#type' => 'textarea',
    '#title' => t('Request fields'),
    '#default_value' => variable_get('request_fields', ''),
    '#description' => t('Custom field list to request from API. Leave blank for defaults.'),
  );

  $form['liftigniter_widget_blocks'] = array(
    '#type' => 'checkboxes',
    '#title' => 'Avaiable widgets',
    '#default_value' => variable_get('liftigniter_widget_blocks', array(LIFTIGNITER_DEFAULT_WIDGET)),
    '#options' => drupal_map_assoc(array(LIFTIGNITER_DEFAULT_WIDGET)),
    '#attached' => array('js' => array("
        var $elm = $('.form-item-widget-blocks');
        $elm.empty();
        $.each(Drupal.behaviors.liftIgniter.getWidgets(), function() {
          $elm.append($('<option>', {
            value: this,
            text: this
          });
        });
      ",
      array('type' => 'inline')
    )),
  );

  return system_settings_form($form);
}
