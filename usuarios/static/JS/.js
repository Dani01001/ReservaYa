document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger-btn');

    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    const sections = ['perfil', 'reservas', 'configuracion', 'seguridad', 'personalizacion', 'notificaciones'];
    const menuLinks = Array.from(document.querySelectorAll('.menu a'));
    function onScroll() {
        let scrollPos = window.scrollY || document.documentElement.scrollTop;
        let found = false;
        for (let i = 0; i < sections.length; i++) {
            let section = document.getElementById(sections[i]);
            if (section) {
                let offset = section.offsetTop - 80;
                let nextSection = sections[i+1] ? document.getElementById(sections[i+1]) : null;
                let nextOffset = nextSection ? nextSection.offsetTop - 80 : Infinity;
                if (scrollPos >= offset && scrollPos < nextOffset) {
                    menuLinks.forEach(link => link.classList.remove('scrolled'));
                    if (menuLinks[i]) menuLinks[i].classList.add('scrolled');
                    found = true;
                    break;
                }
            }
        }
        if (!found) menuLinks.forEach(link => link.classList.remove('scrolled'));
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
});