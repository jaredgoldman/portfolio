# My Portfolia Site

## Build command (Netlify)

Because I'm using Vanilla JS, CSS and HTML, we don't have access to a build step that will inject our env variables into the app runtime. Therefore, we'll utilize Netlify's build command
functionality to insert a `.gitignore`'d file called `config.js` that will include our env variables:

```sh
echo -e "const API_URL = '<API_URL>';\nconst API_KEY = '<API_KEY>';\n\nexport { API_URL, API_TOKEN };" > config.js
```
