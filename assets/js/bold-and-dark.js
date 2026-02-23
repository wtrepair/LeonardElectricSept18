(function() {
  "use strict"; // Start of use strict

  function initParallax() {

    if (!('requestAnimationFrame' in window)) return;
    if (/Mobile|Android/.test(navigator.userAgent)) return;

    var parallaxItems = document.querySelectorAll('[data-bss-parallax]');

    if (!parallaxItems.length) return;

    var defaultSpeed = 0.5;
    var visible = [];
    var scheduled;

    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', scroll);

    scroll();

    function scroll() {

      visible.length = 0;

      for (var i = 0; i < parallaxItems.length; i++) {
        var rect = parallaxItems[i].getBoundingClientRect();
        var speed = parseFloat(parallaxItems[i].getAttribute('data-bss-parallax-speed'), 10) || defaultSpeed;

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          visible.push({
            speed: speed,
            node: parallaxItems[i]
          });
        }

      }

      cancelAnimationFrame(scheduled);

      if (visible.length) {
        scheduled = requestAnimationFrame(update);
      }

    }

    function update() {

      for (var i = 0; i < visible.length; i++) {
        var node = visible[i].node;
        var speed = visible[i].speed;

        node.style.transform = 'translate3d(0, ' + (-window.scrollY * speed) + 'px, 0)';
      }

    }
  }

  function initGtmClickTracking() {
    if (!document || !document.addEventListener) return;

    document.addEventListener('click', function(event) {
      var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!anchor) return;

      var rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      var href = rawHref.trim();
      if (!href || href.charAt(0) === '#' || href.toLowerCase().indexOf('javascript:') === 0) return;

      var eventName = null;
      var payload = {
        link_url: href,
        link_text: (anchor.textContent || '').trim()
      };

      if (href.toLowerCase().indexOf('tel:') === 0) {
        eventName = 'phone_click';
      } else if (href.toLowerCase().indexOf('mailto:') === 0) {
        eventName = 'email_click';
      } else {
        try {
          var resolved = new URL(href, window.location.href);
          if ((resolved.protocol === 'http:' || resolved.protocol === 'https:') && resolved.origin !== window.location.origin) {
            eventName = 'outbound_link_click';
            payload.link_domain = resolved.hostname;
            payload.link_url = resolved.href;
          }
        } catch (e) {
          return;
        }
      }

      if (!eventName) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        link_url: payload.link_url,
        link_text: payload.link_text,
        link_domain: payload.link_domain || ''
      });
    }, true);
  }

  initParallax();
  initGtmClickTracking();
})(); // End of use strict
