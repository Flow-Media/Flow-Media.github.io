document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementsByTagName("header nav")[0];
  const navLinks = nav.querySelectorAll("nav ul li a");

  window.addEventListener("hashchange", ev => {
    // remove active attribute from all navLinks
    [...navLinks].forEach(
      a => a.hasAttribute("active") && a.removeAttribute("active")
    );

    try {
      // set active link to the current hash
      nav.querySelector(`a[href=${location.hash}]`).setAttribute("active", "");
    } catch (err) {}
  });
});
