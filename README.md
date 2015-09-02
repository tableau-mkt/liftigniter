LiftIgniter
==============
**Integrate the LiftIgniter recommendation service.**

Set which widgets are available as blocks via a Drupal admin page, which pulls from the LiftIgniter API.  Through their service you can create custom widgets or just a few standards.

## Display

Use front-end [Mustache](https://github.com/janl/mustache.js) templates to control rendering of data returned by LiftIgniter.
```handlebars
{{#items}}
<div class='recommended_item'>
  <a class='image-bg' href='{{url}}'
     style='background-image:url({{thumbnail}})'></a>
  <a class='headline' href='{{url}}'>{{title}}</a>
</div>
{{/items}}
```
Place somewhere like...

```
/sites/all/themes/my-theme/templates/default-widget.mst
```
or

```
/sites/all/themes/my-theme/my-widget.mst
```

Or load them from your own location.
```php
function my_module_liftigniter_templates_alter(&$locations) {
  // Add your module to the front of the list of template locations.
  array_unshift(
    $locations,
    drupal_get_path('module', 'my_module') . '/templates',
  );
}
```

## Extra Data

Data sent to LiftIgnitor is done through OpenGraph meta tags or LiftIgniter javascript tags.

OpenGraph options...
* [drupal.org/project/metatag](https://www.drupal.org/project/metatag)
* [drupal.org/project/opengraph_meta](https://www.drupal.org/project/opengraph_meta)
* [drupal.org/project/auto_opengraph](https://www.drupal.org/project/auto_opengraph)

Or borrow the [Data Layer](https://www.drupal.org/project/datalayer) details.

Or create your own custom metadata tags via the LiftIgniter SDK...
```html
<script id="liftigniter-metadata" type="application/json">
{
  "reviewCount": "158",
  "rating" : "4.2"
  "title" : "5 Cool Ways to Eat an Apple",
  "tags" : ["apple", "cool", "nutrition"]
}
</script>
```

## References

* [LiftIgniter API documentation](http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1)
