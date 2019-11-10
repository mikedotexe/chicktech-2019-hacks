<?php

/*
 * Get Icons List
 * List of icons to choose from options panel
*/
function omfe_get_icons_list() {
  $icons_list = array(
    'fa fa-star' => 'Star',
    'fa fa-heart' => 'Hearts',
    'fa fa-tree' => 'Trees',
    'fa fa-spin fa-tint' => 'Drops',
    'fa fa-spin fa-asterisk' => 'Asterisk',
  );

  $icons_list = apply_filters('omfe_icons_list', $icons_list);

  return $icons_list;
}

add_action('template_redirect', 'omfe_floating_icons_loaded');
function omfe_floating_icons_loaded() {

  global $omfe_opts, $post;

  $current_post_id =  isset($post->ID) ? strval($post->ID) : "";
  $show = true;

  $page_ids = isset($omfe_opts['choose_pages']) ? $omfe_opts['choose_pages'] : '';
  $page_ids = is_array($page_ids) ? $page_ids : array($page_ids);

  switch($omfe_opts['where_to_show']) {
    case 'everywhere': break;
    case 'onselected':
      if( isset($page_ids) AND is_array($page_ids) AND !in_array($current_post_id, $page_ids)) {
        $show = false;
      }
      break;
    case 'notonselected':
      if( isset($page_ids) AND is_array($page_ids) AND in_array($current_post_id, $page_ids)) {
        $show = false;
      }
      break;
    default: break;
  }
  if($show) {
    add_action('wp_footer','omfe_icons');
  }
}


add_shortcode('FLOATING_ICONS', 'omfe_icons');
function omfe_icons() {
  global $omfe_opts;

  $icon = isset($omfe_opts['icon']) ? $omfe_opts['icon'] : 'fa fa-heart';
  $color_1 = isset($omfe_opts['iconcolor-1']) ? $omfe_opts['iconcolor-1'] : '#ff0000';
  $color_2 = isset($omfe_opts['iconcolor-2']) ? $omfe_opts['iconcolor-2'] : '#ce0808';
  $color_3 = isset($omfe_opts['iconcolor-3']) ? $omfe_opts['iconcolor-3'] : '#f24646';
  $iconmax = isset($omfe_opts['iconmax']) ? $omfe_opts['iconmax'] : '25';
  $sinking_speed = isset($omfe_opts['sinking-speed']) ? $omfe_opts['sinking-speed'] : 0.6;
  $maxsize = isset($omfe_opts['maxsize']) ? $omfe_opts['maxsize'] : 20;
  $minsize = isset($omfe_opts['minsize']) ? $omfe_opts['minsize'] : 8;
  $zone = isset($omfe_opts['iconzone']) ? $omfe_opts['iconzone'] : 1;
  $class = isset($omfe_opts['iconarea-class']) ? $omfe_opts['iconarea-class'] : '';

  $icon_colors = array($color_1, $color_2, $color_3);
  $icon_colors = apply_filters('ofme_icon_colors', $icon_colors);

  $icon = apply_filters('omfe_icons', $icon);

  ?>
  <script type="text/javascript">
    var iconmax = "<?php echo $iconmax; ?>";
    var iconcolor = JSON.parse('<?php echo json_encode($icon_colors); ?>');
    var icontype = ['Times','Arial','Times','Verdana'];
    var iconletter = '<i class="<?php echo $icon; ?>"></i>';
    var sinkspeed = "<?php echo $sinking_speed; ?>";
    var iconmaxsize = "<?php echo $maxsize; ?>";
    var iconminsize = "<?php echo $minsize; ?>";
    var iconingzone = "<?php echo $zone; ?>";
    var selector = "<?php echo $class; ?>";
    console.log(iconmax+' '+iconcolor+' '+icontype+' '+iconletter+' '+sinkspeed+' '+iconmaxsize+' '+iconminsize+' '+iconingzone+' ' );
    var icon = [];
    var marginbottom = '';
    var marginright = '';
    var timer = '';
    var i_icon = 0;
    var x_mv = [];
    var crds = [];
    var lftrght = [];
    var browsersinfos = window.navigator.userAgent;
    var opera = browsersinfos.search(/Opera/);

    for (i=0;i<=iconmax;i++) {
      if(iconingzone==1) {
        jQuery(document.body).append("<span id='s"+i+"' style='position:absolute;top:-"+iconmaxsize+"'>"+iconletter+"</span>");
      }
      else if (iconingzone==2) {
        jQuery(selector).prepend("<span id='s"+i+"' style='position:relative;top:-"+iconmaxsize+"'>"+iconletter+"</span>");
      }
    }
    jQuery(document).ready(function(e){
      initicon();
    });
  </script>
<?php
}
?>