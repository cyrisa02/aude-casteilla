/**
 * MAIN.JS
 * Interactions globales : Sticky CTA mobile, Carrousel de témoignages, Lazy-load vidéos.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================================
       1. STICKY CTA MOBILE
       Affiche un bouton fixe en bas de l'écran après le défilement du Hero.
       ====================================================================== */
  const heroSection = document.querySelector(".hero");
  const stickyCta = document.createElement("a");

  // Création dynamique du bouton sticky pour ne pas polluer le HTML
  stickyCta.href = "#contact";
  stickyCta.className = "sticky-cta btn btn-primary";
  stickyCta.textContent = "Réserver ma place";
  stickyCta.setAttribute("aria-label", "Réserver ma place en Masterclass");
  stickyCta.style.display = "none"; // Caché par défaut
  document.body.appendChild(stickyCta);

  if (heroSection) {
    // IntersectionObserver pour détecter quand le Hero sort de l'écran
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si le Hero n'est plus visible, on affiche le bouton sticky
          if (!entry.isIntersecting) {
            stickyCta.style.display = "flex";
            // Animation d'apparition
            setTimeout(() => stickyCta.classList.add("sticky-cta-visible"), 50);
          } else {
            stickyCta.classList.remove("sticky-cta-visible");
            // On attend la fin de l'animation avant de cacher complètement
            setTimeout(() => {
              if (!stickyCta.classList.contains("sticky-cta-visible")) {
                stickyCta.style.display = "none";
              }
            }, 300);
          }
        });
      },
      { threshold: 0.1 },
    ); // Déclenche quand 10% du Hero est visible

    observer.observe(heroSection);
  }

  /* ======================================================================
       2. CARROUSEL DE TÉMOIGNAGES (Mobile)
       Ajoute des boutons de navigation pour le scroll-snap sur mobile.
       ====================================================================== */
  const testimonialGrid = document.querySelector(".testimonial-grid");

  if (testimonialGrid && window.innerWidth < 768) {
    // On passe le grid en mode flex + scroll horizontal sur mobile
    testimonialGrid.classList.add("testimonial-carousel");

    // Création des boutons de navigation (précédent / suivant)
    const navContainer = document.createElement("div");
    navContainer.className = "carousel-nav";

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "&larr;";
    prevBtn.setAttribute("aria-label", "Témoignage précédent");
    prevBtn.className = "carousel-btn";

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "&rarr;";
    nextBtn.setAttribute("aria-label", "Témoignage suivant");
    nextBtn.className = "carousel-btn";

    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    testimonialGrid.parentNode.insertBefore(
      navContainer,
      testimonialGrid.nextSibling,
    );

    // Logique de défilement
    const scrollAmount = testimonialGrid.offsetWidth; // Largeur d'une carte

    prevBtn.addEventListener("click", () => {
      testimonialGrid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      testimonialGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  /* ======================================================================
       3. LAZY LOADING DES VIDÉOS (Optionnel)
       Si vous intégrez des iframes vidéo, ce script les charge au clic.
       ====================================================================== */
  const videoThumbnails = document.querySelectorAll(".video-thumbnail");

  videoThumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const videoUrl = thumb.getAttribute("data-video-url");
      if (videoUrl) {
        const iframe = document.createElement("iframe");
        iframe.src = videoUrl;
        iframe.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        );
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("title", "Extrait vidéo du spectacle");
        iframe.className = "video-iframe";

        // Remplacement de la miniature par l'iframe
        thumb.replaceWith(iframe);
      }
    });
  });

  /* ======================================================================
       4. GESTION DU MENU MOBILE (Optionnel - si vous ajoutez un burger menu)
       ====================================================================== */
  // À implémenter si vous souhaitez un menu hamburger sur mobile.
  // Le header actuel masque simplement les liens sur mobile (voir CSS).

  console.log("Main.js chargé et exécuté avec succès.");
});
