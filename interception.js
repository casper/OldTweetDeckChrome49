"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var PUBLIC_TOKENS = ['Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA', 'Bearer AAAAAAAAAAAAAAAAAAAAAF7aAAAAAAAASCiRjWvh7R5wxaKkFp7MM%2BhYBqM%3DbQ0JPmjU9F6ZoMhDfI4uTNAaQuTDm2uO9x3WFVr2xBZ2nhjdP0'];
var NEW_API = 'https://twitter.com/i/api/graphql';
var cursors = {};
function parseNoteTweet(result) {
  var text, entities;
  if (result.note_tweet.note_tweet_results.result) {
    var _result$note_tweet$no;
    text = result.note_tweet.note_tweet_results.result.text;
    entities = result.note_tweet.note_tweet_results.result.entity_set;
    if ((_result$note_tweet$no = result.note_tweet.note_tweet_results.result.richtext) !== null && _result$note_tweet$no !== void 0 && _result$note_tweet$no.richtext_tags.length) {
      entities.richtext = result.note_tweet.note_tweet_results.result.richtext.richtext_tags; // logically, richtext is an entity, right?
    }
  } else {
    text = result.note_tweet.note_tweet_results.text;
    entities = result.note_tweet.note_tweet_results.entity_set;
  }
  return {
    text: text,
    entities: entities
  };
}
function parseTweet(res) {
  if (_typeof(res) !== "object") return;
  if (res.limitedActionResults) {
    var limitation = res.limitedActionResults.limited_actions.find(function (l) {
      return l.action === "Reply";
    });
    if (limitation) {
      res.tweet.legacy.limited_actions_text = limitation.prompt ? limitation.prompt.subtext.text : "This tweet has limitations to who can reply.";
    }
    res = res.tweet;
  }
  if (!res.legacy && res.tweet) res = res.tweet;
  var tweet = res.legacy;
  if (!res.core) return;
  tweet.user = res.core.user_results.result.legacy;
  tweet.user.id_str = tweet.user_id_str;
  if (res.core.user_results.result.is_blue_verified) {
    tweet.user.verified = true;
    tweet.user.verified_type = "Blue";
  }
  if (tweet.retweeted_status_result) {
    var result = tweet.retweeted_status_result.result;
    if (result.limitedActionResults) {
      var _limitation = result.limitedActionResults.limited_actions.find(function (l) {
        return l.action === "Reply";
      });
      if (_limitation) {
        result.tweet.legacy.limited_actions_text = _limitation.prompt ? _limitation.prompt.subtext.text : "This tweet has limitations to who can reply.";
      }
      result = result.tweet;
    }
    if (result.quoted_status_result && result.quoted_status_result.result.legacy && result.quoted_status_result.result.core && result.quoted_status_result.result.core.user_results.result.legacy) {
      result.legacy.quoted_status = result.quoted_status_result.result.legacy;
      if (result.legacy.quoted_status) {
        result.legacy.quoted_status.user = result.quoted_status_result.result.core.user_results.result.legacy;
        result.legacy.quoted_status.user.id_str = result.legacy.quoted_status.user_id_str;
        if (result.quoted_status_result.result.core.user_results.result.is_blue_verified) {
          result.legacy.quoted_status.user.verified = true;
          result.legacy.quoted_status.user.verified_type = "Blue";
        }
      } else {
        console.warn("No retweeted quoted status", result);
      }
    }
    tweet.retweeted_status = result.legacy;
    if (tweet.retweeted_status && result.core.user_results.result.legacy) {
      tweet.retweeted_status.user = result.core.user_results.result.legacy;
      tweet.retweeted_status.user.id_str = tweet.retweeted_status.user_id_str;
      if (result.core.user_results.result.is_blue_verified) {
        tweet.retweeted_status.user.verified = true;
        tweet.retweeted_status.user.verified_type = "Blue";
      }
      tweet.retweeted_status.ext = {};
      if (result.views) {
        tweet.retweeted_status.ext.views = {
          r: {
            ok: {
              count: +result.views.count
            }
          }
        };
      }
      if (res.card && res.card.legacy && res.card.legacy.binding_values) {
        tweet.retweeted_status.card = res.card.legacy;
      }
    } else {
      console.warn("No retweeted status", result);
    }
    if (result.note_tweet && result.note_tweet.note_tweet_results) {
      var note = parseNoteTweet(result);
      tweet.retweeted_status.full_text = note.text;
      tweet.retweeted_status.entities = note.entities;
      tweet.retweeted_status.display_text_range = undefined; // no text range for long tweets
    }
  }

  if (res.quoted_status_result) {
    tweet.quoted_status_result = res.quoted_status_result;
  }
  if (res.note_tweet && res.note_tweet.note_tweet_results) {
    var _note = parseNoteTweet(res);
    tweet.full_text = _note.text;
    tweet.entities = _note.entities;
    tweet.display_text_range = undefined; // no text range for long tweets
  }

  if (tweet.quoted_status_result) {
    var _result = tweet.quoted_status_result.result;
    if (!_result.core && _result.tweet) _result = _result.tweet;
    if (_result.limitedActionResults) {
      var _limitation2 = _result.limitedActionResults.limited_actions.find(function (l) {
        return l.action === "Reply";
      });
      if (_limitation2) {
        _result.tweet.legacy.limited_actions_text = _limitation2.prompt ? _limitation2.prompt.subtext.text : "This tweet has limitations to who can reply.";
      }
      _result = _result.tweet;
    }
    tweet.quoted_status = _result.legacy;
    if (tweet.quoted_status) {
      tweet.quoted_status.user = _result.core.user_results.result.legacy;
      if (!tweet.quoted_status.user) {
        delete tweet.quoted_status;
      } else {
        tweet.quoted_status.user.id_str = tweet.quoted_status.user_id_str;
        if (_result.core.user_results.result.is_blue_verified) {
          tweet.quoted_status.user.verified = true;
          tweet.quoted_status.user.verified_type = "Blue";
        }
        tweet.quoted_status.ext = {};
        if (_result.views) {
          tweet.quoted_status.ext.views = {
            r: {
              ok: {
                count: +_result.views.count
              }
            }
          };
        }
      }
    } else {
      console.warn("No quoted status", _result);
    }
  }
  if (res.card && res.card.legacy) {
    tweet.card = res.card.legacy;
    var bvo = {};
    for (var i = 0; i < tweet.card.binding_values.length; i++) {
      var bv = tweet.card.binding_values[i];
      bvo[bv.key] = bv.value;
    }
    tweet.card.binding_values = bvo;
  }
  if (res.views) {
    if (!tweet.ext) tweet.ext = {};
    tweet.ext.views = {
      r: {
        ok: {
          count: +res.views.count
        }
      }
    };
  }
  if (res.source) {
    tweet.source = res.source;
  }
  if (res.birdwatch_pivot) {
    // community notes
    tweet.birdwatch = res.birdwatch_pivot;
  }
  if (tweet.favorited && tweet.favorite_count === 0) {
    tweet.favorite_count = 1;
  }
  if (tweet.retweeted && tweet.retweet_count === 0) {
    tweet.retweet_count = 1;
  }
  return tweet;
}
function getCurrentUserId() {
  var accounts = TD.storage.accountController.getAll();
  var screen_name = TD.storage.accountController.getUserIdentifier();
  var account = accounts.find(function (account) {
    return account.state.username === screen_name;
  });
  return account.state.userId;
}
function generateParams(features, variables, fieldToggles) {
  var params = new URLSearchParams();
  params.append('variables', JSON.stringify(variables));
  params.append('features', JSON.stringify(features));
  if (fieldToggles) params.append('fieldToggles', JSON.stringify(fieldToggles));
  return params.toString();
}
var counter = 0;
var OriginalXHR = XMLHttpRequest;
var proxyRoutes = [{
  path: '/1.1/statuses/user_timeline.json',
  method: 'GET',
  beforeRequest: function beforeRequest(xhr) {
    try {
      var url = new URL(xhr.modUrl);
      var params = new URLSearchParams(url.search);
      var user_id = params.get('user_id');
      var variables = {
        "count": 20,
        "includePromotedContent": false,
        "withQuickPromoteEligibilityTweetFields": false,
        "withVoice": true,
        "withV2Timeline": true
      };
      var features = {
        "rweb_lists_timeline_redesign_enabled": false,
        "responsive_web_graphql_exclude_directive_enabled": true,
        "verified_phone_label_enabled": false,
        "creator_subscriptions_tweet_preview_api_enabled": true,
        "responsive_web_graphql_timeline_navigation_enabled": true,
        "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
        "tweetypie_unmention_optimization_enabled": true,
        "responsive_web_edit_tweet_api_enabled": true,
        "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
        "view_counts_everywhere_api_enabled": true,
        "longform_notetweets_consumption_enabled": true,
        "responsive_web_twitter_article_tweet_consumption_enabled": false,
        "tweet_awards_web_tipping_enabled": false,
        "freedom_of_speech_not_reach_fetch_enabled": true,
        "standardized_nudges_misinfo": true,
        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
        "longform_notetweets_rich_text_read_enabled": true,
        "longform_notetweets_inline_media_enabled": true,
        "responsive_web_media_download_video_enabled": false,
        "responsive_web_enhance_cards_enabled": false
      };
      if (!user_id) {
        variables.userId = getCurrentUserId();
      } else {
        variables.userId = user_id;
      }
      var max_id = params.get('max_id');
      if (max_id) {
        var bn = BigInt(params.get('max_id'));
        bn += BigInt(1);
        if (cursors["".concat(variables.userId, "-").concat(bn)]) {
          variables.cursor = cursors["".concat(variables.userId, "-").concat(bn)];
        }
      }
      xhr.storage.user_id = variables.userId;
      xhr.modUrl = "".concat(NEW_API, "/wxoVeDnl0mP7VLhe6mTOdg/UserTweetsAndReplies?").concat(generateParams(features, variables));
    } catch (e) {
      console.error(e);
    }
  },
  beforeSendHeaders: function beforeSendHeaders(xhr) {
    xhr.modReqHeaders['Content-Type'] = 'application/json';
    xhr.modReqHeaders['X-Twitter-Active-User'] = 'yes';
    xhr.modReqHeaders['X-Twitter-Client-Language'] = 'en';
    xhr.modReqHeaders['Authorization'] = localStorage.abuseAPIkeys == '1' ? PUBLIC_TOKENS[counter++ % 2] : PUBLIC_TOKENS[0];
    delete xhr.modReqHeaders['X-Twitter-Client-Version'];
  },
  afterRequest: function afterRequest(xhr) {
    try {
      data = JSON.parse(xhr.responseText);
    } catch (e) {
      console.error(e);
      return [];
    }
    if (data.errors && data.errors[0]) {
      return [];
    }
    var instructions = data.data.user.result.timeline_v2.timeline.instructions;
    var entries = instructions.find(function (e) {
      return e.type === "TimelineAddEntries";
    });
    if (!entries) {
      return [];
    }
    entries = entries.entries;
    var tweets = [];
    var _iterator = _createForOfIteratorHelper(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.entryId.startsWith("tweet-")) {
          var _result2 = entry.content.itemContent.tweet_results.result;
          var tweet = parseTweet(_result2);
          if (tweet) {
            tweets.push(tweet);
          }
        } else if (entry.entryId.startsWith("profile-conversation-")) {
          var items = entry.content.items;
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var _result3 = item.item.itemContent.tweet_results.result;
            if (item.entryId.includes("-tweet-")) {
              var _tweet = parseTweet(_result3);
              if (_tweet && _tweet.user.id_str === xhr.storage.user_id) {
                tweets.push(_tweet);
              }
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (tweets.length === 0) return tweets;

    // i didn't know they return tweets unsorted???
    tweets.sort(function (a, b) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    var cursor = entries.find(function (e) {
      return e.entryId.startsWith("sq-cursor-bottom-") || e.entryId.startsWith("cursor-bottom-");
    }).content.value;
    if (cursor) {
      cursors["".concat(xhr.storage.user_id, "-").concat(tweets[tweets.length - 1].id_str)] = cursor;
    }
    var pinEntry = instructions.find(function (e) {
      return e.type === "TimelinePinEntry";
    });
    if (pinEntry && pinEntry.entry && pinEntry.entry.content && pinEntry.entry.content.itemContent) {
      var result = pinEntry.entry.content.itemContent.tweet_results.result;
      var pinnedTweet = parseTweet(result);
      if (pinnedTweet) {
        var tweetTimes = tweets.map(function (t) {
          return [t.id_str, new Date(t.created_at).getTime()];
        });
        tweetTimes.push([pinnedTweet.id_str, new Date(pinnedTweet.created_at).getTime()]);
        tweetTimes.sort(function (a, b) {
          return b[1] - a[1];
        });
        var index = tweetTimes.findIndex(function (t) {
          return t[0] === pinnedTweet.id_str;
        });
        if (index !== tweets.length) {
          tweets.splice(index, 0, pinnedTweet);
        }
      }
    }
    return tweets;
  }
}, {
  path: '/1.1/search/universal.json',
  method: 'GET',
  beforeRequest: function beforeRequest(xhr) {
    try {
      var url = new URL(xhr.modUrl);
      var params = new URLSearchParams(url.search);
      var variables = {
        rawQuery: params.get('q'),
        count: 40,
        querySource: 'typed_query',
        product: "Latest"
      };
      var features = {
        "rweb_lists_timeline_redesign_enabled": false,
        "responsive_web_graphql_exclude_directive_enabled": true,
        "verified_phone_label_enabled": false,
        "creator_subscriptions_tweet_preview_api_enabled": true,
        "responsive_web_graphql_timeline_navigation_enabled": true,
        "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
        "tweetypie_unmention_optimization_enabled": true,
        "responsive_web_edit_tweet_api_enabled": true,
        "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
        "view_counts_everywhere_api_enabled": true,
        "longform_notetweets_consumption_enabled": true,
        "responsive_web_twitter_article_tweet_consumption_enabled": false,
        "tweet_awards_web_tipping_enabled": false,
        "freedom_of_speech_not_reach_fetch_enabled": true,
        "standardized_nudges_misinfo": true,
        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
        "longform_notetweets_rich_text_read_enabled": true,
        "longform_notetweets_inline_media_enabled": true,
        "responsive_web_media_download_video_enabled": false,
        "responsive_web_enhance_cards_enabled": false
      };
      xhr.modUrl = "".concat(NEW_API, "/nK1dw4oV3k4w5TdtcAdSww/SearchTimeline?").concat(generateParams(features, variables));
    } catch (e) {
      console.error(e);
    }
  },
  beforeSendHeaders: function beforeSendHeaders(xhr) {
    xhr.modReqHeaders['Content-Type'] = 'application/json';
    xhr.modReqHeaders['X-Twitter-Active-User'] = 'yes';
    xhr.modReqHeaders['X-Twitter-Client-Language'] = 'en';
    xhr.modReqHeaders['Authorization'] = localStorage.abuseAPIkeys == '1' ? PUBLIC_TOKENS[counter++ % 2] : PUBLIC_TOKENS[0];
    delete xhr.modReqHeaders['X-Twitter-Client-Version'];
  },
  afterRequest: function afterRequest(xhr) {
    try {
      data = JSON.parse(xhr.responseText);
    } catch (e) {
      console.error(e);
      return [];
    }
    if (data.errors && data.errors[0]) {
      return [];
    }
    var instructions = data.data.search_by_raw_query.search_timeline.timeline.instructions;
    var entries = instructions.find(function (i) {
      return i.entries;
    });
    if (!entries) {
      return [];
    }
    entries = entries.entries;
    var res = [];
    var _iterator2 = _createForOfIteratorHelper(entries),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var entry = _step2.value;
        if (entry.entryId.startsWith('sq-I-t-') || entry.entryId.startsWith('tweet-')) {
          var result = entry.content.itemContent.tweet_results.result;
          if (entry.content.itemContent.promotedMetadata) {
            continue;
          }
          var tweet = parseTweet(result);
          if (!tweet) {
            continue;
          }
          res.push(tweet);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var cursor = entries.find(function (e) {
      return e.entryId.startsWith('sq-cursor-bottom-') || e.entryId.startsWith('cursor-bottom-');
    });
    if (cursor) {
      cursor = cursor.content.value;
    } else {
      cursor = instructions.find(function (e) {
        return e.entry_id_to_replace && (e.entry_id_to_replace.startsWith('sq-cursor-bottom-') || e.entry_id_to_replace.startsWith('cursor-bottom-'));
      });
      if (cursor) {
        cursor = cursor.entry.content.value;
      } else {
        cursor = null;
      }
    }
    return {
      metadata: {
        cursor: cursor,
        refresh_interval_in_sec: 30
      },
      modules: res.map(function (t) {
        return {
          status: {
            data: t
          }
        };
      })
    };
  }
}, {
  path: '/1.1/users/search.json',
  method: 'GET',
  beforeRequest: function beforeRequest(xhr) {
    try {
      var url = new URL(xhr.modUrl);
      var params = new URLSearchParams(url.search);
      var variables = {
        rawQuery: params.get('q'),
        count: 20,
        querySource: 'typed_query',
        product: "People"
      };
      var features = {
        "rweb_lists_timeline_redesign_enabled": false,
        "responsive_web_graphql_exclude_directive_enabled": true,
        "verified_phone_label_enabled": false,
        "creator_subscriptions_tweet_preview_api_enabled": true,
        "responsive_web_graphql_timeline_navigation_enabled": true,
        "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
        "tweetypie_unmention_optimization_enabled": true,
        "responsive_web_edit_tweet_api_enabled": true,
        "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
        "view_counts_everywhere_api_enabled": true,
        "longform_notetweets_consumption_enabled": true,
        "responsive_web_twitter_article_tweet_consumption_enabled": false,
        "tweet_awards_web_tipping_enabled": false,
        "freedom_of_speech_not_reach_fetch_enabled": true,
        "standardized_nudges_misinfo": true,
        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
        "longform_notetweets_rich_text_read_enabled": true,
        "longform_notetweets_inline_media_enabled": true,
        "responsive_web_media_download_video_enabled": false,
        "responsive_web_enhance_cards_enabled": false
      };
      xhr.modUrl = "".concat(NEW_API, "/nK1dw4oV3k4w5TdtcAdSww/SearchTimeline?").concat(generateParams(features, variables));
    } catch (e) {
      console.error(e);
    }
  },
  beforeSendHeaders: function beforeSendHeaders(xhr) {
    xhr.modReqHeaders['Content-Type'] = 'application/json';
    xhr.modReqHeaders['X-Twitter-Active-User'] = 'yes';
    xhr.modReqHeaders['X-Twitter-Client-Language'] = 'en';
    xhr.modReqHeaders['Authorization'] = localStorage.abuseAPIkeys == '1' ? PUBLIC_TOKENS[counter++ % 2] : PUBLIC_TOKENS[0];
    delete xhr.modReqHeaders['X-Twitter-Client-Version'];
  },
  afterRequest: function afterRequest(xhr) {
    try {
      data = JSON.parse(xhr.responseText);
    } catch (e) {
      console.error(e);
      return [];
    }
    if (data.errors && data.errors[0]) {
      return [];
    }
    var instructions = data.data.search_by_raw_query.search_timeline.timeline.instructions;
    var entries = instructions.find(function (i) {
      return i.entries;
    });
    if (!entries) {
      return [];
    }
    entries = entries.entries;
    var res = [];
    var _iterator3 = _createForOfIteratorHelper(entries),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var entry = _step3.value;
        if (entry.entryId.startsWith('sq-I-u-') || entry.entryId.startsWith("user-")) {
          var result = entry.content.itemContent.user_results.result;
          if (!result || !result.legacy) {
            console.log("Bug: no user", entry);
            continue;
          }
          var user = result.legacy;
          user.id_str = result.rest_id;
          res.push(user);
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var cursor = entries.find(function (e) {
      return e.entryId.startsWith('sq-cursor-bottom-') || e.entryId.startsWith('cursor-bottom-');
    });
    if (cursor) {
      cursor = cursor.content.value;
    } else {
      cursor = instructions.find(function (e) {
        return e.entry_id_to_replace && (e.entry_id_to_replace.startsWith('sq-cursor-bottom-') || e.entry_id_to_replace.startsWith('cursor-bottom-'));
      });
      if (cursor) {
        cursor = cursor.entry.content.value;
      } else {
        cursor = null;
      }
    }
    return res;
  }
}];

// wrap the XMLHttpRequest
XMLHttpRequest = function XMLHttpRequest() {
  return new Proxy(new OriginalXHR(), {
    open: function open(method, url, async) {
      var username = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var password = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      this.modMethod = method;
      this.modUrl = url;
      this.originalUrl = url;
      this.modReqHeaders = {};
      this.storage = {};
      try {
        var parsedUrl = new URL(url);
        this.proxyRoute = proxyRoutes.find(function (route) {
          return route.path === parsedUrl.pathname && route.method.toUpperCase() === method.toUpperCase();
        });
      } catch (e) {
        console.error(e);
      }
      if (this.proxyRoute && this.proxyRoute.beforeRequest) {
        this.proxyRoute.beforeRequest(this);
      }
      this.open(method, this.modUrl, async, username, password);
    },
    setRequestHeader: function setRequestHeader(name, value) {
      this.modReqHeaders[name] = value;
    },
    send: function send() {
      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (this.proxyRoute && this.proxyRoute.beforeSendHeaders) {
        this.proxyRoute.beforeSendHeaders(this);
      }
      for (var _i = 0, _Object$entries = Object.entries(this.modReqHeaders); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        this.setRequestHeader(name, value);
      }
      this.send(body);
    },
    get: function get(xhr, key) {
      if (!key in xhr) return undefined;
      if (key === 'responseText') return this.interceptResponseText(xhr);
      var value = xhr[key];
      if (typeof value === "function") {
        value = this[key] || value;
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return value.apply(xhr, args);
        };
      } else {
        return value;
      }
    },
    set: function set(xhr, key, value) {
      if (key in xhr) {
        xhr[key] = value;
      }
      return value;
    },
    interceptResponseText: function interceptResponseText(xhr) {
      if (xhr.proxyRoute && xhr.proxyRoute.afterRequest) {
        var out = xhr.proxyRoute.afterRequest(xhr);
        if (_typeof(out) === "object") {
          return JSON.stringify(out);
        } else {
          return out;
        }
      }
      return xhr.responseText;
    }
  });
};

/*

const PUBLIC_TOKENS = [
    'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
    'Bearer AAAAAAAAAAAAAAAAAAAAAF7aAAAAAAAASCiRjWvh7R5wxaKkFp7MM%2BhYBqM%3DbQ0JPmjU9F6ZoMhDfI4uTNAaQuTDm2uO9x3WFVr2xBZ2nhjdP0'
];
const NEW_API = 'https://twitter.com/i/api/graphql';
const cursors = {};

function parseNoteTweet(result) {
    let text, entities;
    if(result.note_tweet.note_tweet_results.result) {
        text = result.note_tweet.note_tweet_results.result.text;
        entities = result.note_tweet.note_tweet_results.result.entity_set;
        if(result.note_tweet.note_tweet_results.result.richtext?.richtext_tags.length) {
            entities.richtext = result.note_tweet.note_tweet_results.result.richtext.richtext_tags // logically, richtext is an entity, right?
        }
    } else {
        text = result.note_tweet.note_tweet_results.text;
        entities = result.note_tweet.note_tweet_results.entity_set;
    }
    return {text, entities};
}

function parseTweet(res) {
    if(typeof res !== "object") return;
    if(res.limitedActionResults) {
        let limitation = res.limitedActionResults.limited_actions.find(l => l.action === "Reply");
        if(limitation) {
            res.tweet.legacy.limited_actions_text = limitation.prompt ? limitation.prompt.subtext.text : "This tweet has limitations to who can reply.";
        }
        res = res.tweet;
    }
    if(!res.legacy && res.tweet) res = res.tweet;
    let tweet = res.legacy;
    if(!res.core) return;
    tweet.user = res.core.user_results.result.legacy;
    tweet.user.id_str = tweet.user_id_str;
    if(res.core.user_results.result.is_blue_verified) {
        tweet.user.verified = true;
        tweet.user.verified_type = "Blue";
    }
    if(tweet.retweeted_status_result) {
        let result = tweet.retweeted_status_result.result;
        if(result.limitedActionResults) {
            let limitation = result.limitedActionResults.limited_actions.find(l => l.action === "Reply");
            if(limitation) {
                result.tweet.legacy.limited_actions_text = limitation.prompt ? limitation.prompt.subtext.text : "This tweet has limitations to who can reply.";
            }
            result = result.tweet;
        }
        if(
            result.quoted_status_result && 
            result.quoted_status_result.result.legacy &&
            result.quoted_status_result.result.core &&
            result.quoted_status_result.result.core.user_results.result.legacy    
        ) {
            result.legacy.quoted_status = result.quoted_status_result.result.legacy;
            if(result.legacy.quoted_status) {
                result.legacy.quoted_status.user = result.quoted_status_result.result.core.user_results.result.legacy;
                result.legacy.quoted_status.user.id_str = result.legacy.quoted_status.user_id_str;
                if(result.quoted_status_result.result.core.user_results.result.is_blue_verified) {
                    result.legacy.quoted_status.user.verified = true;
                    result.legacy.quoted_status.user.verified_type = "Blue";
                }
            } else {
                console.warn("No retweeted quoted status", result);
            }
        }
        tweet.retweeted_status = result.legacy;
        if(tweet.retweeted_status && result.core.user_results.result.legacy) {
            tweet.retweeted_status.user = result.core.user_results.result.legacy;
            tweet.retweeted_status.user.id_str = tweet.retweeted_status.user_id_str;
            if(result.core.user_results.result.is_blue_verified) {
                tweet.retweeted_status.user.verified = true;
                tweet.retweeted_status.user.verified_type = "Blue";
            }
            tweet.retweeted_status.ext = {};
            if(result.views) {
                tweet.retweeted_status.ext.views = {r: {ok: {count: +result.views.count}}};
            }
            if(res.card && res.card.legacy && res.card.legacy.binding_values) {
                tweet.retweeted_status.card = res.card.legacy;
            }
        } else {
            console.warn("No retweeted status", result);
        }
        if(result.note_tweet && result.note_tweet.note_tweet_results) {
            let note = parseNoteTweet(result);
            tweet.retweeted_status.full_text = note.text;
            tweet.retweeted_status.entities = note.entities;
            tweet.retweeted_status.display_text_range = undefined; // no text range for long tweets
        }
    }

    if(res.quoted_status_result) {
        tweet.quoted_status_result = res.quoted_status_result;
    }
    if(res.note_tweet && res.note_tweet.note_tweet_results) {
        let note = parseNoteTweet(res);
        tweet.full_text = note.text;
        tweet.entities = note.entities;
        tweet.display_text_range = undefined; // no text range for long tweets
    }
    if(tweet.quoted_status_result) {
        let result = tweet.quoted_status_result.result;
        if(!result.core && result.tweet) result = result.tweet;
        if(result.limitedActionResults) {
            let limitation = result.limitedActionResults.limited_actions.find(l => l.action === "Reply");
            if(limitation) {
                result.tweet.legacy.limited_actions_text = limitation.prompt ? limitation.prompt.subtext.text : "This tweet has limitations to who can reply.";
            }
            result = result.tweet;
        }
        tweet.quoted_status = result.legacy;
        if(tweet.quoted_status) {
            tweet.quoted_status.user = result.core.user_results.result.legacy;
            if(!tweet.quoted_status.user) {
                delete tweet.quoted_status;
            } else {
                tweet.quoted_status.user.id_str = tweet.quoted_status.user_id_str;
                if(result.core.user_results.result.is_blue_verified) {
                    tweet.quoted_status.user.verified = true;
                    tweet.quoted_status.user.verified_type = "Blue";
                }
                tweet.quoted_status.ext = {};
                if(result.views) {
                    tweet.quoted_status.ext.views = {r: {ok: {count: +result.views.count}}};
                }
            }
        } else {
            console.warn("No quoted status", result);
        }
    }
    if(res.card && res.card.legacy) {
        tweet.card = res.card.legacy;
        let bvo = {};
        for(let i = 0; i < tweet.card.binding_values.length; i++) {
            let bv = tweet.card.binding_values[i];
            bvo[bv.key] = bv.value;
        }
        tweet.card.binding_values = bvo;
    }
    if(res.views) {
        if(!tweet.ext) tweet.ext = {};
        tweet.ext.views = {r: {ok: {count: +res.views.count}}};
    }
    if(res.source) {
        tweet.source = res.source;
    }
    if(res.birdwatch_pivot) { // community notes
        tweet.birdwatch = res.birdwatch_pivot;
    }

    if(tweet.favorited && tweet.favorite_count === 0) {
        tweet.favorite_count = 1;
    }
    if(tweet.retweeted && tweet.retweet_count === 0) {
        tweet.retweet_count = 1;
    }

    return tweet;
}

function getCurrentUserId() {
    let accounts = TD.storage.accountController.getAll();
    let screen_name = TD.storage.accountController.getUserIdentifier();
    let account = accounts.find(account => account.state.username === screen_name);
    return account.state.userId;
}

function generateParams(features, variables, fieldToggles) {
    let params = new URLSearchParams();
    params.append('variables', JSON.stringify(variables));
    params.append('features', JSON.stringify(features));
    if(fieldToggles) params.append('fieldToggles', JSON.stringify(fieldToggles));

    return params.toString();
}

let counter = 0;
const OriginalXHR = XMLHttpRequest;
const proxyRoutes = [
    {
        path: '/1.1/statuses/user_timeline.json',
        method: 'GET',
        beforeRequest: xhr => {
            try {
                let url = new URL(xhr.modUrl);
                let params = new URLSearchParams(url.search);
                let user_id = params.get('user_id');
                let variables = {"count":20,"includePromotedContent":false,"withQuickPromoteEligibilityTweetFields":false,"withVoice":true,"withV2Timeline":true};
                let features = {"rweb_lists_timeline_redesign_enabled":false,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_media_download_video_enabled":false,"responsive_web_enhance_cards_enabled":false};

                if(!user_id) {
                    variables.userId = getCurrentUserId();
                } else {
                    variables.userId = user_id;
                }
                let max_id = params.get('max_id');
                if(max_id) {
                    let bn = BigInt(params.get('max_id'));
                    bn += BigInt(1);
                    if(cursors[`${variables.userId}-${bn}`]) {
                        variables.cursor = cursors[`${variables.userId}-${bn}`];
                    }
                }
                xhr.storage.user_id = variables.userId;

                xhr.modUrl = `${NEW_API}/wxoVeDnl0mP7VLhe6mTOdg/UserTweetsAndReplies?${generateParams(features, variables)}`;
            } catch(e) {
                console.error(e);
            }
        },
        beforeSendHeaders: xhr => {
            xhr.modReqHeaders['Content-Type'] = 'application/json';
            xhr.modReqHeaders['X-Twitter-Active-User'] = 'yes';
            xhr.modReqHeaders['X-Twitter-Client-Language'] = 'en';
            xhr.modReqHeaders['Authorization'] = localStorage.abuseAPIkeys == '1' ? PUBLIC_TOKENS[(counter++) % 2] : PUBLIC_TOKENS[0];
            delete xhr.modReqHeaders['X-Twitter-Client-Version'];
        },
        afterRequest: xhr => {
            try {
                data = JSON.parse(xhr.responseText);
            } catch(e) {
                console.error(e);
                return [];
            }
            if (data.errors && data.errors[0]) {
                return [];
            }
            let instructions = data.data.user.result.timeline_v2.timeline.instructions;
            let entries = instructions.find(e => e.type === "TimelineAddEntries");
            if(!entries) {
                return [];
            }
            entries = entries.entries;
            let tweets = [];
            for(let entry of entries) {
                if(entry.entryId.startsWith("tweet-")) {
                    let result = entry.content.itemContent.tweet_results.result;
                    let tweet = parseTweet(result);
                    if(tweet) {
                        tweets.push(tweet);
                    }
                } else if(entry.entryId.startsWith("profile-conversation-")) {
                    let items = entry.content.items;
                    for(let i = 0; i < items.length; i++) {
                        let item = items[i];
                        let result = item.item.itemContent.tweet_results.result;
                        if(item.entryId.includes("-tweet-")) {
                            let tweet = parseTweet(result);
                            if(tweet && tweet.user.id_str === xhr.storage.user_id) {
                                tweets.push(tweet);
                            }
                        }
                    }
                }
            }

            if(tweets.length === 0) return tweets;

            // i didn't know they return tweets unsorted???
            tweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            let cursor = entries.find(e => e.entryId.startsWith("sq-cursor-bottom-") || e.entryId.startsWith("cursor-bottom-")).content.value;
            if(cursor) {
                cursors[`${xhr.storage.user_id}-${tweets[tweets.length-1].id_str}`] = cursor;
            }
            
            let pinEntry = instructions.find(e => e.type === "TimelinePinEntry");
            if(pinEntry && pinEntry.entry && pinEntry.entry.content && pinEntry.entry.content.itemContent) {
                let result = pinEntry.entry.content.itemContent.tweet_results.result;
                let pinnedTweet = parseTweet(result);
                if(pinnedTweet) {
                    let tweetTimes = tweets.map(t => [t.id_str, new Date(t.created_at).getTime()]);
                    tweetTimes.push([pinnedTweet.id_str, new Date(pinnedTweet.created_at).getTime()]);
                    tweetTimes.sort((a, b) => b[1] - a[1]);
                    let index = tweetTimes.findIndex(t => t[0] === pinnedTweet.id_str);
                    if(index !== tweets.length) {
                        tweets.splice(index, 0, pinnedTweet);
                    }
                }
            }

            return tweets;
        }
    },
    {
        path: '/1.1/search/universal.json',
        method: 'GET',
        beforeRequest: xhr => {
            try {
                let url = new URL(xhr.modUrl);
                let params = new URLSearchParams(url.search);
                let variables = {
                    rawQuery: params.get('q'),
                    count: 40,
                    querySource: 'typed_query',
                    product: "Latest",
                };
                let features = {"rweb_lists_timeline_redesign_enabled":false,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_media_download_video_enabled":false,"responsive_web_enhance_cards_enabled":false};

                xhr.modUrl = `${NEW_API}/nK1dw4oV3k4w5TdtcAdSww/SearchTimeline?${generateParams(features, variables)}`;
            } catch(e) {
                console.error(e);
            }
        },
        beforeSendHeaders: xhr => {
            xhr.modReqHeaders['Content-Type'] = 'application/json';
            xhr.modReqHeaders['X-Twitter-Active-User'] = 'yes';
            xhr.modReqHeaders['X-Twitter-Client-Language'] = 'en';
            xhr.modReqHeaders['Authorization'] = localStorage.abuseAPIkeys == '1' ? PUBLIC_TOKENS[(counter++) % 2] : PUBLIC_TOKENS[0];
            delete xhr.modReqHeaders['X-Twitter-Client-Version'];
        },
        afterRequest: xhr => {
            try {
                data = JSON.parse(xhr.responseText);
            } catch(e) {
                console.error(e);
                return [];
            }
            if (data.errors && data.errors[0]) {
                return [];
            }
            let instructions = data.data.search_by_raw_query.search_timeline.timeline.instructions;
            let entries = instructions.find(i => i.entries);
            if(!entries) {
                return [];
            }
            entries = entries.entries;
            let res = [];
            for(let entry of entries) {
                if(entry.entryId.startsWith('sq-I-t-') || entry.entryId.startsWith('tweet-')) {
                    let result = entry.content.itemContent.tweet_results.result;

                    if(entry.content.itemContent.promotedMetadata) {
                        continue;
                    }
                    let tweet = parseTweet(result);
                    if(!tweet) {
                        continue;
                    }
                    res.push(tweet);
                }
            }
            let cursor = entries.find(e => e.entryId.startsWith('sq-cursor-bottom-') || e.entryId.startsWith('cursor-bottom-'));
            if(cursor) {
                cursor = cursor.content.value;
            } else {
                cursor = instructions.find(e => e.entry_id_to_replace && (e.entry_id_to_replace.startsWith('sq-cursor-bottom-') || e.entry_id_to_replace.startsWith('cursor-bottom-')));
                if(cursor) {
                    cursor = cursor.entry.content.value;
                } else {
                    cursor = null;
                }
            }

            return {
                metadata: {
                    cursor,
                    refresh_interval_in_sec: 30
                },
                modules: res.map(t => ({status: {data: t}}))
            };
        }
    },
    {
        path: '/1.1/users/search.json',
        method: 'GET',
        beforeRequest: xhr => {
            try {
                let url = new URL(xhr.modUrl);
                let params = new URLSearchParams(url.search);
                let variables = {
                    rawQuery: params.get('q'),
                    count: 20,
                    querySource: 'typed_query',
                    product: "People",
                };
                let features = {"rweb_lists_timeline_redesign_enabled":false,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_media_download_video_enabled":false,"responsive_web_enhance_cards_enabled":false};

                xhr.modUrl = `${NEW_API}/nK1dw4oV3k4w5TdtcAdSww/SearchTimeline?${generateParams(features, variables)}`;
            } catch(e) {
                console.error(e);
            }
        },
        beforeSendHeaders: xhr => {
            xhr.modReqHeaders['Content-Type'] = 'application/json';
            xhr.modReqHeaders['X-Twitter-Active-User'] = 'yes';
            xhr.modReqHeaders['X-Twitter-Client-Language'] = 'en';
            xhr.modReqHeaders['Authorization'] = localStorage.abuseAPIkeys == '1' ? PUBLIC_TOKENS[(counter++) % 2] : PUBLIC_TOKENS[0];
            delete xhr.modReqHeaders['X-Twitter-Client-Version'];
        },
        afterRequest: xhr => {
            try {
                data = JSON.parse(xhr.responseText);
            } catch(e) {
                console.error(e);
                return [];
            }
            if (data.errors && data.errors[0]) {
                return [];
            }
            let instructions = data.data.search_by_raw_query.search_timeline.timeline.instructions;
            let entries = instructions.find(i => i.entries);
            if(!entries) {
                return [];
            }
            entries = entries.entries;
            let res = [];
            for(let entry of entries) {
                if(entry.entryId.startsWith('sq-I-u-') || entry.entryId.startsWith("user-")) {
                    let result = entry.content.itemContent.user_results.result;
                    if(!result || !result.legacy) {
                        console.log("Bug: no user", entry);
                        continue;
                    }
                    let user = result.legacy;
                    user.id_str = result.rest_id;
                    res.push(user);
                }
            }
            let cursor = entries.find(e => e.entryId.startsWith('sq-cursor-bottom-') || e.entryId.startsWith('cursor-bottom-'));
            if(cursor) {
                cursor = cursor.content.value;
            } else {
                cursor = instructions.find(e => e.entry_id_to_replace && (e.entry_id_to_replace.startsWith('sq-cursor-bottom-') || e.entry_id_to_replace.startsWith('cursor-bottom-')));
                if(cursor) {
                    cursor = cursor.entry.content.value;
                } else {
                    cursor = null;
                }
            }

            return res;
        }
    }
];

// wrap the XMLHttpRequest
XMLHttpRequest = function () {
    return new Proxy(new OriginalXHR(), {
        open(method, url, async, username = null, password = null) {
            this.modMethod = method;
            this.modUrl = url;
            this.originalUrl = url;
            this.modReqHeaders = {};
            this.storage = {};
            
            try {
                let parsedUrl = new URL(url);
                this.proxyRoute = proxyRoutes.find(route => route.path === parsedUrl.pathname && route.method.toUpperCase() === method.toUpperCase());
            } catch(e) {
                console.error(e);
            }
            if(this.proxyRoute && this.proxyRoute.beforeRequest) {
                this.proxyRoute.beforeRequest(this);
            }

            this.open(method, this.modUrl, async, username, password);
        },
        setRequestHeader(name, value) {
            this.modReqHeaders[name] = value;
        },
        send(body = null) {
            if(this.proxyRoute && this.proxyRoute.beforeSendHeaders) {
                this.proxyRoute.beforeSendHeaders(this);
            }
            for (const [name, value] of Object.entries(this.modReqHeaders)) {
                this.setRequestHeader(name, value);
            }
            this.send(body);
        },
        get(xhr, key) {
            if (!key in xhr) return undefined;
            if(key === 'responseText') return this.interceptResponseText(xhr);

            let value = xhr[key];
            if (typeof value === "function") {
                value = this[key] || value;
                return (...args) => value.apply(xhr, args);
            } else {
                return value;
            }
        },
        set(xhr, key, value) {
            if (key in xhr) {
                xhr[key] = value;
            }
            return value;
        },
        interceptResponseText(xhr) {
            if(xhr.proxyRoute && xhr.proxyRoute.afterRequest) {
                let out = xhr.proxyRoute.afterRequest(xhr);
                if(typeof out === "object") {
                    return JSON.stringify(out);
                } else {
                    return out;
                }
            }
            return xhr.responseText;
        }
    });
}

*/