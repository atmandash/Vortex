document.addEventListener('DOMContentLoaded', () => {
    // Dropdown Logic
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.nav-dropbtn');
        const content = dropdown.querySelector('.nav-dropdown-content');

        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            // Close all others
            document.querySelectorAll('.nav-dropdown-content').forEach(c => {
                if (c !== content) c.classList.remove('show');
            });
            content.classList.toggle('show');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown-content').forEach(c => {
            c.classList.remove('show');
        });
    });

    // Smooth Scroll for Logo
    const topLogo = document.getElementById('top-logo');
    if (topLogo) {
        topLogo.addEventListener('click', (e) => {
            // Only scroll if we are currently on index.html or root
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'index.html' || currentPage === '') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Modal Logic for Events Page
    const modal = document.getElementById('registrationModal');
    if (modal) {
        const closeBtn = document.getElementById('closeModal');
        const registerBtns = document.querySelectorAll('.register-btn');
        const form = document.getElementById('registrationForm');

        // Open Modal
        registerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const eventTitle = btn.getAttribute('data-event');
                const eventPrice = btn.getAttribute('data-price');

                document.getElementById('modalEventTitle').textContent = eventTitle;
                document.getElementById('modalEventPrice').textContent = eventPrice;

                modal.style.display = 'flex';
            });
        });

        // Close Modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close on clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle Form Submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const eventName = document.getElementById('modalEventTitle').textContent;
            const eventPrice = document.getElementById('modalEventPrice').textContent;

            try {
                const response = await fetch('/api/register-event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        contactNumber: phone,
                        eventName,
                        eventPrice
                    })
                });

                if (response.ok) {
                    alert(`Thanks ${fullName}! You have successfully registered for "${eventName}". Confirmation sent to your email.`);
                    modal.style.display = 'none';
                    form.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Registration failed: ${errorData.message}`);
                }
            } catch (err) {
                console.error('Error submitting form:', err);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // Hospital Sorting Logic
    const hospitalSort = document.getElementById('hospitalSort');
    const hospitalList = document.getElementById('hospitalList');

    if (hospitalSort && hospitalList) {
        hospitalSort.addEventListener('change', () => {
            const sortBy = hospitalSort.value;
            const hospitals = Array.from(hospitalList.children);

            hospitals.sort((a, b) => {
                if (sortBy === 'rating') {
                    // Sort by rating (High to Low)
                    const ratingA = parseFloat(a.dataset.rating);
                    const ratingB = parseFloat(b.dataset.rating);
                    return ratingB - ratingA;
                } else {
                    // Sort by distance (Low to High)
                    const distA = parseFloat(a.dataset.distance);
                    const distB = parseFloat(b.dataset.distance);
                    return distA - distB;
                }
            });

            // Re-append sorted elements
            hospitals.forEach(hospital => hospitalList.appendChild(hospital));
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
