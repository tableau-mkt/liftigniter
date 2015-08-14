<?php
/**
 * @file Admin-only functionality.
 */

/**
 * Form callback for module configuration.
 */
function liftigniter_settings_form($form_state) {
  $form = array();

  if (!drupal_get_library('liftigniter')) {
    $form['#prefix'] = t('Javascript library not found, loading via remote CDN.');
  }


  $form['liftigniter_api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('API Key'),
    '#default_value' => variable_get('liftigniter_api_key', ''),
    '#description' => t('API key obtained through service provider.'),
  );

  return system_settings_form($form);
}
