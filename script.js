// Stuart Deets — lightweight SPA-style page switching
(function () {
    'use strict';

    var PAGES = ['home', 'cv', 'teaching'];

    var navLinks  = document.getElementById('navLinks');
    var navToggle = document.getElementById('navToggle');

    function showPage(page, push) {
        if (PAGES.indexOf(page) === -1) { page = 'home'; }

        document.querySelectorAll('.page').forEach(function (section) {
            section.classList.toggle('active', section.id === page);
        });

        document.querySelectorAll('.nav-link').forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-page') === page);
        });

        if (push && ('#' + page) !== window.location.hash) {
            history.pushState({ page: page }, '', '#' + page);
        }

        window.scrollTo({ top: 0, behavior: 'auto' });
        closeMenu();
    }

    function openMenu() {
        if (!navLinks) { return; }
        navLinks.classList.add('open');
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        if (!navLinks) { return; }
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // Delegate clicks for anything carrying a data-page attribute
    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-page]');
        if (!trigger) { return; }
        e.preventDefault();
        showPage(trigger.getAttribute('data-page'), true);
    });

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            if (navLinks.classList.contains('open')) { closeMenu(); }
            else { openMenu(); }
        });
    }

    // Back / forward buttons
    window.addEventListener('popstate', function () {
        showPage((window.location.hash || '#home').slice(1), false);
    });

    // Initial load — honor any incoming hash
    showPage((window.location.hash || '#home').slice(1), false);
})();
