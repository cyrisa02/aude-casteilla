/**
 * COOKIE-CONSENT.JS
 * Gestion de la bannière cookies RGPD avec stockage localStorage.
 */

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");
  const consentKey = "aude_casteilla_cookie_consent";

  /**
   * Charge les scripts non essentiels (Analytics, etc.) après consentement.
   * À personnaliser selon vos besoins.
   */
  function loadNonEssentialScripts() {
    console.log(
      "Consentement accepté : chargement des scripts non essentiels.",
    );

    // EXEMPLE : Injection de Google Analytics (à remplacer par votre ID)
    /*
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
        */
  }

  /**
   * Affiche la bannière si aucun consentement n'a été enregistré.
   */
  function initBanner() {
    const storedConsent = localStorage.getItem(consentKey);

    if (!storedConsent) {
      // Pas de choix enregistré : on affiche la bannière
      banner.classList.remove("hidden");
    } else if (storedConsent === "accepted") {
      // Consentement déjà donné : on charge les scripts
      loadNonEssentialScripts();
    }
    // Si 'rejected', on ne fait rien (pas de scripts non essentiels)
  }

  /**
   * Enregistre le choix de l'utilisateur et ferme la bannière.
   * @param {string} choice - 'accepted' ou 'rejected'
   */
  function saveConsent(choice) {
    localStorage.setItem(consentKey, choice);
    banner.classList.add("hidden");

    if (choice === "accepted") {
      loadNonEssentialScripts();
    }
  }

  // --- ÉVÉNEMENTS ---
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => saveConsent("accepted"));
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => saveConsent("rejected"));
  }

  // --- INITIALISATION ---
  initBanner();
});
