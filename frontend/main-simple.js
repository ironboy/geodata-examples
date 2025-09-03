async function start() {
  let data = await fetch('/api/images');
  let images = await data.json();
  let html = '';
  for (let image of images) {
    let { latitude, longitude } = image.metadata;
    html += `<section>
      <a href="https://maps.google.com/?q=${image.metadata.latitude},${image.metadata.longitude}" target="_blank">
        <img src="/images/${image.fileName}" alt="Arable land at latitude ${latitude}, longitude ${longitude}">
      </a>
    </section>`;
  }
  document.querySelector('article').innerHTML = html;
}

start();