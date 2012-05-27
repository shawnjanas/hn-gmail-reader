(function() {
  var HackerNews, bootstrap,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HackerNews = (function() {
    function HackerNews() {
      console.log('HackerNews init');

      this.initNav = __bind(this.initNav, this);
      this.initHackerNews = __bind(this.initHackerNews, this);
      this.setRefreshInterval = __bind(this.setRefreshInterval, this);

      this.page = 1;
      this.pageNextId = '';
      this.readItems = {};
      this.canvas_frame = document.getElementById('canvas_frame');
      this.doc = this.canvas_frame.contentDocument;
      this.main_navigation = this.doc.querySelector(".n3");
      this.main_content = $(this.doc.querySelector(".AO")).find('.aeF').children();
      this.main_content_bar = this.doc.querySelector(".aeH");

      this.initHackerNews();
      this.initNav();

      this.setRefreshInterval();
    }

    HackerNews.prototype.initHackerNews = function() {
      _this = this;

      $('<div id="hackernews-stream" class="BltHke nH oy8Mbf" style="display: none;"></div>').prependTo(_this.main_content);
      $('<div id="hackernews-bar" class="D E G-atb" style="display: none;"><div class="nH aqK"><div class="Cq aqL" gh="mtb"><div><div><div class="G-Ni J-J5-Ji" style=""><div class="T-I J-J5-Ji nu T-I-ax7 L3" act="20" title="Refresh" role="button" tabindex="0"><div class="asa"><span class="J-J5-Ji ask">&nbsp;</span><div class="asf T-I-J3 J-J5-Ji"></div></div></div></div></div></div></div><div class="Cr aqJ"><div class="ar5 J-J5-Ji"><span class="Di"><div id=":160" class="J-J5-Ji amH"><span class="Dj"><b>1</b></span></div><div id=":162" class="T-I J-J5-Ji amD T-I-awG amE T-I-ax7 T-I-Js-IF L3" title="Newer" role="button" tabindex="0"><span class="amF">&nbsp;</span><img class="amI T-I-J3" src="images/cleardot.gif" alt=""></div><div id=":163" class="T-I J-J5-Ji amD T-I-awG T-I-ax7 T-I-Js-Gs L3" title="Older" role="button" tabindex="0"><span class="amF">&nbsp;</span><img class="amJ T-I-J3" src="images/cleardot.gif" alt=""></div></span></div></div></div></div>').prependTo(_this.main_content_bar);

      _this.refreshHN();

      // Refresh button click event
      $(_this.main_content_bar).find('#hackernews-bar .Cq.aqL').click(function() {
        console.log('Refresh Button Click');
        console.log(_this);
        _this.page = 1;
        _this.refreshHN();
      });

      $(_this.main_content_bar).find('#hackernews-bar [title="Newer"]').click(function() {
        if(_this.page > 1) {
          _this.page--;
          _this.refreshHN();
        }
      });

      $(_this.main_content_bar).find('#hackernews-bar [title="Older"]').click(function() {
        _this.page++;
        _this.refreshHN();
      });

      $(window).bind('hashchange', function() {
        hash = window.location.hash;
        if(hash == '#hackernews') {
          // Main Content Switch
          _this.main_content.find('[role="main"]').hide();
          _this.main_content.find('#hackernews-stream').show();

          // Main Content Bar Switch
          $(_this.main_content_bar).find('[gh="tm"]').hide();
          $(_this.main_content_bar).find('#hackernews-bar').show();

          // Remove Nav Highlighting
          $(_this.main_navigation).find('.LrBjie .ain').removeClass('ain');
          $(_this.main_navigation).find('.LrBjie .nZ').removeClass('nZ');

          _this.nav.parent().addClass('ain');
          _this.nav.addClass('nZ');

          _this.refreshHN();
        } else {
          _this.main_content.find('[role="main"]').show();
          _this.main_content.find('#hackernews-stream').hide();

          // Main Content Bar Switch
          $(_this.main_content_bar).find('[gh="tm"]').show();
          $(_this.main_content_bar).find('#hackernews-bar').hide();

          _this.nav.removeClass('nZ');
          _this.nav.parent().removeClass('ain');
        }
      });
    }

    HackerNews.prototype.initNav = function() {
      _this = this;
      $('<div class="LrBjie bbLinkWrapper"><div class="TK linkList"><div class="aim linkItem"><div class="TO aiq" id="hn"><div class="TN aY7xie aze link" style="margin-left:0px;"><div class="aio aip"><span class="nU CJ">Hacker News</span><span class="bentoBoxIndicator" style="margin-top:1px;"></span></div></div></div></div></div></div>').prependTo(this.main_navigation);
      
      this.nav = $(this.main_navigation).find('#hn.TO.aiq');
      this.nav.hover(function() {
        _this.nav.addClass('NQ');
      }, function() {
        _this.nav.removeClass('NQ');
      });

      this.nav.click(function() {
        console.log(_this.main_content);
        return window.location.hash = "#hackernews";
      });
    };

    HackerNews.prototype.refreshHN = function() {
      _this = this;
      chrome.extension.sendRequest({'type': 'loadHN', 'page': this.pageNextId}, function(res) {
        console.log(res);
        item_html = '<div class="Cp"><div><table cellpadding="0" id=":o4" class="F cf zt"><colgroup><col class="null"><col style="width:13ex" class="xX"><col class="xX"></colgroup><tbody>';

        res.items.forEach(function(item) {
          if(item.url.match(/^\//)) {
            s_url = item.url.split('/');
            item.url = 'http://news.ycombinator.com/item?id='+s_url[s_url.length-1];
          }

          readClass = _this.readItems[item.id] ? 'yO' : 'zE';

          item_html += '<tr class="zA '+readClass+'" id=":o3" href="'+item.url+'" item-id="'+item.id+'"><td id=":nx" tabindex="0" role="link" class="xY "><div class="xS"><div class="xT"><div class="y6"><span style="padding-left: 10px;" id=":nv"><b>'+item.title+'</b></span><span class="y2">&nbsp;<span dir="ltr">-</span>&nbsp;'+item.url+'</span></div></div></div></td><td class="xY" style="text-align:right;"><span id=":nu"><b>'+item.commentCount+' comments</b></span></td><td class="xY" style="text-align:right;padding-right: 10px;"><span id=":nu"><b>'+item.points+' points</b></span></td></tr>';
        });

        item_html += '</tbody></table></div></div>';

        console.log('Refresh');

        _this.pageNextId = res.nextId;
        console.log(res.nextId);
        $(_this.main_content_bar).find('.Dj b').html(_this.page);

        _this.main_content.find('#hackernews-stream').html(item_html);
        _this.main_content.find('.zA.zE').click(function() {
          _this.readItems[$(this).attr('item-id')] = true;
          $(this).removeClass('zE').addClass('yO');

          window.open($(this).attr('href'));
        });
      });
    }

    HackerNews.prototype.setRefreshInterval = function() {
      setInterval(this.refreshHN, 600000);
    };

    return HackerNews;
  })();

  bootstrap = function() {
    console.log('bootstrap');

    frame = document.getElementById('canvas_frame');

    console.log('Frame: ');
    console.log(frame);

    if(frame && frame.contentDocument &&
        frame.contentDocument.getElementsByClassName('nM').length > 0) {
      console.log('New HN');

      hackernews = new HackerNews;
      return hackernews;
    } else {
      console.log('Try Again...');
      return window.setTimeout(bootstrap, 200);
    }
  };

  bootstrap();
}).call(this);
