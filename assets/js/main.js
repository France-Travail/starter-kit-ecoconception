// main.js - Gestion de la navigation et de l'accessibilité

document.addEventListener('DOMContentLoaded', function() {
    // Sélecteurs
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const skipLink = document.querySelector('.skip-link');
    
    // État du menu mobile
    let isMobileMenuOpen = false;
    
    // Gestion du menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            isMobileMenuOpen = !isMobileMenuOpen;
            navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isMobileMenuOpen);
            
            // Animation du bouton hamburger
            navToggle.classList.toggle('active');
        });
    }
    
    // Gestion des menus dropdown
    dropdownToggles.forEach(toggle => {
        const dropdownMenu = toggle.nextElementSibling;
        let isOpen = false;
        
        // Interaction au clic
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            isOpen = !isOpen;
            toggle.setAttribute('aria-expanded', isOpen);
            dropdownMenu.classList.toggle('active');
            
            // Fermer les autres dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                    otherToggle.nextElementSibling.classList.remove('active');
                }
            });
        });
        
        // Navigation au clavier
        toggle.addEventListener('keydown', function(e) {
            // Touche Entrée ou Espace
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
            
            // Touche Échap pour fermer
            if (e.key === 'Escape' && isOpen) {
                isOpen = false;
                toggle.setAttribute('aria-expanded', 'false');
                dropdownMenu.classList.remove('active');
                toggle.focus();
            }
            
            // Flèche bas pour ouvrir et aller au premier élément
            if (e.key === 'ArrowDown' && !isOpen) {
                e.preventDefault();
                toggle.click();
                const firstLink = dropdownMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });
        
        // Navigation dans le menu dropdown
        const menuLinks = dropdownMenu.querySelectorAll('a');
        menuLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                // Flèche bas
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = menuLinks[index + 1] || menuLinks[0];
                    nextLink.focus();
                }
                
                // Flèche haut
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = menuLinks[index - 1] || menuLinks[menuLinks.length - 1];
                    prevLink.focus();
                }
                
                // Échap pour fermer et retourner au toggle
                if (e.key === 'Escape') {
                    isOpen = false;
                    toggle.setAttribute('aria-expanded', 'false');
                    dropdownMenu.classList.remove('active');
                    toggle.focus();
                }
                
                // Tab sur le dernier élément ferme le menu
                if (e.key === 'Tab' && !e.shiftKey && index === menuLinks.length - 1) {
                    isOpen = false;
                    toggle.setAttribute('aria-expanded', 'false');
                    dropdownMenu.classList.remove('active');
                }
            });
        });
    });
    
    // Fermer les dropdowns en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item')) {
            dropdownToggles.forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.nextElementSibling.classList.remove('active');
            });
        }
    });
    
    // Gestion du focus pour le skip link
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
    
    // Amélioration progressive : défilement fluide
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Gestion du redimensionnement de la fenêtre
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Réinitialiser le menu mobile sur les grands écrans
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                isMobileMenuOpen = false;
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
            }
        }, 250);
    });
    
    // Amélioration de l'accessibilité : annonce des changements de page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentLinks = document.querySelectorAll(`a[href="${currentPage}"]`);
    currentLinks.forEach(link => {
        link.setAttribute('aria-current', 'page');
    });
});