spa.reddit = (function () {
  var
    configMap = {
      main_html: String() +
        '<div class="container spa-reddit">' +
          '<div class="form">' +
            '<div class="row">' +
              '<div class="form-group">' +
                '<div class="input-group spa-reddit-input-group">' +
                  '<span class="input-group-addon">https://www.reddit.com/r/</span>' +
                  '<input type="text" class="form-control spa-reddit-input">' +
                  '<div class="input-group-btn">' +
                    '<button type="button" class="btn btn-primary spa-reddit-get-button">Get</button>' +
                    '<button type="button" class="btn btn-default spa-reddit-clear-button">Clear</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="row">' +
            '<div class="container">' +
              '<div class="table-responsive">' +
                '<table class="table table-striped">' +
                  '<thead>' +
                    '<tr class="spa-reddit-table-header">' +
                      '<th>Title</th>' +
                      '<th>Author</th>' +
                      '<th>URL</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody class="spa-reddit-table-body">' +
                  '</tbody>' +
                '</table>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '<div>',
      base_url: 'https://www.reddit.com/r/',
      data_type: 'json'
    },
    stateMap = {
      $container:   null,
      full_url:     null,
      post_list:    null,
      return_data:  null,
      reddit_text:  null
    },
    jqueryMap = {},
    onGetClick, onClearClick,
    bindEvents, getPosts, setPosts, onRedditFocusOut,
    setJqueryMap, initModule;
  
  setJqueryMap = function () {
    var
      $container = stateMap.$container;
    
      jqueryMap = {
        $container:     $container,
        $get_button:    $container.find( '.spa-reddit-get-button' ),
        $clear_button:  $container.find( '.spa-reddit-clear-button' ),
        $table_header:  $container.find( '.spa-reddit-table-header' ),
        $table_body:    $container.find( '.spa-reddit-table-body' ),
        $reddit_input:  $container.find( '.spa-reddit-input' ),
        $input_group:   $container.find( '.spa-reddit-input-group' )
      };
  };

  getPosts = function () {
    $.ajax({
      url: stateMap.full_url
    }).done( setPosts );
  };
  
  setPosts = function ( res ) {
    jqueryMap.$table_body.empty();
    stateMap.post_list = res.data.children;
    stateMap.post_list.forEach(function ( o ) {
      var
        post = o.data,
        table_row;
      
      table_row = '<tr>' +
                    '<td>' + post.title + '</td>' +
                    '<td>' + post.author + '</td>' +
                    '<td>' + post.url + '</td>' +
                  '</tr>';
      
      jqueryMap.$table_body.append( table_row );
    });
  };
  
  onClearClick = function () {
    jqueryMap.$table_body.empty();
  };

  onGetClick = function () {
    if ( stateMap.reddit_text ) {
      stateMap.full_url = configMap.base_url +
        stateMap.reddit_text + '.' + configMap.data_type;
      getPosts();
    }
  };

  onRedditFocusOut = function () {
    stateMap.reddit_text = jqueryMap.$reddit_input.val();
    jqueryMap.$input_group.toggleClass('has-error', !stateMap.reddit_text);
  };
  
  bindEvents = function () {
    jqueryMap.$get_button.click( onGetClick );
    jqueryMap.$clear_button.click( onClearClick );
    jqueryMap.$reddit_input.focusout( onRedditFocusOut );
  };
  
  initModule = function ( $container ) {
    stateMap.$container = $container;
    $container.append( configMap.main_html );
    setJqueryMap();
    bindEvents();
  };
  
  return {
    initModule: initModule,
    stateMap: stateMap
  };
}());