/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/404/index.html","a202962e50448a652a5ac7760a6185ca"],["/Adapt-New-Features-of-Android-Nougat/index.html","58cb2bb56c8654481536d0b38a302a10"],["/Android-ANR/index.html","ea6f823d0d5162871ba1b051ea00e647"],["/Android-Tools-attributes-listItem-sample-data-rocks/index.html","9784ed04a2679e9279e291196221e2ae"],["/Apply-Global-Fonts-With-Fonts-in-XML/index.html","ec6b82b2aaa2a258ccb6851ae8a96236"],["/Charles/index.html","9f515644830971aa3b2733096420b9a4"],["/Develop-an-Android-App-and-Publish-it-on-Google-Play-in-a-Week/index.html","0d654726cde82b253282c2d61915308b"],["/Explore-the-Lifecycle-of-Fragment/index.html","d069766301732a56c2ee07afddc3aab5"],["/Gaussian-Blur-With-RenderScript/index.html","f7deac46ab76192257890468e1abaaa0"],["/How-to-Use-DeepLinkDispatch/index.html","34a7d6a1e214723e1ef01afc37d7664b"],["/Improve-experience-Support-Chrome-Custom-Tabs/index.html","f5e28d54a6b5c9d24c7ae78e5f6153de"],["/Install-GCC-on-macOS/index.html","6e88d61bf9fd8aba0fdf24485079312d"],["/Lambda-Expression-on-Android/index.html","3f28014b1b4090a32c83352be4056c98"],["/Launch-mode-of-Activity-on-Android/index.html","e8dd037f99e2dcebab5afb693ae3bebd"],["/LeetCode-1-to-50-solutions/index.html","6a049720f91e548687e1b7030960af1f"],["/Make-Android-Application-Barcode-and-QRcode-Aware/index.html","8b024c99fcec5b9f0275351224d4f249"],["/Migrate-the-Android-Project-to-Kotlin-Coroutines/index.html","e57cda1a0f41e5a6ad04d311733cfdf0"],["/Night-Mode-on-Android/index.html","10b2057619353e011697ad5eaf2e0462"],["/Onboarding-Pages-of-Material-Design-With-ViewPager/index.html","06bb950b8a17ee633f9b024a6cd1b482"],["/Process-Thread/index.html","b5c797311c4c39d7ff75cc1d421f20d8"],["/Realm-on-Android/index.html","d54e1fc58e4423a1315460db8276bc7d"],["/Reduce-Size-of-APK/index.html","8a3edd53741c4535cae3bfe4ee815ad2"],["/Singleton-Pattern-in-Java/index.html","84435c549dee5b318e12120c1b575211"],["/Summary-of-2016/index.html","92df036aeaaff8c11bfe88f1d6441704"],["/Swipe-to-Delete-RecyclerView-Item/index.html","34d1c46e08deea6a70afcfa818298a22"],["/Translation-Exploring-the-v28-Android-Design-Support-Library-Additions/index.html","59aebe5d52843b982ed758c0405bf450"],["/XLog-1/index.html","93d2c122e06076bf736e743b8a7080ec"],["/Zhihu-zhuanlan-API-analysis/index.html","6b5cc966c22375f9073770f7d2f567fe"],["/about/index.html","23401612941c14d061775694d0aa129a"],["/assets/css/main.css","533a935e31418fedf0d0f03d2e1eb398"],["/assets/img/favicon.jpg","9bd1c470216533d835288c8a61128d4e"],["/assets/img/icons/android-chrome-192x192.png","42a0f1ebdd652fb4b2d72b2b5afe1f9b"],["/assets/img/icons/android-chrome-256x256.png","02eb1fc8f2ebeefaa0d0799d282432bb"],["/assets/img/icons/apple-touch-icon.png","4fd8cbdd458ff76d8c17597988b6b1fc"],["/assets/img/icons/favicon-16x16.png","0a255e6544dddc9aa9c0a8706dcf6389"],["/assets/img/icons/favicon-32x32.png","5aa04dd76c6a1e95b4a3c54f5031c073"],["/assets/img/icons/icon-github.svg","4e06335104a29f91e08d4ef420da7679"],["/assets/img/icons/icon-instagram.svg","1e1119e2628235ee4c8771bff15eb2ca"],["/assets/img/icons/icon-twitter.svg","30551913d5399d6520e8a74b6f1e23f0"],["/assets/img/icons/icon-weibo.svg","4a22958d9430f53daaa247d279ec5581"],["/assets/img/icons/icon-zhihu.svg","5dd6b34b10dfb4ef3c2f20af3c434010"],["/assets/img/icons/mstile-150x150.png","a43cd2d899f196fc846af02474a09b32"],["/assets/img/icons/safari-pinned-tab.svg","5f8bbd68c3f378cad8e576d32d5f5140"],["/assets/img/posts/design.jpg","b2a4e5a5704add0a5bbd0e102075dde3"],["/assets/img/posts/design_lg.jpg","3e300608439e511a90c31454d5b0561d"],["/assets/img/posts/design_md.jpg","1cf79509520653e56e4e4ca7727a4f35"],["/assets/img/posts/design_placehold.jpg","3197472b3a14c3f0e27d1d222f8374ef"],["/assets/img/posts/design_sm.jpg","ff8b7f1a573cc02b1e950f78d56b8a91"],["/assets/img/posts/design_thumb.jpg","832661b89ebfdfac66f6756ddde19504"],["/assets/img/posts/design_thumb@2x.jpg","75716038d4777c7eff08d4c7db72a887"],["/assets/img/posts/design_xs.jpg","f44bb784b2a3b504ef524202d100260d"],["/assets/img/posts/emile-perron-190221.jpg","4705474281b975b7a213b96e71f772e7"],["/assets/img/posts/emile-perron-190221_lg.jpg","aafe35b1dc6d9dc9293c8c2ef4121046"],["/assets/img/posts/emile-perron-190221_md.jpg","03ed35ed656429599daba312f0990a0f"],["/assets/img/posts/emile-perron-190221_placehold.jpg","67f40708f69ab671cee04d624258b85c"],["/assets/img/posts/emile-perron-190221_sm.jpg","4ce4178a62d5a456e90e7bc47bde50f5"],["/assets/img/posts/emile-perron-190221_thumb.jpg","f20085dfe2e36854f8a12f1fd6c50425"],["/assets/img/posts/emile-perron-190221_thumb@2x.jpg","b8fa22c3237de529316037f093b9cb4d"],["/assets/img/posts/emile-perron-190221_xs.jpg","ac32cbd525d72e932499668af5647d03"],["/assets/img/posts/raindrop_glass.jpg","c9c1b005964ba770bf6fa79dda268993"],["/assets/img/posts/raindrop_glass_lg.jpg","d5d8c014b24d5ee1e0449816d2580b63"],["/assets/img/posts/raindrop_glass_md.jpg","7d33890022701e3d589672e8d776d616"],["/assets/img/posts/raindrop_glass_placehold.jpg","0488481cc73204c4dc8b7bd2db85f64c"],["/assets/img/posts/raindrop_glass_sm.jpg","1a8d4c9fe1d9e2e16c6cb102f01cc6ec"],["/assets/img/posts/raindrop_glass_thumb.jpg","5f4aae4584d2e27eb461f1ab76aa1af6"],["/assets/img/posts/raindrop_glass_thumb@2x.jpg","ed9389145fbb2ed0ea56ba7f226d6d00"],["/assets/img/posts/raindrop_glass_xs.jpg","2095b76298097d5cf14ea5edf09614ff"],["/assets/img/posts/shane-rounce-205187.jpg","bb774d6e05b2b55ffdabe11a8aac7c56"],["/assets/img/posts/shane-rounce-205187_lg.jpg","83cd838024fff9c3faec59fa1da97872"],["/assets/img/posts/shane-rounce-205187_md.jpg","628cf27bf658cf6de9df79ab9bf2cb2d"],["/assets/img/posts/shane-rounce-205187_placehold.jpg","249fc4a09bcfcbd7d5764f14c14ae82e"],["/assets/img/posts/shane-rounce-205187_sm.jpg","a2400a468e10d7d64528ac9c6bc3b6f0"],["/assets/img/posts/shane-rounce-205187_thumb.jpg","c3b2dd0d95a6d3a44d7702f8c06b1e78"],["/assets/img/posts/shane-rounce-205187_thumb@2x.jpg","b0722b63a92c92a44cd92c0201fc92a4"],["/assets/img/posts/shane-rounce-205187_xs.jpg","cd58fd23f3b3c1de2183beb9ed08327b"],["/assets/img/posts/sleek.jpg","a32252a618ffe8ae57c9ce9ab157a01b"],["/assets/img/posts/sleek_lg.jpg","95a1338aa524727f34950f269133e904"],["/assets/img/posts/sleek_md.jpg","4e35ceb2f5fffd3d758fade699b0b85a"],["/assets/img/posts/sleek_placehold.jpg","0f48050cd7776895b98c6ce21597ff39"],["/assets/img/posts/sleek_sm.jpg","f30af3d30b7df905d962e494750f5da0"],["/assets/img/posts/sleek_thumb.jpg","f7b8a94ac9da8e5ea36bb9e459872400"],["/assets/img/posts/sleek_thumb@2x.jpg","e67e2129dc58a100b98a5e027c964dbc"],["/assets/img/posts/sleek_xs.jpg","c8212cace6d446950556a3bf6efe4520"],["/assets/img/posts/work.jpg","2af10eea41e372f34c904e9183624db6"],["/assets/img/posts/work_lg.jpg","4d9afa9d8f96c9f5795f2515746685ca"],["/assets/img/posts/work_md.jpg","2b7fa4e5abec780d51bbd9d838d72d5a"],["/assets/img/posts/work_placehold.jpg","14c1ff8caab27d3126d98e06bd789b99"],["/assets/img/posts/work_sm.jpg","6125122cbbba520ec9cb790719b188d4"],["/assets/img/posts/work_thumb.jpg","7363420c867d1f3c19f826c85f9d231b"],["/assets/img/posts/work_thumb@2x.jpg","d4c906dd5d9adca04d51d87c1ad44b96"],["/assets/img/posts/work_xs.jpg","1795418f587eccfb3b58a4e78ed89237"],["/assets/js/bundle.js","df854a763d7d3fd95381b95081eb822f"],["/categories/index.html","b05209edd9eb6b1936924ddadfb82818"],["/contact/index.html","024226064dd84dea6743d4f35e948079"],["/index.html","be5e494f84a57497f54379525500f21a"],["/links/index.html","77a01b80a7849d3e6eb646418cd7647e"],["/macOS-Mojave-Hands-On/index.html","68784d8c62917a6300e8a6f3e4c57f85"],["/markdown-cheatsheet/index.html","42aef90611bc49b4395e9c9a8f8cd472"],["/sw.js","41c4fdc3770540e8e9e98a4a7da068e8"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







