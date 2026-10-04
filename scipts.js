const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Reveal hidden elements on scroll
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Formspree AJAX Submission without redirecting
    const form = document.getElementById('contactForm');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            const data = new FormData(event.target);

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.style.color = '#87CFEB';
                    status.innerHTML = "Thanks! Your message has been sent successfully.";
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        status.style.color = '#ff4d4d';
                        status.innerHTML = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.style.color = '#ff4d4d';
                        status.innerHTML = "Oops! There was a problem submitting your form.";
                    }
                }
            } catch (error) {
                status.style.color = '#ff4d4d';
                status.innerHTML = "Oops! There was a problem submitting your form.";
            } finally {
                submitBtn.innerText = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }
});