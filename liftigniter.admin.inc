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
    '#title' => t('API key'),
    '#default_value' => variable_get('liftigniter_api_key', ''),
    '#description' => t('API key obtained through service provider.'),
  );

  $form['liftigniter_max_items'] = array(
    '#type' => 'textfield',
    '#title' => t('Max items'),
    '#default_value' => variable_get('liftigniter_max_items', ''),
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
    '#default_value' => variable_get('liftigniter_widget_blocks', array()),
    '#options' => drupal_map_assoc(array('default')),
    '#attached' => array("
        var $elm = $('.form-item-widget-blocks');
        $elm.empty();
        $.each(Drupal.behaviors.liftIgniter.getWidgets(), function() {
          $elm.append($('<option></option>'').attr('value', this).text(this));
        });
      ",
      'inline',
    ),
  );

  return system_settings_form($form);
}
