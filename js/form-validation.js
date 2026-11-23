/**
 * FORM-VALIDATION.JS
 * Validation temps réel, accessibilité ARIA et mockup d'envoi pour le formulaire de contact.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const formFeedback = document.getElementById("form-feedback");
  const spinner = submitBtn.querySelector(".spinner");
  const btnText = submitBtn.querySelector(".btn-text");
  const honeypot = document.getElementById("website");

  // Règles de validation (fonctions retournant true si valide)
  const validators = {
    name: (value) => value.trim().length >= 2,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: (value) => value.trim().length >= 10,
    rgpd: (checked) => checked === true,
  };

  // Messages d'erreur personnalisés par champ
  const errorMessages = {
    name: "Veuillez entrer votre nom complet (2 caractères minimum).",
    email:
      "Veuillez entrer une adresse email valide au format nom@domaine.com.",
    message: "Votre message doit contenir au moins 10 caractères.",
    rgpd: "Vous devez accepter la politique de confidentialité pour continuer.",
  };

  /**
   * Affiche ou masque un message d'erreur pour un champ donné.
   * @param {HTMLElement} field - Le champ input/select/textarea
   * @param {boolean} isValid - L'état de validité
   */
  function toggleError(field, isValid) {
    const errorSpan = document.getElementById(`${field.id}-error`);

    if (!isValid) {
      field.setAttribute("aria-invalid", "true");
      field.classList.add("is-invalid");
      if (errorSpan) {
        errorSpan.textContent =
          errorMessages[field.name] || "Ce champ est invalide.";
        errorSpan.classList.add("visible");
      }
    } else {
      field.setAttribute("aria-invalid", "false");
      field.classList.remove("is-invalid");
      if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.classList.remove("visible");
      }
    }
    return isValid;
  }

  /**
   * Valide un champ spécifique selon son nom.
   * @param {HTMLElement} field - Le champ à valider
   * @returns {boolean} - Vrai si valide
   */
  function validateField(field) {
    const validator = validators[field.name];
    if (!validator) return true; // Pas de règle, considéré comme valide

    let isValid = false;
    if (field.type === "checkbox") {
      isValid = validator(field.checked);
    } else {
      isValid = validator(field.value);
    }
    return toggleError(field, isValid);
  }

  // --- ÉVÉNEMENTS DE VALIDATION EN TEMPS RÉEL (au blur) ---
  const fieldsToValidate = ["name", "email", "message", "rgpd"];

  fieldsToValidate.forEach((fieldName) => {
    const field = form.elements[fieldName];
    if (!field) return;

    // Validation lors de la perte de focus
    field.addEventListener("blur", () => {
      validateField(field);
    });

    // Réinitialisation de l'erreur lors de la saisie
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        toggleError(field, true);
      }
    });

    // Cas spécifique de la checkbox
    if (field.type === "checkbox") {
      field.addEventListener("change", () => {
        validateField(field);
      });
    }
  });

  // --- SOUMISSION DU FORMULAIRE ---
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // On empêche l'envoi réel (mockup)

    // 1. Vérification du honeypot anti-spam
    if (honeypot && honeypot.value !== "") {
      // Si le champ caché est rempli, c'est un bot. On simule un succès sans rien faire.
      console.warn("Spam détecté via honeypot.");
      return;
    }

    // 2. Validation de tous les champs requis
    let isFormValid = true;
    fieldsToValidate.forEach((fieldName) => {
      const field = form.elements[fieldName];
      if (field && !validateField(field)) {
        isFormValid = false;
      }
    });

    // Si le formulaire n'est pas valide, on focus le premier champ en erreur
    if (!isFormValid) {
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // 3. Simulation de l'envoi (UX)
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    if (spinner) spinner.classList.remove("hidden");
    if (btnText) btnText.textContent = "Envoi en cours...";
    formFeedback.classList.add("hidden");
    formFeedback.className = "form-feedback hidden";

    // Simulation d'une requête réseau (1.5 secondes)
    setTimeout(() => {
      // Réinitialisation du bouton
      submitBtn.disabled = false;
      submitBtn.setAttribute("aria-busy", "false");
      if (spinner) spinner.classList.add("hidden");
      if (btnText) btnText.textContent = "Envoyer ma demande";

      // Affichage du message de succès
      formFeedback.textContent =
        "Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 24 à 48 heures ouvrées.";
      formFeedback.className = "form-feedback success visible";

      // Réinitialisation complète du formulaire
      form.reset();

      // Nettoyage des états d'erreur
      fieldsToValidate.forEach((fieldName) => {
        const field = form.elements[fieldName];
        if (field) toggleError(field, true);
      });

      // Focus sur le message de succès pour les lecteurs d'écran
      formFeedback.setAttribute("tabindex", "-1");
      formFeedback.focus();
    }, 1500); // Délai simulé
  });
});
