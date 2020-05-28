document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("header nav");
  const navLinks = nav.querySelectorAll("nav ul li a");

  function navLinksRemoveActive() {
    [...navLinks].forEach(
      a => a.hasAttribute("active") && a.removeAttribute("active")
    );
  }

  window.addEventListener("hashchange", ev => {
    // remove active attribute from all navLinks
    navLinksRemoveActive();

    try {
      // set active link to the current hash
      nav
        .querySelector(`a[href="${location.hash}"]`)
        .setAttribute("active", "");
    } catch (err) {}
  });

  window.addEventListener("scroll", ev => {
    const currentSectionLink =
      navLinks[~~(window.scrollY / window.innerHeight)];

    if (currentSectionLink) {
      navLinksRemoveActive();
      currentSectionLink.setAttribute("active", "");
    }
  });
});
