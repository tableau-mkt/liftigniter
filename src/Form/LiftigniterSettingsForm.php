<?php

namespace Drupal\liftigniter\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Implements the LiftIgniter settings form controller.
 */
class LiftigniterSettingsForm extends ConfigFormBase {

  /**
   * Constructs a SiteInformationForm object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    parent::__construct($config_factory);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'liftigniter_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['liftigniter.settings'];
  }

  /**
   * Build the settings form.
   *
   * @param array $form
   *   Default form array structure.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   Object containing current form state.
   *
   * @return array
   *   The render array defining the elements of the form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('liftigniter.settings');
    $form = [];

    $form['basic'] = [
      '#type' => 'details',
      '#title' => t('Basic'),
      '#open' => TRUE,
    ];
    $form['basic']['liftigniter_toggle'] = [
      '#type' => 'checkbox',
      '#title' => t('Glogal toggle'),
      '#default_value' => $config->get('liftigniter_toggle'),
      '#description' => t('Switch on and off all Lift Igniter output.'),
    ];
    $form['basic']['liftigniter_api_key'] = [
      '#type' => 'textfield',
      '#title' => t('Javascript API key'),
      '#size' => 25,
      '#default_value' => $config->get('liftigniter_api_key'),
      '#description' => t('Service API key for use within javascript.'),
    ];

    $datalayer_disabled = !\Drupal::moduleHandler()->moduleExists('datalayer');
    $form['basic']['liftigniter_metadata'] = [
      '#type' => 'checkbox',
      '#title' => t('Expose meta data'),
      '#default_value' => $config->get('liftigniter_metadata'),
      '#description' => t('Expose page entity meta data to LiftIgniter by enabling the <a href="@module_link">DataLayer module</a>.', [
        '@module_link' => 'https://www.drupal.org/project/datalayer',
      ]),
      '#disabled' => $datalayer_disabled,
    ];

    $form['basic']['liftigniter_customer_js_url'] = [
      '#type' => 'checkbox',
      '#title' => t('Customer script url'),
      '#default_value' => $config->get('liftigniter_customer_js_url'),
      '#description' => t('Optionally use the custom javascript url for your Lift Igniter account.'),
    ];
    $form['options'] = [
      '#type' => 'details',
      '#title' => t('Options'),
      '#open' => TRUE,
    ];

    $form['options']['liftigniter_max_items'] = [
      '#type' => 'textfield',
      '#title' => t('Max items'),
      '#size' => 5,
      '#default_value' => $config->get('liftigniter_max_items'),
      '#description' => t('Number of items displayed in widgets.'),
    ];

    $waypoints_disabled = !\Drupal::moduleHandler()->moduleExists('waypoints');
    $form['options']['liftigniter_waypoints'] = [
      '#type' => 'checkbox',
      '#title' => t('Use Waypoints'),
      '#default_value' => $config->get('liftigniter_waypoints'),
      '#description' => t('Enable <a href="@waypoints_link">Waypoints</a> library and <a href="@module_link">Drupal module</a> to delay looking up recommendations until scrolled to.', [
        '@waypoints_link' => 'https://github.com/imakewebthings/waypoints',
        '@module_link' => 'https://www.drupal.org/project/waypoints',
      ]),
      '#disabled' => $waypoints_disabled,
    ];

    $form['options']['liftigniter_use_language'] = [
      '#type' => 'checkbox',
      '#title' => t('Use page language'),
      '#default_value' => $config->get('liftigniter_use_language'),
      '#description' => t('Use the active page language when looking up recommendations.'),
      '#states' => [
        'visible' => [
          ':input[name="liftigniter_metadata"]' => [
            'checked' => TRUE,
          ],
        ],
      ],
    ];

    $form['options']['liftigniter_lang_default_no_prefix'] = [
      '#type' => 'checkbox',
      '#title' => t('No prefix default language'),
      '#default_value' => $config->get('liftigniter_lang_default_no_prefix'),
      '#description' => t('Request content only in the default site language on pages without a language prefix.'),
      '#states' => [
        'visible' => [
          ':input[name="liftigniter_use_language"]' => [
            'checked' => TRUE,
            'visible' => TRUE,
          ],
        ],
      ],
    ];

    $form['options']['liftigniter_force_same_protocol'] = [
      '#type' => 'checkbox',
      '#title' => t('Force same protocol'),
      '#default_value' => $config->get('liftigniter_force_same_protocol'),
      '#description' => t('Ensure all recommendations URLs are the same protocol as the displaying page.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $config = $this->config('liftigniter.settings');

    // Save the liftignitor form elements to configuration.
    foreach ($form_state->getValues() as $key => $value) {
      if (strpos($key, 'liftigniter') === FALSE) {
        continue;
      }
      $config->set($key, $value);
    }
    $config->save();
  }

}
