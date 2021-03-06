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
  // if ($api_key = variable_get('liftigniter_api_key', '')) {
  //   drupal_http_request('https://query.petametrics.com/v1/model', array(
  //     'method' => 'GET',
  //     'headers' => array(
  //       'Content-Type' => 'application/json',
  //       'apiKey' => $api_key,
  //       'maxCount' => variable_get('liftigniter_max_items', 5)
  //     ),
  //   ));
  // }

  $form['basic'] = array(
    '#type' => 'fieldset',
    '#title' => t('Basic'),
  );
  $form['basic']['liftigniter_toggle'] = array(
    '#type' => 'checkbox',
    '#title' => t('Glogal toggle'),
    '#default_value' => variable_get('liftigniter_toggle', TRUE),
    '#description' => t('Switch on and off all Lift Igniter output.'),
  );
  $form['basic']['liftigniter_api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('Javascript API key'),
    '#size' => 25,
    '#default_value' => variable_get('liftigniter_api_key', ''),
    '#description' => t('Service API key for use within javascript.'),
  );
  if (!module_exists('datalayer')) {
    drupal_set_message(t('DataLayer module not yet avilable for entity meta data output.'), 'warning');
  }
  else {
    $form['basic']['liftigniter_metadata'] = array(
      '#type' => 'checkbox',
      '#title' => t('Expose meta data'),
      '#default_value' => variable_get('liftigniter_metadata', TRUE),
      '#description' => t('Expose page entity meta data (borrowing DataLayer module) to Lift Igniter.'),
    );
  }
  $form['basic']['liftigniter_customer_js_url'] = array(
    '#type' => 'checkbox',
    '#title' => t('Customer script url'),
    '#default_value' => variable_get('liftigniter_customer_js_url', FALSE),
    '#description' => t('Optionally use the custom javascript url for your Lift Igniter account.'),
  );
  $form['basic']['liftigniter_widget_blocks'] = array(
    '#type' => 'textfield',
    '#title' => 'Avaiable widgets',
    '#description' => t('List widget names to make available as blocks. Known: '),
    '#default_value' => variable_get('liftigniter_widget_blocks', LIFTIGNITER_DEFAULT_WIDGET),
    '#attached' => array('js' => array(
      array('type' => 'inline', 'data' => _liftigniter_get_script()),
      drupal_get_path('module', 'liftigniter') . '/liftigniter.js',
      drupal_get_path('module', 'liftigniter') . '/liftigniter-admin.js',
    )),
  );

  $form['options'] = array(
    '#type' => 'fieldset',
    '#title' => t('Options'),
  );

  $form['options']['liftigniter_max_items'] = array(
    '#type' => 'textfield',
    '#title' => t('Max items'),
    '#size' => 5,
    '#default_value' => variable_get('liftigniter_max_items', 5),
    '#description' => t('Number of items displayed in widgets.'),
  );

  if (!libraries_get_path('jquery-waypoints') && !libraries_get_path('waypoints')) {
    drupal_set_message(t(
      'Avoid recommendation loading until scrolling to the block(s) with the !waypoints library. There is a !module.', array(
        '!waypoints' => l('Waypoints', 'https://github.com/imakewebthings/waypoints'),
        '!module' => l('Drupal module', 'https://www.drupal.org/project/waypoints'),
    )), 'warning');
  }
  else {
    $form['options']['liftigniter_waypoints'] = array(
      '#type' => 'checkbox',
      '#title' => t('Use Waypoints'),
      '#default_value' => variable_get('liftigniter_waypoints', FALSE),
      '#description' => t('Use waypoints to delay looking up recommendations until scrolled-to.'),
    );
  }

  $form['options']['liftigniter_use_language'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use page language'),
    '#default_value' => variable_get('liftigniter_use_language', TRUE),
    '#description' => t('Use the active page language when looking up recommendations.'),
    '#states' => array(
      'enabled' => array(
        ':input[name="liftigniter_metadata"]' => array('checked' => TRUE),
      ),
    ),
  );

  $form['options']['liftigniter_lang_default_no_prefix'] = array(
    '#type' => 'checkbox',
    '#title' => t('No prefix default language'),
    '#default_value' => variable_get('liftigniter_lang_default_no_prefix', FALSE),
    '#description' => t('Request content only in the default site language on pages without a language prefix.'),
    '#states' => array(
      'enabled' => array(
        ':input[name="liftigniter_use_language"]' => array('checked' => TRUE),
      ),
    ),
  );

  $form['options']['liftigniter_force_same_protocol'] = array(
    '#type' => 'checkbox',
    '#title' => t('Force same protocol'),
    '#default_value' => variable_get('liftigniter_force_same_protocol', FALSE),
    '#description' => t('Ensure all recommendations URLs are the same protocol as the displaying page.'),
  );

  // @todo Provide admin settings for meta fields returned.
  // $form['liftigniter_request_fields'] = array(
  //   '#type' => 'textarea',
  //   '#title' => t('Request fields'),
  //   '#default_value' => variable_get('request_fields', ''),
  //   '#description' => t('Custom field list to request from API. Leave blank for defaults.'),
  // );

  return system_settings_form($form);
}
