// 🔁 Jan Raj News Auto Notification System
const FEED_URL = "https://janrajnews.blogspot.com/feeds/posts/default?alt=json";
const CHECK_INTERVAL = 60000; // हर 60 सेकंड में नई पोस्ट चेक होगी
let lastPostTitle = "";

async function fetchLatestPost() {
  try {
    const res = await fetch(FEED_URL);
    const data = await res.json();

    const entry = data.feed.entry[0];
    const title = entry.title.$t;
    const link = entry.link.find(l => l.rel === "alternate").href;
    const summary = entry.summary
      ? entry.summary.$t.replace(/<[^>]*>/g, "").substring(0, 100) + "..."
      : "नई खबर पढ़ें!";

    let thumb = "https://raw.githubusercontent.com/janrajnewsmedia/JRNM/refs/heads/main/favicon/favicon.ico";
    if (entry.media$thumbnail) {
      thumb = entry.media$thumbnail.url;
    } else if (entry.content && entry.content.$t.match(/<img[^>]+src=\"([^\">]+)\"/)) {
      thumb = entry.content.$t.match(/<img[^>]+src=\"([^\">]+)\"/)[1];
    }

    if (lastPostTitle !== title) {
      lastPostTitle = title;
      self.registration.showNotification("📰 Jan Raj News", {
        body: title + "\n" + summary,
        icon: thumb,
        image: thumb,
        badge: "https://raw.githubusercontent.com/janrajnewsmedia/JRNM/refs/heads/main/favicon/favicon.ico",
        vibrate: [200, 100, 200],
        data: { url: link }
      });
    }
  } catch (e) {
    console.log("❌ Feed fetch error:", e);
  }
}

// 🔁 हर मिनट में नई पोस्ट चेक
setInterval(fetchLatestPost, CHECK_INTERVAL);

// 🔗 Notification पर क्लिक करने से link खुले
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});