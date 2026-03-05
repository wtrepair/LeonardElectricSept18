(function () {
  const GOOGLE_ADS_ID = 'AW-11310801752';
  const GOOGLE_ADS_CALL_LABEL = 'FX9yCMr93PwbENjGtJEq';
  const GOOGLE_ADS_LEAD_LABEL = 'ua7HCK342vwbENjGtJEq';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  if (!window.__leonardAdsBootstrapped) {
    window.__leonardAdsBootstrapped = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_ADS_ID);
  }

  window.leonardTracking = window.leonardTracking || {
    adsId: GOOGLE_ADS_ID,
    callConversionSendTo: GOOGLE_ADS_ID + '/' + GOOGLE_ADS_CALL_LABEL,
    leadConversionSendTo: GOOGLE_ADS_ID + '/' + GOOGLE_ADS_LEAD_LABEL
  };

  if (typeof window.gtag_report_conversion !== 'function') {
    window.gtag_report_conversion = function (url) {
      const callback = function () {
        if (typeof url !== 'undefined') {
          window.location = url;
        }
      };
      window.gtag('event', 'conversion', {
        send_to: window.leonardTracking.callConversionSendTo,
        event_callback: callback
      });
      return false;
    };
  }

  if (typeof window.trackLeonardLeadConversion !== 'function') {
    window.trackLeonardLeadConversion = function (details) {
      const payload = details || {};
      window.gtag('event', 'conversion', {
        send_to: window.leonardTracking.leadConversionSendTo
      });
      window.gtag('event', 'generate_lead', payload);
      window.dataLayer.push({
        event: 'lead_form_success',
        lead_type: payload.lead_type || 'service_request',
        form_id: payload.form_id || 'unknown'
      });
    };
  }

  window.dataLayer.push({
    event: 'le_page_view',
    page_title: document.title,
    page_path: window.location.pathname
  });

  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!(target instanceof Element) || event.defaultPrevented) {
      return;
    }
    const link = target.closest('a[href]');
    if (!link) {
      return;
    }
    const href = link.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      window.dataLayer.push({
        event: 'phone_click',
        phone_href: href
      });
      window.gtag('event', 'conversion', {
        send_to: window.leonardTracking.callConversionSendTo
      });
      return;
    }
    if (href.indexOf('mailto:') === 0) {
      window.dataLayer.push({
        event: 'email_click',
        email_href: href
      });
    }
  });

  document.addEventListener('submit', function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    const formId = form.id || form.getAttribute('name') || 'form';
    window.dataLayer.push({
      event: 'form_submit_attempt',
      form_id: formId
    });
    window.gtag('event', 'form_submit', {
      form_id: formId
    });
  });
})();
