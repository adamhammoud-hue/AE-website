(() => {
  'use strict';
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const fr = form.dataset.language === 'fr';
  const text = fr ? {
    send: 'Envoyer ma demande', sending: 'Envoi en cours…',
    success: 'Votre demande a bien été transmise. Vous recevrez une réponse par e-mail sous un jour ouvré. Si vous avez demandé un appel, nous conviendrons ensemble d’un horaire.',
    failure: 'Nous n’avons pas pu confirmer l’envoi. Votre message est conservé ci-dessus. Réessayez ou contactez-nous par e-mail avec les liens ci-dessous.',
    activation: 'Le formulaire est momentanément indisponible. Votre message est conservé. Contactez Adam ou Elliott par e-mail avec les liens ci-dessous.',
    whitespace: 'Veuillez remplir ce champ.', subject: 'AE Company — Nouvelle demande via le site', language: 'Français'
  } : {
    send: 'Send my enquiry', sending: 'Sending…',
    success: 'Your enquiry has been submitted. You’ll receive an email reply within one business day. If you requested a call, we’ll agree a time with you.',
    failure: 'We couldn’t confirm delivery. Your message is still above. Please try again or contact us using the email links below.',
    activation: 'The form is temporarily unavailable. Your message is still here. Please email Adam or Elliott using the links below.',
    whitespace: 'Please complete this field.', subject: 'AE Company — New website enquiry', language: 'English'
  };
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('enquiry-status');
  const service = form.elements.namedItem('service');
  const packageSelect = form.elements.namedItem('package');
  const packageField = document.getElementById('enquiry-package-field');
  const callNote = document.getElementById('enquiry-call-note');
  let sending = false;
  const updateService = () => {
    callNote.hidden = service.value !== 'call';
    packageField.hidden = !['website', 'redesign', 'launch'].includes(service.value);
    if (packageField.hidden) packageSelect.value = '';
    const message = form.elements.namedItem('message');
    message.setAttribute('aria-describedby', service.value === 'call'
      ? 'enquiry-message-help enquiry-call-note'
      : 'enquiry-message-help');
  };
  form.addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  });
  service.addEventListener('change', updateService);
  document.querySelectorAll('[data-enquiry-service]').forEach(link => {
    link.addEventListener('click', () => {
      if (sending) return;
      service.value = link.dataset.enquiryService;
      packageSelect.value = link.dataset.enquiryPackage || '';
      updateService();
      form.elements.namedItem('name').focus({preventScroll:true});
    });
  });
  const announce = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
  };
  button.disabled = false;
  updateService();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    for (const key of ['name', 'email', 'message']) {
      const field = form.elements.namedItem(key);
      field.setCustomValidity(field.value.trim() ? '' : text.whitespace);
    }
    if (!form.reportValidity()) return;
    if (form.elements.namedItem('_honey').value) {
      announce(text.failure, 'error');
      return;
    }
    const data = {
      name: form.elements.namedItem('name').value.trim(),
      email: form.elements.namedItem('email').value.trim(),
      service: service.options[service.selectedIndex].text,
      message: form.elements.namedItem('message').value.trim(),
      language: text.language,
      _subject: text.subject,
      _cc: 'elliott.huber@icloud.com',
      _template: 'table',
      _honey: '',
      _url: 'https://aecompany.tech/'
    };
    if (!packageField.hidden && packageSelect.value) data.package = packageSelect.value;
    sending = true;
    button.disabled = true;
    button.textContent = text.sending;
    form.setAttribute('aria-busy', 'true');
    announce(text.sending, 'pending');
    const fields = [...form.querySelectorAll('input, select, textarea')];
    fields.forEach(field => { field.disabled = true; });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(data), signal: controller.signal
      });
      const result = await response.json();
      const activation = /activat|confirm.{0,30}email|verify.{0,30}email/i.test(String(result.message || ''));
      if (activation) {
        announce(text.activation, 'error');
      } else if (response.ok && (result.success === true || result.success === 'true')) {
        form.reset();
        updateService();
        announce(text.success, 'success');
      } else {
        announce(text.failure, 'error');
      }
    } catch {
      announce(text.failure, 'error');
    } finally {
      clearTimeout(timeout);
      fields.forEach(field => { field.disabled = false; });
      sending = false;
      button.disabled = false;
      button.textContent = text.send;
      form.removeAttribute('aria-busy');
      status.focus({preventScroll:true});
    }
  });
})();
