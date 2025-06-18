# GalleryAppSDK53

A React Native gallery app built with Expo, featuring:
- Infinite scroll (pagination) of recent Flickr photos
- Search functionality for any keyword (e.g., cat, dog)
- Bottom tab navigation (Home & Search)
- Offline cache for recent images
- Snackbar with retry for network errors
- Modern, responsive UI

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app

```bash
npm start
```

- Scan the QR code with Expo Go, or run on an emulator/simulator.

---

## 📱 Features

### Home Tab
- Displays recent photos from Flickr.
- Infinite scroll: loads more images as you scroll.
- Loader appears at the bottom during pagination.
- Offline support: shows cached images if offline.
- Snackbar with "Retry" on network failure.

### Search Tab
- Search for any keyword (e.g., "cat", "dog", etc.).
- Infinite scroll for search results.
- Loader at the bottom during pagination.
- Snackbar with "Retry" on network failure.

### Navigation
- Bottom tab navigation using React Navigation.

---

## 🛠️ Project Structure

```
GalleryAppSDK53/
  App.js              # App entry, navigation setup
  HomeScreen.js       # Home tab: recent photos, pagination
  SearchScreen.js     # Search tab: search & pagination
  assets/             # App assets (icons, etc.)
  index.js            # Expo entry point
  package.json        # Dependencies and scripts
  ...
```

---

## 🧩 Dependencies

- **Expo** (React Native framework)
- **@react-navigation/native** & **@react-navigation/bottom-tabs** (navigation)
- **react-native-paper** (Snackbar, UI)
- **@react-native-async-storage/async-storage** (offline cache)
- **Flickr API** (photo data)

---

## 📝 Customization

- Change the Flickr API key or endpoints in `HomeScreen.js` and `SearchScreen.js` if needed.
- Update styles in each screen for a custom look.

---

## ❓ Troubleshooting

- If you see the Expo Router welcome screen, ensure your `package.json` has `"main": "index.js"` and you are not using the `app/` directory for routing.
- For dependency issues, delete `node_modules` and `package-lock.json`, then run `npm install` again.

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Flickr API Docs](https://www.flickr.com/services/api/)

---

## © 2024 GalleryAppSDK53
