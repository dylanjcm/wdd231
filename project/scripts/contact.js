// contact.js - small helper (no heavy logic)
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        // allow default GET submit to form-results.html; here we can do client-side validation or enhancement if desired
        // Example: basic validation / fallback
        if (!form.checkValidity()) {
            e.preventDefault();
            alert('Please fill required fields.');
        }
    });
}
