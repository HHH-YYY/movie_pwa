// Generating content based on the template
const template =
  `<article>
  <img src='./data/img/placeholder.png' data-src='./data/img/SLUG.webp' alt='NAME'>
  <h3>#POS. NAME</h3>
  <ul>
  <li><span>Name:</span> <a href='https://movie.douban.com/subject/33455421/'><strong>NAME</strong></a></li>
  <li><span>Author:</span>AUTHOR</li>
  <li><span>Starring:</span>STARRING</li>
  <li><span>Release:</span>RELEASE</li>
  <li><span>Country:</span>COUNTRY</li>
  <li><span>Language:</span>LANGUAGE</li>
  <li><span>Length:</span>LENGTH</li>
  <li><span>IMDb:</span>IMDB</li>
  </ul>
</article>`;
let content = '';
for (let i = 0; i < movies.length; i++) {
  let entry = template.replace(/POS/g, (i + 1))
    .replace(/SLUG/g, movies[i].slug)
    .replace(/NAME/g, movies[i].name)
    .replace(/AUTHOR/g, movies[i].author)
    .replace(/STARRING/g, movies[i].starring)
    .replace(/RELEASE/g, movies[i].relaese)
    .replace(/COUNTRY/g, movies[i].country)
    .replace(/LANGUAGE/g, movies[i].language)
    .replace(/LENGTH/g, movies[i].length)
    .replace(/IMDB/g, movies[i].imdb);
  entry = entry.replace('<a href=\'http:///\'></a>', '-');
  content += entry;
}
document.getElementById('content').innerHTML = content;

//=======================================================================
// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// Requesting permission for Notifications after clicking on the button
const button = document.getElementById('notifications');
if (button) {
  button.addEventListener('click', () => {
    Notification.requestPermission().then((result) => {
      if (result == 'granted') {
        randomNotification();
      }
    });
  });
}

// Setting up random Notification
function randomNotification() {
  const randomItem = Math.floor(Math.random() * movies.length);
  const notifTitle = movies[randomItem].name;
  const notifBody = `Created by ${movies[randomItem].author}.`;
  const notifImg = `./data/img/${movies[randomItem].slug}.webp`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000);
}

// Progressive loading images
const imagesToLoad = document.querySelectorAll('img[data-src]');
const loadImages = (image) => {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items) => {
    items.forEach((item) => {
      if (item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target);
      }
    });
  });
  imagesToLoad.forEach((img) => {
    observer.observe(img);
  });
} else {
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
}
