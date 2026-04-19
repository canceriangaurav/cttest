function bootContactModal() {
  const modal = document.getElementById('enquiryModal');
  const openButtons = document.querySelectorAll('[data-open-enquiry]');
  const closeButton = document.getElementById('closeEnquiry');
  const backdrop = modal?.querySelector('.ct-enquiry-modal__backdrop');

  const form = document.querySelector('.ct-enquiry-form');
  const formTimeInput = document.getElementById('formTime');

  if (!modal || !openButtons.length) return;

  // =========================
  // MODAL LOGIC
  // =========================

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ct-modal-open');

    // reset form timer (spam protection)
    if (formTimeInput) {
      formTimeInput.value = Date.now();
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ct-modal-open');
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', openModal);
  });

  closeButton?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // =========================
  // FORM LOGIC
  // =========================

  if (!form) return;

  let isSubmitting = false;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn?.textContent || 'Submit Enquiry';

  const setLoadingState = (isLoading) => {
    if (!submitBtn) return;

    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Submitting...' : originalBtnText;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    setLoadingState(true);

    const formData = new FormData(form);

    try {
      const res = await fetch('/api/enquiry.php', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        // redirect to thank you page
        window.location.href = 'thankyou.html';
        return;
      }

      // error from server
      alert(data.error || 'Something went wrong');
      isSubmitting = false;
      setLoadingState(false);

    } catch (err) {
      console.error(err);
      alert('Server error. Please try again.');

      isSubmitting = false;
      setLoadingState(false);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootContactModal, { once: true });
} else {
  bootContactModal();
}