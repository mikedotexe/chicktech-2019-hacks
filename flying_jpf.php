<?php
/*
Plugin Name: Ojama Flying Sankocho
Plugin URI: http://strix.main.jp/?diys=flying-jpf
Description: This plugin shows desktop mascot that is the bird, flying Japanese Paradise Flycatcher painted simply.
Version: 1.0
Author: Hironori Masuda
Author URI: http://strix.main.jp/?page_id=16227
License: GPL2

Copyright 2016 Hironori Masuda (email : strix.ss@gmail.com)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

//delete_option('flying_sankocho_option');//既存のオプション値を強制的にデフォルトに戻す時使用

// クラスが定義済みか調べる
if ( ! class_exists( 'Ojama_Flying_sankocho' ) ) {

class Ojama_Flying_sankocho {

  private $current;
  private $default;
  private $ret_option;
  private $option_name;
  private $lang;
  private $loaded;

  public function __construct() {
    $this->option_name = 'flying_sankocho_option';
    $this->loaded = 0;
    $this->load_option();
  }

  private function load_option() {
    $this->default = array(//オプションのデフォルト値設定
      'onlypage' => '', //固定ページに限定する:page、シングルページに限定:single、トップページに限定:top、限定しない:''（空文字）、起動しない:noboot
      'directpage' => '', //特定の固定ページに限定、固定ページ名を入力
      'directcustom' => '',//特定のカスタム投稿に限定、カスタム投稿名を入力
      'blanktime' => '2',//sankochoが現れるまでの時間を秒数で指定、デフォルトは2秒
      'waittime' => '0',//ページが表示された後、マウスが指定秒数止まっていたら動き出す。その秒数を指定、デフォルトは0秒、上記のblanktimeが有効となる。
    );
    $this->current = get_option( $this->option_name );

    if ( false === $this->current ) {//初使用の時などオプションが設定されていない時
      update_option( $this->option_name, $this->default );//デフォルトでオプション設定
      $this->ret_option = $this->default;
    } elseif ( count( $this->current ) !== count( $this->default ) ) {//新規オプション増設時など既にあるオプションとデフォルトで数が違う時
      if ( count( $this->current ) > count( $this->default ) ) {//オプションの数を減らした時
        $newary = array_intersect_key( $this->current, $this->default );
      }else{
        $newary = $this->current;
      }
      $up_option = array_merge( $this->default, $newary );//ユーザー設定値で上書き

      update_option( $this->option_name, $up_option );
      $this->ret_option = $up_option;
    } else {
      $this->ret_option = $this->current;
    }

    //↓サイト読み込み時にプラグインのjqueryファイルとスタイルシートを登録
    add_action( 'wp_enqueue_scripts', array( $this, 'flyjpf_jq' ) );

    //↓サイト読み込み時にプラグインを表示するための<div>をwp_footerに登録
    add_action( 'wp_footer', array( $this, 'flyjpf_regist_footer' ) );

  }

  //↓ここから管理画面のメニューにオプション設定ページを登録する処理
  public function flyjpf_add_menu() {
    add_options_page( 'Flying Sankocho plugin Option', 'Flying Sankocho plugin Option', 'administrator', 'flyjpf_plugin_options', array( $this, 'flyjpf_page_output' ) );
    add_action( 'admin_init', array( $this, 'register_flyjpf_settings' ) );
  }

  public function register_flyjpf_settings() {
    register_setting( 'flyjpf-settings-group', $this->option_name );
  }

  public function flyjpf_page_output() {
    $this->lang = $this->lang_recognize();

    if ( 'ja' === $this->lang ) {
      $exp['ja'][0] = '&raquo; 自動起動しない';
      $exp['ja'][1] = '&raquo; 固定ページに限定';
      $exp['ja'][2] = '&raquo; シングルページに限定';
      $exp['ja'][3] = '&raquo; トップページに限定';
      $exp['ja'][4] = '&raquo; 限定を解除';
      $exp['ja'][5] = '&emsp;&gt;限定する固定ページをページ名で指定';
      $exp['ja'][6] = '&raquo; 限定するカスタム投稿ページをカスタム投稿名で指定';
      $exp['ja'][7] = '&raquo; 起動する待ち時間を秒数で指定。';
      $exp['ja'][8] = '自動起動しないに設定した場合、その他の設定は全て無視され起動しません。';
      $exp['ja'][9] = 'プラグインが起動するページを固定ページに限定。';
      $exp['ja'][10] = 'カスタム投稿指定においてシングルページ限定も設定した場合、カスタム投稿のシングルページ限定となります。その場合、固定ページ名での指定も有効となります。';
      //$exp['ja'][] = 'カスタム投稿指定時、シングルページ限定が設定されていない場合、他の全ての設定は無視されます。';
      $exp['ja'][11] = 'ページ名で固定ページを設定した場合、その他の設定は無視されます。';
      $exp['ja'][12] = 'direct_regist_flyjpf()をheader.phpテンプレートのwp_head()より前に記述することで、独自の条件づけにより表示するページを指定することができます。その場合待ち時間は有効です。';
      $exp['ja'][13] = '尚、プラグインをアンインストールする時は、プラグインページから実行すれば、<br>設定されたオプション値はデータベースから削除されます。';
      $exp['ja'][14] = '起動設定';
      $exp['ja'][15] = 'デフォルトは2秒、最高は60秒。';
      $exp['ja'][16] = '&raquo; ページ表示後、マウスに動きがあった後、マウスが指定秒間停止していたら起動。';
      $exp['ja'][17] = 'デフォルトは0秒でこの場合上記の起動する待ち時間が有効、最高は180秒。';
    } else {
      $exp['en'][0] = '&raquo; Don\'t start automatically';
      $exp['en'][1] = '&raquo; Only at "static" pages';
      $exp['en'][2] = '&raquo; Only at single page';
      $exp['en'][3] = '&raquo; Only at home';
      $exp['en'][4] = '&raquo; Start up all';
      $exp['en'][5] = '&emsp;&gt;You can specify one "static" page to run with the name of the "static" page.';
      $exp['en'][6] = '&raquo;You can specify the page of one custom-post to run with the name of custom-post.';
      $exp['en'][7] = '&raquo;The waiting time which Sankocho apear.';
      $exp['en'][8] = 'If you set this option, all your setting is ignored and plugin doesn\'t start.';
      $exp['en'][9] = 'If you set this option, plugin start up just page of "static" pages.';
      $exp['en'][10] = '&emsp;If you enter the name of  a custom-post with "Only at single page", your designation is the single page of custom-post';
      $exp['en'][11] = '&emsp;If you enter the name of a "static" page, other settings are ignored.';
      $exp['en'][12] = 'You can designate the running page by original conditioning to describe "ojama_flysankocho_regist()" before "wp_head()" in template of header.php. In that case, waiting time is effective. ';
      $exp['en'][13] = 'When the plug-in is uninstalled, the setted optional value is deleted from the data-base if uninstall executes on a plug-in page';
      $exp['en'][14] = 'Start up config';
      $exp['en'][15] = ' The number of seconds. Default is 2. highest value is 60';
      //$exp['en'][16] = 'When don't make any mouse movement for specified time after page loaded, JPF will apear.';
      $exp['en'][16] = 'After a page was displayed, JPF appears when a mouse is stopping while specified time after there was mouse movement.';
      $exp['en'][17] = ' The number of seconds. Default is 0, in this case the above waiting time becomes effective. highest value is 180';
    }
?>
    <div class="wrap">
      <h2>Flying Sankocho mascot option</h2>
      <h3>&laquo; <?php echo $exp[$this->lang][14]; ?> &raquo; </h3>
      <form method="post" action="options.php">
        <?php
          settings_fields( 'flyjpf-settings-group' );
          do_settings_sections( 'flyjpf-settings-group' );
        ?>
        <table class="form-table" style="color:blue;border:dotted 1px blue;">
          <tr><td><?php echo $exp[$this->lang][0]; ?></td><td><input type="radio" name="flying_sankocho_option[onlypage]" value="noboot"<?php echo ($this->ret_option['onlypage'] === 'noboot') ? ' checked' : ''; ?>></td></tr>
          <tr><td colspan="2" style="color:grey;">&emsp;*<?php echo $exp[$this->lang][8]; ?></td><td></td></tr>
          <tr><td><?php echo $exp[$this->lang][1]; ?></td><td><input type="radio" name="flying_sankocho_option[onlypage]" value="page"<?php echo ($this->ret_option['onlypage'] === 'page') ? ' checked' : ''; ?>></td></tr>
          <tr><td colspan="2" style="color:grey;">&emsp;*<?php echo $exp[$this->lang][9]; ?></td><td></td></tr>
          <tr><td><?php echo $exp[$this->lang][5]; ?></td><td><input type="text" name="flying_sankocho_option[directpage]" value="<?php echo esc_attr( $this->ret_option['directpage'] ); ?>"></td></tr>
          <tr><td colspan="2" style="color:grey;">&emsp;*<?php echo $exp[$this->lang][11]; ?></td><td></td></tr>
          <tr><td><?php echo $exp[$this->lang][6]; ?></td><td><input type="text" name="flying_sankocho_option[directcustom]" value="<?php echo esc_attr( $this->ret_option['directcustom'] ); ?>"></td></tr>
          <tr><td colspan="2" style="color:grey;">&emsp;*<?php echo $exp[$this->lang][10]; ?></td><td></td></tr>
          <tr><td><?php echo $exp[$this->lang][2]; ?></td><td><input type="radio" name="flying_sankocho_option[onlypage]" value="single"<?php echo ($this->ret_option['onlypage'] === 'single') ? ' checked' : ''; ?>></td></tr>
          <tr><td><?php echo $exp[$this->lang][3]; ?></td><td><input type="radio" name="flying_sankocho_option[onlypage]" value="top"<?php echo ($this->ret_option['onlypage'] === 'top') ? ' checked' : ''; ?>></td></tr>
          <tr><td><?php echo $exp[$this->lang][4]; ?></td><td><input type="radio" name="flying_sankocho_option[onlypage]" value=""<?php echo ($this->ret_option['onlypage'] === '') ? ' checked' : ''; ?>></td></tr>
          <tr><td><?php echo $exp[$this->lang][7]; ?></td><td><input type="number" name="flying_sankocho_option[blanktime]" value="<?php echo intval( $this->ret_option['blanktime'] ); ?>" min="2" max="60"></td></tr>
          <tr><td colspan="2" style="color:grey;">&emsp;*<?php echo $exp[$this->lang][15]; ?></td><td></td></tr>
          <tr><td><?php echo $exp[$this->lang][16]; ?></td><td><input type="number" name="flying_sankocho_option[waittime]" value="<?php echo intval( $this->ret_option['waittime'] ); ?>" min="0" max="180"></td></tr>
          <tr><td colspan="2" style="color:grey;">&emsp;*<?php echo $exp[$this->lang][17]; ?></td><td></td></tr>
        </table>
        <?php submit_button(); ?>
      </form>
        <p>*<?php echo $exp[$this->lang][12]; ?></p>
        <pre>
  &lt;?php
    if ( is_single( '17' ) ) { // e.g. single page of post->ID === 17
      if ( function_exists( 'ojama_flysankocho_regist' ) ) {
        ojama_flysankocho_regist();
      }
    }
  ?&gt;
  &lt;?php wp_head(); ?&gt;
        </pre>
        <p><?php echo $exp[$this->lang][13]; ?></p>

      </form>
    </div>
<?php
  }
  //↑ここまで

  //option設定により起動するページを選択する関数
  private function flyjpf_select() {
    $overrap = 0;
    $result = 0;

    if ( 'noboot' !== $this->ret_option['onlypage'] ) {
      if ( '' !== $this->ret_option['directcustom'] ) {
        if ( 'single' === $this->ret_option['onlypage'] ) {
          if ( is_singular( $this->ret_option['directcustom'] ) ) {
            $result = 1;
          }
        } elseif ( get_post_type() === $this->ret_option['directcustom'] ) {
            $result = 1;
          $overrap = 1;
        }
      } elseif ( '' === $this->ret_option['directpage'] ) {
        if ( 'page' === $this->ret_option['onlypage'] ) {
          if ( is_page() ) {
            $result = 1;
          }
        } elseif ( 'single' === $this->ret_option['onlypage'] ) {
          if ( is_single() ) {
            $result = 1;
          }
        } elseif ( 'top' === $this->ret_option['onlypage'] ) {
          if ( is_front_page() ) {
            $result = 1;
          }
        } else {
          $result = 1;
        }
      }

      if ( '' !== $this->ret_option['directpage'] ) {
        if ( is_page( $this->ret_option['directpage'] ) and 0 === $overrap) {
          $result = 1;
        }
      }
    }
    return $result;
  }

  //サイト読み込み時にプラグインのjqueryファイルとスタイルシートを登録する関数
  public function flyjpf_jq() {
    $showscript = $this->flyjpf_select();

    if ( 1 === $showscript ) {
      wp_enqueue_style( 'flying_jpf_style', plugins_url( 'flying_jpf.css', __FILE__ ), false, date( 'YmdHis', filemtime(plugin_dir_path( __FILE__ ).'flying_jpf.css' )), 'screen and (min-width: 770px)' );
      wp_enqueue_script( 'flyjpf_jq',plugins_url( 'flyjpf_jq.js', __FILE__ ), array( 'jquery' ), date( 'YmdHis', filemtime(plugin_dir_path( __FILE__ ).'flyjpf_jq.js' )),true);
    }
  }

  //サイト読み込み時にプラグインを表示するための<div>をwp_footerに登録
  public function flyjpf_regist_footer() {
    $showscript = $this->flyjpf_select();
    $addfooter = '';
    if ( 1 === $showscript and 0 === $this->loaded ) {
      $addfooter = '<div id="ojmsankocho" class="ojmwt' . $this->ret_option['waittime'] . '"><div id="ojmflysan" class="ojmsc' . $this->ret_option['blanktime'] . '"><div id="ojmsunlight"></div><div id="ojmlittleearth"></div></div></div>'."\n";
    }
    echo $addfooter;
  }

  public function getOption(){
    return $this->ret_option;
  }

  public function at_uninstall() {
    self::remove_option();
  }

  /*
  ↓この関数を呼び出すat_uninstallはregister_uninstall_hookから呼び出されるが、
  このフックは特殊な関数で呼ばれており、その時点ではこのプラグインクラスはコールされておらず、
  疑似変数$thisを使ったり、クラス内のグローバル変数を利用できない。
  それ故にオプション名に変数を使うことが出来ず、このremove_optionをstaticにして
  静的にat_uninstallから呼び出す必要がある。
  */
  private static function remove_option() {
    delete_option( 'flying_sankocho_option' );
  }

  private function lang_recognize() {
    $langs = explode( ',', $_SERVER['HTTP_ACCEPT_LANGUAGE'] );
    $langs = array_reverse( $langs );

    $result = '';

    foreach ($langs as $lang) {
      $lang = strtolower( $lang );
      if ( false !== strpos( $lang, 'ja' ) ) {
        $result = 'ja';
      } elseif ( false !== strpos( $lang, 'en' ) ) {
        $result = 'en';
      }
    }

    if ( '' === $result ) {
      $result = 'en';
    }
    return $result;
  }

  public function direct_flyjpf_jq() {//無条件にサイト読み込み時にプラグインのjqueryファイルを登録する関数
    wp_enqueue_style( 'flying_jpf_style', plugins_url( 'flying_jpf.css', __FILE__ ), false, date( 'YmdHis', filemtime(plugin_dir_path( __FILE__ ).'flying_jpf.css' )), 'screen and (min-width: 770px)' );
    wp_enqueue_script( 'flyjpf_jq',plugins_url( 'flyjpf_jq.js', __FILE__ ), array( 'jquery' ), date( 'YmdHis', filemtime(plugin_dir_path( __FILE__ ).'flyjpf_jq.js' )),true);
  }

  public function direct_flyjpf_regist_footer() {//無条件にサイト読み込み時に<div>をfooterに登録する関数
    echo '<div id="ojmsankocho" class="ojmwt' . $this->ret_option['waittime'] . '"><div id="ojmflysan" class="ojmsc' . $this->ret_option['blanktime'] . '"><div id="ojmsunlight"></div><div id="ojmlittleearth"></div></div></div>'."\n";
  }

  public function direct_regist_flyjpf() {//テンプレートに指定して起動させる関数
    $args = func_get_args();
    if ( func_num_args() > 0 ) {
      $this->ret_option = array_merge( $this->ret_option, $args[0] );
    }

    add_action( 'wp_enqueue_scripts', array( $this, 'direct_flyjpf_jq' ) );
    add_action( 'wp_footer', array( $this, 'direct_flyjpf_regist_footer' ) );
    $this->loaded = 1;
  }
}

}

$ojama_flying_sankocho_start = new Ojama_Flying_sankocho();

//↓管理画面のメニューにオプション設定ページを登録する処理
add_action( 'admin_menu', array( $ojama_flying_sankocho_start, 'flyjpf_add_menu' ) );

//プラグインを無効化した時にオプションを消去する場合
//register_deactivation_hook( __FILE__, array( 'Ojama_Flying_sankocho', 'at_uninstall' ) );

//アンインストールした時にオプションを消去する場合
if ( function_exists('register_uninstall_hook') ){
  register_uninstall_hook( __FILE__, array( 'Ojama_Flying_sankocho', 'at_uninstall' ) );
}

//テンプレートに指定して無条件で起動させる関数
function ojama_flysankocho_regist(){
  global $ojama_flying_sankocho_start;
  $rargs = array();
  $args = func_get_args();
  if ( func_num_args() > 0 ) {
    $rargs = $args[0];
  }
  $ojama_flying_sankocho_start->direct_regist_flyjpf( $rargs );
}
?>
