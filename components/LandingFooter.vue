<template>
  <div class="footer">
    <div class="p-4 info-extra">
      <a href="https://spotlightmed.com/">INFORMACIÓN EXTRA</a>
    </div>
    <div class="social-media">
      <div class="redes">
        <a href="https://www.facebook.com/spotlightmed/" target="_blank">FACEBOOK</a>
      </div>
      <div class="redes">
        <a href="https://twitter.com/spotlightmed" target="_blank">TWITTER</a>
      </div>
      <div class="redes">
        <a href="https://www.instagram.com/spotlightmed_/" target="_blank">INSTAGRAM</a>
      </div>
    </div>
  </div>
</template>

<style>
.footer {
  width: 100%;
  background-color: white;
  color: grey;
  text-align: center;
  display: block;
  justify-content: unset;
}
.redes {
  padding: 0.75rem;
}
.redes:last-of-type {
  padding-bottom: 2rem;
}
.social-media {
  display: block;
  justify-content: unset;
}
.footer .info-extra{
  color: black;
}
.footer .redes{
  color: #929292;
}
a {
  color: inherit;
}
@media (min-width: 1100px) {
  .footer {
    display: flex !important;
    justify-content: space-between !important;
  }
  .social-media {
    display: flex !important;
    justify-content: space-between !important;
  }
  .redes {
    padding: 1.5rem;
  }
  .redes:last-of-type {
    padding-bottom: 1.5rem;
  }
}

</style>
